import sharp from "sharp";

export async function resize(imageBuffer, maxWidth = 1680, maxHeight = 1680){
    return await sharp(imageBuffer)
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toFormat('jpeg') 
    .toBuffer();
} 