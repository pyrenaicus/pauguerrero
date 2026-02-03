import Image from "@11ty/eleventy-img";

export default async function (src, alt, fetchpriority="auto") {
  if (!src) return "";

  const imgPath = `src/${src}`;
  // Generate image & metadata based on options
  const html = await Image(imgPath, {
    widths: [300, 400, 600],
    formats: ["webp", "jpg"],
    outputDir: "./_site/img",
    returnType: "html",
    htmlOptions: {
      imgAttributes: {
        alt: alt || "",
        sizes: "(max-width: 300px) 300px, (max-width: 400px) 400px, 600px",
        loading: "lazy",
        decoding: "async",
        fetchpriority,
      },
    },
  });

  return html;
}
