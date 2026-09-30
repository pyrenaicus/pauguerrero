import Image from "@11ty/eleventy-img";

export default async function (src, alt, caption, fetchpriority = "auto") {
    if (!src) return "";
    caption = caption ?? "";

    const imgPath = `src/${src}`;
    // Generate image & metadata based on options
    const pictureHtml = await Image(imgPath, {
        widths: [300, 400, 600],
        formats: ["webp", "jpg"],
        outputDir: "./_site/img",
        returnType: "html",
        htmlOptions: {
            imgAttributes: {
                alt: alt || "",
                sizes: "(max-width: 350px) 300px, (max-width: 400px) 400px, 90vw",
                loading: "lazy",
                decoding: "async",
                fetchpriority,
            },
        },
    });

    const figureHtml = `<p><figure style="break-inside: avoid;" class="image">${pictureHtml}<figcaption class="is-size-7 mt-1 has-text-grey">${caption}</figcaption></figure></p>`;

    return figureHtml;
}
