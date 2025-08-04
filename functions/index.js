const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const cors = require("cors");
const { db } = require("./firebaseAdmin.js");

// Set global options for all functions
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

// CORS middleware
const corsHandler = cors({ origin: true });

// Test endpoint
exports.test = onRequest((req, res) => {
  corsHandler(req, res, () => {
    res.json({
      message: "Firebase Functions server is running",
      env: {
        hasPinecone: !!process.env.PINECONE_API_KEY,
        hasS3: !!process.env.S3_ACCESS_KEY_ID,
        hasTitan: !!process.env.TITAN_ACCESS_KEY_ID,
      },
    });
  });
});

// Generate S3 upload URL (placeholder for now)
exports.generateUrl = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const folder = req.query.folder;
      const { url, key: imageName } = await generateUploadURL(folder);
      console.log(url);
      res.send({ url, imageName });
    } catch (error) {
      console.error("Error generating URL:", error);
      res.status(500).json({ error: "Error generating URL" });
    }
  });
});

// Save lost item (placeholder for now)
exports.saveLostSomething = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { userId, itemName, locationLost, description, imageName } =
        req.body;

      // Save to Firestore for now
      const itemMap = {
        itemName: itemName,
        locationLost: locationLost,
        description: description,
        imageName: imageName,
        timestamp: new Date(),
      };

      // Add to user's lost items
      const reference = db.collection("users").doc(userId);
      const doc = await reference.get();
      if (!doc.exists) {
        await reference.create({ userId, lostItems: [] });
      }

      const userData = doc.data() || { lostItems: [] };
      const lostItems = userData.lostItems || [];
      lostItems.push(itemMap);
      await reference.update({ lostItems: lostItems });

      res.status(200).json({
        message: "Item saved successfully (basic version)",
        matches: [],
        lostItemId: imageName,
      });
    } catch (error) {
      console.error("Error saving item:", error);
      res.status(500).json({ error: "Error saving item" });
    }
  });
});

// Save found item (placeholder for now)
exports.saveFoundSomething = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { itemName, locationFound, description, returnedTo, imageName } =
        req.body;

      res.status(200).json({
        message: "Found item saved successfully (basic version)",
        matches: [],
      });
    } catch (error) {
      console.error("Error saving found item:", error);
      res.status(500).json({ error: "Error saving found item" });
    }
  });
});

// Set found item match (placeholder for now)
exports.setFoundItemMatch = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { lostItemId, foundItemId } = req.body;
      res
        .status(200)
        .json({ message: "Match set successfully (basic version)" });
    } catch (error) {
      console.log("error setting found item match", error);
      res.status(500).json({ error: "Error setting match" });
    }
  });
});

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
