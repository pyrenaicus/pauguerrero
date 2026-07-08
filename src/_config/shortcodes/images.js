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

      const largestWebp = imageData.webp[imageData.webp.length - 1];
      const largestJpeg = imageData.jpeg[imageData.jpeg.length - 1];

      const htmlOptions = {
        imgAttributes: {
          alt: img.alt || "",
          sizes: "(min-width: 1024px) 30vw, 90vw",
          fetchpriority: img.fetchpriority || "auto",
        },
      };

      const orientation = imageData.layout?.orientation
      // const aspectRatio = imageData.layout?.aspectRatio

      const html = `<source type="image/webp" srcset="${webpSrcsets}" sizes="${htmlOptions.imgAttributes.sizes}"><img class="gallery-img" alt="${htmlOptions.imgAttributes.alt}" loading="lazy" decoding="async" src="${largestJpeg.url}" width="${largestJpeg.width}" height="${largestJpeg.height}" srcset="${jpegSrcsets}" sizes="${htmlOptions.imgAttributes.sizes}" fetchpriority="${htmlOptions.imgAttributes.fetchpriority}" data-lightbox-src="${largestWebp.url}" data-lightbox-alt="${htmlOptions.imgAttributes.alt}">`;

      const caption = img.caption
        ? `<figcaptionclass="is-size-7 mt-2 has-text-grey">${img.caption}</figcaption>`
        : "";

      return `<div class="gallery-item mb-4 ${orientation}"><figure>${html}${caption}</figure></div>`;
    } catch (error) {
      console.error(`\n❌ FAILED on image ${index + 1}:`);
      console.error(`   img object:`, JSON.stringify(img, null, 2));
      console.error(`   Error: ${error.message}`);
      throw error; // Re-throw to stop build
    }
  });

  const htmlArray = await Promise.all(imagePromises);

  // Initialize arrays for our three columns
  const col1 = [];
  const col2 = [];
  const col3 = [];

  // Distribute the processed HTML items into columns evenly
  htmlArray.forEach((itemHtml, index) => {
    if (index % 3 === 0) col1.push(itemHtml);
    else if (index % 3 === 1) col2.push(itemHtml);
    else col3.push(itemHtml);
  });

  // return htmlArray.join("");
  // Return Bulma columns structural wrapper
  return `
    <div class="columns is-desktop is-variable is-4 my-4 gallery-stage">
      <div class="column is-4-desktop is-6-tablet">
        ${col1.join("\n")}
      </div>
      <div class="column is-4-desktop is-6-tablet">
        ${col2.join("\n")}
      </div>
      <div class="column is-4-desktop is-12-tablet">
        ${col3.join("\n")}
      </div>
    </div>
  `;
}
