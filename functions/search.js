async function searchImages(pc_index, embedding) {
  const response = await pc_index.query({
    topK: 3,
    vector: embedding,
    includeMetadata: true,
  });
  console.log("response from search image: ", response);
  return response.matches;
}

module.exports = {
  searchImages,
}; 