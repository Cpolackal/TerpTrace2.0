//necessary setup
import express from "express";
import cors from "cors";
import { generateUploadURL, generateDownloadURL } from "./s3.js";
import { getTitanEmbedding } from "./titan.js";
import { Pinecone } from "@pinecone-database/pinecone";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index(
  process.env.PINECONE_INDEX,
  process.env.PINECONE_CONTROLLER_URL
);

//initializing the app
const app = express();
const PORT = 5001;
app.use(cors());
app.use(express.json());

//sample route to test the server
app.get("/", (req, res) => {
  console.log("GET / route hit");
  res.send("Server is running");
});

// Gets the signed URL from s3.js and sends to frontend
app.get("/generate-url", async (req, res) => {
  try {
    const { url, imageName } = await generateUploadURL();
    res.send({ url, imageName });
  } catch (error) {
    console.error("Error generating URL:", error);
    res.status(500).send("Error generating URL");
  }
});

app.post("/saveFoundSomething", async (req, res) => {
  try {
    const { itemName, locationFound, description, returnedTo, imageName } =
      req.body;
    if (!imageName) {
      return res.status(400).send("Image key is required");
    }

    const downloadUrl = await generateDownloadURL(imageName);
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image from S3");
    }


    const imageBytes = Buffer.from(await response.arrayBuffer());
    if(imageBytes == null) {
      throw new Error("ImageBytes is Empty");
    }


    let embedding;
    try {
      embedding = await getTitanEmbedding(imageBytes);
    } catch (error) {
      console.error("Error getting embedding:", error);
      return res.status(500).send("Error getting embedding");
    }
    const id = imageName;

    await index.upsert([
      {
        id,
        values: embedding,
        metadata: {
          itemName,
          locationFound,
          description,
          returnedTo,
        },
      },
    ]);

    res.status(200).send("Item saved successfully");
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).send("Error saving item");
  }
});

//starting the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
