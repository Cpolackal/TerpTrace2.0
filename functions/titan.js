const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const region = "us-east-1";
const modelId = "amazon.titan-embed-image-v1";
const textModelId = "amazon.titan-embed-text-v2:0";

function createBedrockClient(accessKeyId, secretAccessKey) {
  accessKeyId = accessKeyId.trim();
  secretAccessKey = secretAccessKey.trim();
  return new BedrockRuntimeClient({
    region: region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

async function getTitanEmbedding(imageBytes, bedrockClient) {
  try {
    // Convert image bytes to base64

    const base64Image = imageBytes.toString("base64");

    //console.log(base64Image);
    // Create the JSON payload
    const payload = {
      inputImage: base64Image,
      embeddingConfig: {
        outputEmbeddingLength: 1024,
      },
    };

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await bedrockClient.send(command);

    // The response body is a Uint8Array (Buffer), parse as JSON

    const responseBody = Buffer.from(response.body).toString();
    if (!responseBody) {
      throw new Error("Response body is empty");
    }

    const parsed = JSON.parse(responseBody);
    return parsed.embedding;
  } catch (error) {
    throw new Error(
      `Failed to invoke Bedrock model: ${error?.message || error}`
    );
  }
}

async function getTitanTextEmbedding(inputText, bedrockClient) {
  console.log("reached titan call");
  const payload = {
    inputText: inputText,
  };

  const command = new InvokeModelCommand({
    modelId: textModelId,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
  console.log("Right before call to Bedrock text model");
  try {
    const textResponse = await bedrockClient.send(command);
    console.log("Here is response body: ");

    const responseBody = Buffer.from(textResponse.body).toString("utf-8");
    if (!responseBody) {
      throw new Error("Response body is empty");
    }
    const parsed = JSON.parse(responseBody);
    return parsed.embedding;
  } catch (error) {
    throw new Error(
      `Failed to invoke Bedrock text model: ${error?.message || error}`
    );
  }
}

async function getNorm(vector1, vector2, weight1 = 0.6, weight2 = 0.4) {
  if (vector1.length !== vector2.length) {
    throw new Error("Vectors must be of the same length");
  }

  const weightedVector = vector1.map(
    (val, i) => val * weight1 + vector2[i] * weight2
  );
  // Normalize the weighted vector

  const magnitude = Math.sqrt(
    weightedVector.reduce((sum, val) => sum + val * val, 0)
  );
  if (magnitude === 0) {
    return weightedVector.map(() => 0);
  }
  const norm = weightedVector.map((value) => value / magnitude);
  return norm;
}

module.exports = {
  createBedrockClient,
  getTitanEmbedding,
  getTitanTextEmbedding,
  getNorm,
};
