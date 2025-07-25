//necessary setup
const express = require("express");
const cors = require("cors");
const db = require("./firebase");
const { generateURL } = require("./s3");
require("dotenv").config();

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

app.get("/generate-url", async (req, res) => {
  try {
    const url = await generateURL();
    res.send({ url });
  } catch (error) {
    console.error("Error generating URL:", error);
    res.status(500).send("Error generating URL");
  }
});

//sample route to test the connection to firestore
app.get("/firebaseTest", async (req, res) => {
  try {
    const documentReference = db.collection("test").doc("testingDoc");
    documentReference.set({ message: "Database connection successful" });
    const document = await documentReference.get();
    res.json(document.data());
  } catch (error) {
    console.error("Firebase error: ", error);
    res.status(500).send("Error connecting to database");
  }
});

//starting the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
