export default async function (collection, layoutBlocks) {
  if (!layoutBlocks || !layoutBlocks.length) return "";

  // 1. Process all blocks and gather just the `.cell` HTML
  const blockPromises = layoutBlocks.map(async (block, blockIndex) => {
    const layout = block.layout;
    const items = block.items || [];

    const imagePromises = items.map(async (img, imgIndex) => {
      try {
        const imgPath = `src/${img.src}`;
        const imageData = collection[imgPath];

        if (!imageData) {
          throw new Error(`Image not found in collection: ${imgPath}`);
        }

        if (!imageData.webp || imageData.webp.length === 0) {
          throw new Error(`No webp images for ${imgPath}`);
        }
        if (!imageData.jpeg || imageData.jpeg.length === 0) {
          throw new Error(`No jpeg images for ${imgPath}`);
        }

        const webpSrcsets = imageData.webp
          .map((i) => i.srcset)
          .filter(Boolean)
          .join(", ");
        const jpegSrcsets = imageData.jpeg
          .map((i) => i.srcset)
          .filter(Boolean)
          .join(", ");

        const largestWebp = imageData.webp[imageData.webp.length - 1];
        const largestJpeg = imageData.jpeg[imageData.jpeg.length - 1];

        const htmlOptions = {
          imgAttributes: {
            alt: img.alt || "",
            sizes: "(min-width: 1300px) 1250px, (min-width: 1024px) 90vw, 90vw",
            fetchpriority: img.fetchpriority || "auto",
          },
        };

        const orientation = img.orientation || imageData.layout?.orientation || "";

        const html = `<source type="image/webp" srcset="${webpSrcsets}" sizes="${htmlOptions.imgAttributes.sizes}"><img class="gallery-img" alt="${htmlOptions.imgAttributes.alt}" loading="lazy" decoding="async" src="${largestJpeg.url}" width="${largestJpeg.width}" height="${largestJpeg.height}" srcset="${jpegSrcsets}" sizes="${htmlOptions.imgAttributes.sizes}" fetchpriority="${htmlOptions.imgAttributes.fetchpriority}" data-lightbox-src="${largestWebp.url}" data-lightbox-alt="${htmlOptions.imgAttributes.alt}">`;

        const caption = img.caption
          ? `<figcaption class="is-size-7 mt-2 has-text-grey">${img.caption}</figcaption>`
          : "";

        // Default to spanning all 6 columns on tablet/desktop. 
        // On mobile, it will naturally span the 1 available column.
        let cellSpanClass = "is-col-span-6-tablet";

        if (layout === "vvv"|| layout === "vv" || layout === "v") {
          cellSpanClass = "is-col-span-2-tablet";
        } else if (layout === "hh") {
          cellSpanClass = "is-col-span-3-tablet";
        } else if (layout === "hv") {
          cellSpanClass = imgIndex === 0 ? "is-col-span-4-tablet" : "is-col-span-2-tablet";
        } else if (layout === "vh") {
          cellSpanClass = imgIndex === 0 ? "is-col-span-2-tablet" : "is-col-span-4-tablet";
        }

        // Added layout-${layout} directly to the cell class list
        return `
          <div class="cell ${cellSpanClass} gallery-item ${orientation} layout-${layout}">
            <figure class="image">
              <picture class="image">${html}${caption}</picture>
            </figure>
          </div>
        `.trim();

      } catch (error) {
        console.error(`\n❌ FAILED on Block ${blockIndex + 1}, Image ${imgIndex + 1}:`);
        console.error(`   img object:`, JSON.stringify(img, null, 2));
        console.error(`   Error: ${error.message}`);
        throw error;
      }
    });

    const renderedCellsHtml = await Promise.all(imagePromises);

// 1b. Add empty filler cells on tablet/desktop for "v" and "vv" layouts to leave the rest empty
    if (layout === "v" && renderedCellsHtml.length === 1) {
      renderedCellsHtml.push(
        `<div class="cell is-col-span-2-tablet is-hidden-mobile"></div>`,
        `<div class="cell is-col-span-2-tablet is-hidden-mobile"></div>`
      );
    } else if (layout === "vv" && renderedCellsHtml.length === 2) {
      renderedCellsHtml.push(
        `<div class="cell is-col-span-2-tablet is-hidden-mobile"></div>`
      );
    }

    // Return only the inner HTML cells, no wrappers here!
    return renderedCellsHtml.join("\n");
  });

  // 2. Wait for all blocks to process and join their HTML together
  const allBlocksHtml = await Promise.all(blockPromises);
  const innerGridContent = allBlocksHtml.join("\n");

  // 3. Wrap everything in ONE single grid
  return `
    <div class="gallery-stage my-6 fixed-grid has-1-cols-mobile has-6-cols-tablet">
      <div class="grid">
        ${innerGridContent}
      </div>
    </div>
  `.trim();
}