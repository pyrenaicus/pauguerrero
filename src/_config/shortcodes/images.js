export default async function (images, collection) {
  if (!images || !images.length) return "";

  const imagePromises = images.map(async (img, index) => {
    try {
      const imgPath = `src/${img.src}`;

      const imageData = collection[imgPath];

      if (!imageData) {
        throw new Error(`Image not found in collection: ${imgPath}`);
      }

      // Defensive checks
      if (!imageData.webp || imageData.webp.length === 0) {
        throw new Error(`No webp images for ${imgPath}`);
      }
      if (!imageData.jpeg || imageData.jpeg.length === 0) {
        throw new Error(`No jpeg images for ${imgPath}`);
      }

      // Build srcsets safely
      const webpSrcsets = imageData.webp
        .map((img) => img.srcset)
        .filter(Boolean)
        .join(", ");
      const jpegSrcsets = imageData.jpeg
        .map((img) => img.srcset)
        .filter(Boolean)
        .join(", ");

      const largestJpeg = imageData.jpeg[imageData.jpeg.length - 1];

      const htmlOptions = {
        imgAttributes: {
          alt: img.alt || "",
          sizes: "90vw",
          fetchpriority: img.fetchpriority || "auto",
        },
      };

      const html = `<source type="image/webp" srcset="${webpSrcsets}" sizes="${htmlOptions.imgAttributes.sizes}"><img alt="${htmlOptions.imgAttributes.alt}" loading="lazy" decoding="async" src="${largestJpeg.url}" width="${largestJpeg.width}" height="${largestJpeg.height}" srcset="${jpegSrcsets}" sizes="${htmlOptions.imgAttributes.sizes}" fetchpriority="${htmlOptions.imgAttributes.fetchpriority}">`;

      const caption = img.caption
        ? `<figcaption>${img.caption}</figcaption>`
        : "";

      return `<figure>${html}${caption}</figure>`;
    } catch (error) {
      console.error(`\n❌ FAILED on image ${index + 1}:`);
      console.error(`   img object:`, JSON.stringify(img, null, 2));
      console.error(`   Error: ${error.message}`);
      throw error; // Re-throw to stop build
    }
  });

  const htmlArray = await Promise.all(imagePromises);

  return htmlArray.join("");
}
