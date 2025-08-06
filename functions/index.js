const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const cors = require("cors");
const { db } = require("./firebaseAdmin.js");
const {
  createS3Client,
  generateUploadURL,
  generateDownloadURL,
} = require("./s3.js");
const {
  createBedrockClient,
  getTitanEmbedding,
  getTitanTextEmbedding,
  getNorm,
} = require("./titan.js");
const { searchImages } = require("./search.js");
const { resize } = require("./Resize.js");
const { Pinecone } = require("@pinecone-database/pinecone");
const fetch = require("node-fetch");

// Define secrets
const pineconeApiKey = defineSecret("PINECONE_API_KEY");
const pineconeIndex = defineSecret("PINECONE_INDEX");
const pineconeControllerUrl = defineSecret("PINECONE_CONTROLLER_URL");
const s3AccessKeyId = defineSecret("S3_ACCESS_KEY_ID");
const s3SecretAccessKey = defineSecret("S3_SECRET_ACCESS_KEY");
const titanAccessKeyId = defineSecret("TITAN_ACCESS_KEY_ID");
const titanSecretAccessKey = defineSecret("TITAN_SECRET_ACCESS_KEY");

// Set global options for all functions
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

// CORS middleware
const corsHandler = cors({ origin: true });

// Test endpoint
exports.test = onRequest(
  { secrets: [pineconeApiKey, s3AccessKeyId, titanAccessKeyId] },
  (req, res) => {
    corsHandler(req, res, () => {
      res.json({
        message: "Firebase Functions server is running",
        env: {
          hasPinecone: !!pineconeApiKey.value().trim(),
          hasS3: !!s3AccessKeyId.value().trim(),
          hasTitan: !!titanAccessKeyId.value().trim(),
        },
      });
    });
  }
);

// Generate S3 upload URL
exports.generateUrl = onRequest(
  { secrets: [s3AccessKeyId, s3SecretAccessKey] },
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const folder = req.query.folder;
        const s3Client = createS3Client(
          s3AccessKeyId.value().trim(),
          s3SecretAccessKey.value().trim()
        );
        const { url, key: imageName } = await generateUploadURL(
          folder,
          s3Client
        );
        console.log(url);
        res.send({ url, imageName });
      } catch (error) {
        console.error("Error generating URL:", error);
        res.status(500).json({ error: "Error generating URL" });
      }
    });
  }
);

// Save lost item with AI embedding and matching
exports.saveLostSomething = onRequest(
  {
    secrets: [
      pineconeApiKey,
      pineconeIndex,
      pineconeControllerUrl,
      s3AccessKeyId,
      s3SecretAccessKey,
      titanAccessKeyId,
      titanSecretAccessKey,
    ],
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      console.log("post request successful");
      try {
        const {
          userId,
          itemName,
          locationLost,
          description,
          imageName,
          foundItemMatch,
        } = req.body;

        const itemMap = {
          itemName: itemName,
          locationLost: locationLost,
          description: description,
          imageName: imageName,
        };

        // Add to user's lost items
        await addLostItemToUser(userId, itemMap);

        if (!imageName) {
          return res.status(400).json({ error: "Image key is required" });
        }

        // Initialize Pinecone with secrets
        const pinecone = new Pinecone({
          apiKey: pineconeApiKey.value().trim(),
        });

        const lostItems = pinecone
          .index(
            pineconeIndex.value().trim(),
            pineconeControllerUrl.value().trim()
          )
          .namespace("lost-items");

        const foundItems = pinecone
          .index(
            pineconeIndex.value().trim(),
            pineconeControllerUrl.value().trim()
          )
          .namespace("found-items");

        const sentence = `${itemName} ${description}`;
        const s3Client = createS3Client(
          s3AccessKeyId.value().trim(),
          s3SecretAccessKey.value().trim()
        );
        console.log("Signing time (local):", new Date().toISOString());
        const downloadUrl = await generateDownloadURL(imageName, s3Client);
        console.log("received url");
        console.log("fetch type:", typeof fetch);
        console.log(downloadUrl);
        let response;
        try {
          response = await fetch(downloadUrl);
        } catch (error) {
          console.log("Error getting download url", error);
        }
        console.log("message: ", response);
        console.log("fetch status: ", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch image from S3");
        }

        const buffer = await response.arrayBuffer();
        console.log("Buffer byte length: ", buffer.byteLength);
        const imageBytes = Buffer.from(buffer);
        const resizedImageBytes = await resize(imageBytes);
        if (imageBytes.length == 0) {
          throw new Error("ImageBytes is Empty");
        }

        const bedrockClient = createBedrockClient(
          titanAccessKeyId.value().trim(),
          titanSecretAccessKey.value().trim()
        );
        let embedding;
        try {
          embedding = await getTitanEmbedding(resizedImageBytes, bedrockClient);
        } catch (error) {
          console.error("Error getting embedding:", error);
          return res.status(500).json({ error: "Error getting embedding" });
        }

        let textEmbedding;
        try {
          textEmbedding = await getTitanTextEmbedding(sentence, bedrockClient);
        } catch (error) {
          return res
            .status(500)
            .json({ error: `Error generating text embedding ${error}` });
        }

        const combined = await getNorm(embedding, textEmbedding);
        const id = imageName;

        const matches = await searchImages(foundItems, combined);
        console.log("here are the matches only: ", matches);

        await lostItems.upsert([
          {
            id,
            values: combined,
            metadata: {
              itemName,
              locationLost,
              description,
              userId,
              foundItemMatch,
            },
          },
        ]);

        res.status(200).json({
          message: "Item saved successfully",
          matches: matches,
          lostItemId: id,
        });
      } catch (error) {
        console.error("Error saving item:", error);
        res.status(500).json({ error: "Error saving item" });
      }
    });
  }
);

