import Image from "@11ty/eleventy-img";

export default async function (gallery) {
  if (!gallery || !gallery.length) return "";

  const imagePromises = gallery.map(async (img) => {
    const imgPath = `src/${img.src}`;
    // Generate image & metadata based on options
    const metadata = await Image(imgPath, {
      widths: [300, 600, 980],
      formats: ["webp", "jpg"],
      outputDir: "./_site/img",
    });
    // Generate HTML based on image attributes
    const imageHtml = Image.generateHTML(metadata, {
      alt: img.alt || "",
      sizes: "(max-width: 768px) 100vw, 50vw",
      loading: "lazy",
      decoding: "async",
    });
    // Create caption if present
    const caption = img.caption
      ? `<figcaption>${img.caption}</figcaption>`
      : "";

    return `<figure class="photo">${imageHtml}${caption}</figure>`;
  });

  const htmlArray = await Promise.all(imagePromises);

  return `<div class="gallery">${htmlArray.join("\n")}</div>`;
}
