//necessary setup
import express from "express";
import cors from "cors";
import { generateUploadURL, generateDownloadURL } from "./s3.js";
import { getTitanEmbedding, getTitanTextEmbedding, getNorm } from "./titan.js";
import { searchImages } from "./search.js";
import { Pinecone } from "@pinecone-database/pinecone";
import { resize } from "./Resize.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { db } from "./db/firebaseAdmin.js";


dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const lostItems = pinecone
  .index(process.env.PINECONE_INDEX, process.env.PINECONE_CONTROLLER_URL)
  .namespace("lost-items");

const foundItems = pinecone
  .index(process.env.PINECONE_INDEX, process.env.PINECONE_CONTROLLER_URL)
  .namespace("found-items");

//initializing the app
const app = express();
const PORT = 5001;
app.use(cors());
app.use(express.json());

//sample route to test the server
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Gets the signed URL from s3.js and sends to frontend
app.get("/generate-url", async (req, res) => {
  try {
    const folder = req.query.folder;
    const { url, key: imageName } = await generateUploadURL(folder);
    res.send({ url, imageName });
  } catch (error) {
    console.error("Error generating URL:", error);
    res.status(500).send("Error generating URL");
  }
});

app.post("/saveLostSomething", async (req, res) => {
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
      "itemName" : itemName,
      "locationLost" : locationLost,
      "description" : description,
      "imageName" : imageName
    }
    
    addLostItemToUser(userId, itemMap);

    if (!imageName) {
      return res.status(400).send("Image key is required");
    }

    const sentence = `${itemName} ${description}`;
    const downloadUrl = await generateDownloadURL(imageName);
    console.log("received url");
    //console.log(downloadUrl)
    const response = await fetch(downloadUrl);
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

    let embedding;
    try {
      embedding = await getTitanEmbedding(resizedImageBytes);
    } catch (error) {
      console.error("Error getting embedding:", error);
      return res.status(500).send("Error getting embedding");
    }

    let textEmbedding;
    try {
      textEmbedding = await getTitanTextEmbedding(sentence);
    } catch (error) {
      return res.status(500).send(`Error generating text embedding ${error}`);
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
          foundItemMatch, // changed from phone and email
        },
      },
    ]);
    res.status(200).json({
      message: "Item saved successfully",
      matches: matches,
    });
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).send("Error saving item");
  }
});

app.post("/saveFoundSomething", async (req, res) => {
  console.log("post request successful");
  try {
    const { itemName, locationFound, description, returnedTo, imageName } =
      req.body;
    const sentence = `${itemName} ${description}`;
    if (!imageName) {
      return res.status(400).send("Image key is required");
    }
    const downloadUrl = await generateDownloadURL(imageName);
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

    let embedding;
    try {
      embedding = await getTitanEmbedding(resizedImageBytes);
    } catch (error) {
      console.error("Error getting embedding:", error);
      return res.status(500).send("Error getting embedding");
    }

    const textEmbedding = await getTitanTextEmbedding(sentence);
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
    res.status(500).send("Error saving item");
  }
});

//starting the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.post("/register", async (req, res) => {
   try {
      const userData = req.body;
      userData.lostItems = [];
      const username = userData.userId;
      try {
        await db.collection('users').doc(username).create(userData);
      } catch (error) {
        console.error("Error", error);
        res.status(500).send("User already exists");
      }
      res.status(200).send("Registration successful");
   } catch (error) {
    console.error("Error signing up: ", error);
    res.status(500).send("Error signing up");
   }
})

app.get("/getUserItems", async (req, res) => {
  try {
    const username = req.query.userId;
    const reference = db.collection('users').doc(username);
    const doc = await reference.get()
    const userData = doc.data();
    const userItems = userData.lostItems || [];
    res.status(200).json({ lostItems : userItems })
  } catch (error) {
    console.log("Error", error);
    res.status(500).send("Error getting lost items")
  }
})

async function addLostItemToUser(username, item) {
    const reference = db.collection('users').doc(username);
    const doc = await reference.get()

    if (!doc.exists) {
      throw new Error("User not found");
    }

    const userData = doc.data();
    const lostItems = userData.lostItems || [];
    lostItems.push(item);
    reference.update({lostItems: lostItems });
}