// Save found item with AI embedding and matching
exports.saveFoundSomething = onRequest(
  {
    secrets: [
      pineconeApiKey,
      pineconeIndex,
      pineconeControllerUrl,
      s3AccessKeyId,
      s3SecretAccessKey,
      titanAccessKeyId,
      titanSecretAccessKey,
    ],
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      console.log("post request successful");
      try {
        const { itemName, locationFound, description, returnedTo, imageName } =
          req.body;
        const sentence = `${itemName} ${description}`;

        if (!imageName) {
          return res.status(400).json({ error: "Image key is required" });
        }

        // Initialize Pinecone with secrets
        const pinecone = new Pinecone({
          apiKey: pineconeApiKey.value().trim(),
        });

        const lostItems = pinecone
          .index(
            pineconeIndex.value().trim(),
            pineconeControllerUrl.value().trim()
          )
          .namespace("lost-items");

        const foundItems = pinecone
          .index(
            pineconeIndex.value().trim(),
            pineconeControllerUrl.value().trim()
          )
          .namespace("found-items");

        const s3Client = createS3Client(
          s3AccessKeyId.value().trim(),
          s3SecretAccessKey.value().trim()
        );
        const downloadUrl = await generateDownloadURL(imageName, s3Client);
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch image from S3");
        }

        const buffer = await response.arrayBuffer();
        console.log("Buffer byte length: ", buffer.byteLength);
        const imageBytes = Buffer.from(buffer);
        const resizedImageBytes = await resize(imageBytes);
        if (imageBytes.length == 0) {
          throw new Error("ImageBytes is Empty");
        }

        const bedrockClient = createBedrockClient(
          titanAccessKeyId.value().trim(),
          titanSecretAccessKey.value().trim()
        );
        let embedding;
        try {
          embedding = await getTitanEmbedding(resizedImageBytes, bedrockClient);
        } catch (error) {
          console.error("Error getting embedding:", error);
          return res.status(500).json({ error: "Error getting embedding" });
        }

        const textEmbedding = await getTitanTextEmbedding(
          sentence,
          bedrockClient
        );
        const combined = await getNorm(embedding, textEmbedding);

        const matches = await searchImages(lostItems, combined);
        console.log("matches from backend: ", matches);
        const id = imageName;

        await foundItems.upsert([
          {
            id,
            values: combined,
            metadata: {
              itemName,
              locationFound,
              description,
              returnedTo,
            },
          },
        ]);

        res.status(200).json({
          message: "Item saved successfully",
          matches: matches,
        });
      } catch (error) {
        console.error("Error saving item:", error);
        res.status(500).json({ error: "Error saving item" });
      }
    });
  }
);

// Set found item match
exports.setFoundItemMatch = onRequest(
  {
    secrets: [pineconeApiKey, pineconeIndex, pineconeControllerUrl],
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const { lostItemId, foundItemId } = req.body;

        // Initialize Pinecone with secrets
        const pinecone = new Pinecone({
          apiKey: pineconeApiKey.value().trim(),
        });

        const lostItems = pinecone
          .index(
            pineconeIndex.value().trim(),
            pineconeControllerUrl.value().trim()
          )
          .namespace("lost-items");

        const result = await lostItems.fetch([lostItemId]);
        console.log("result from fetch: ", result);
        const lostItem = result.vectors[lostItemId];
        const embedding = lostItem.values;
        const metadata = lostItem.metadata;
        metadata.foundItemMatch = foundItemId;
        await lostItems.upsert([
          {
            id: lostItemId,
            values: embedding,
            metadata: metadata,
          },
        ]);
        res.status(200).json({ message: "Match set successfully" });
      } catch (error) {
        console.log("error setting found item match", error);
        res.status(500).json({ error: "Error setting match" });
      }
    });
  }
);

// Register user
exports.register = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const userData = req.body;
      userData.lostItems = [];
      const username = userData.userId;
      try {
        await db.collection("users").doc(username).create(userData);
      } catch (error) {
        console.error("Error", error);
        res.status(500).json({ error: "User already exists" });
        return;
      }
      res.status(200).json({ message: "Registration successful" });
    } catch (error) {
      console.error("Error signing up: ", error);
      res.status(500).json({ error: "Error signing up" });
    }
  });
});

// Get user items
exports.getUserItems = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const username = req.query.userId;
      console.log("Getting user items for:", username);
      const reference = db.collection("users").doc(username);
      const doc = await reference.get();
      const userData = doc.data();
      const userItems = userData?.lostItems || [];
      console.log("User items:", userItems);
      res.status(200).json({ lostItems: userItems });
    } catch (error) {
      console.log("Error", error);
      res.status(500).json({ error: "Error getting lost items" });
    }
  });
});

// Helper function to add lost item to user
async function addLostItemToUser(username, item) {
  const reference = db.collection("users").doc(username);
  const doc = await reference.get();
  if (!doc.exists) {
    try {
      const userData = {
        userId: username,
        lostItems: [],
      };
      await reference.create(userData);
      doc = await reference.get();
    } catch (error) {
      console.error("Error", error);
    }
  }

  const userData = doc.data();
  const lostItems = userData.lostItems || [];
  lostItems.push(item);
  reference.update({ lostItems: lostItems });
}
