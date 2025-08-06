const sharp = require("sharp");

async function resize(imageBuffer, maxWidth = 1024, maxHeight = 1024) {
  return await sharp(imageBuffer)
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toFormat("jpeg", { quality: 70 })
    .toBuffer();
}

module.exports = {
  resize,
};
