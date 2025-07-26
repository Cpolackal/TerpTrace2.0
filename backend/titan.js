import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";
dotenv.config();

const region = "us-east-1";
const modelId = "amazon.titan-embed-image-v1";
const bedrockClient = new BedrockRuntimeClient({
  region: region,
  credentials: {
    accessKeyId: process.env.TITAN_ACCESS_KEY_ID,
    secretAccessKey: process.env.TITAN_SECRET_ACCESS_KEY,
  },
});

export async function getTitanEmbedding(imageBytes) {
  try {
    // Convert image bytes to base64

    let base64Image = "TEST";
    try {
      base64Image = imageBytes.toString("base64");
    } catch (error) {
      throw new Error("Failed to convert image bytes to base64");
    }
    console.log(base64Image);
    // Create the JSON payload
    const payload = {
          inputImage: base64Image,
          embeddingConfig: {
            outputEmbeddingLength: 256,
          },
    };

    let command;
    try {
      command = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      throw new Error(`Failed to create InvokeModelCommand: ${error.message}`);
    }

    let response;
    try {
      response = await bedrockClient.send(command);
    } catch (error) {
      throw new Error(`Failed to send command to Bedrock: ${error.message}`);
    }

    // The response body is a Uint8Array (Buffer), parse as JSON
    let responseBody;
    try {
      responseBody = Buffer.from(response.body).toString();
    } catch (error) {
      throw new Error("Failed to convert response body to string");
    }
    if (!responseBody) {
      throw new Error("Response body is empty");
    }

    let parsed;
    try {
      parsed = JSON.parse(responseBody);
    } catch (error) {
      throw new Error("Failed to parse response body as JSON");
    }

    return parsed.embedding;
  } catch (error) {
    throw new Error(
      `Failed to invoke Bedrock model: ${error?.message || error}`
    );
  }
}
