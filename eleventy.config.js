/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */

import fg from "fast-glob";
import { DateTime } from "luxon";
import CleanCSS from "clean-css";
import { minify } from "html-minifier-terser";
import { I18nPlugin } from "@11ty/eleventy";
import Image from "@11ty/eleventy-img";
// import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import imagesShortcode from "./src/_config/shortcodes/images.js";
import galleryShortcode from "./src/_config/shortcodes/gallery.js";
import imageShortcode from "./src/_config/shortcodes/image.js";
import filters from "./src/_config/filters.js";

const isProduction = process.env.NODE_ENV === "production";

// CSS minify transform fn
function minifyCSS(source, outputPath) {
  if (!outputPath.endsWith(".css") || !isProduction) return source;

  const result = new CleanCSS({
    level: 2,
  })
    .minify(source)
    .styles.trim();
  console.log(
    `MINIFY ${outputPath}`,
    source.length,
    `→`,
    result.length,
    `(${((1 - result.length / source.length) * 100).toFixed(2)}% reduction)`
  );
  return result;
}
// HTML minify transform fn
async function minifyHTML(source, outputPath) {
  if (!outputPath.endsWith(".html") || !isProduction) return source;

  const result = await minify(source, {
    collapseBooleanAttributes: true,
    collapseWhitespace: false,
    collapseInlineTagWhitespace: false,
    continueOnParseError: true,
    decodeEntities: true,
    keepClosingSlash: true,
    minifyCSS: true,
    quoteCharacter: `"`,
    removeComments: true,
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    processScripts: ["application/ld+json"],
  });

  console.log(
    `MINIFY ${outputPath}`,
    source.length,
    `→`,
    result.length,
    `(${((1 - result.length / source.length) * 100).toFixed(2)}% reduction)`
  );

  return result;
}

export default async function (eleventyConfig) {
  // eleventyConfig.addPassthroughCopy("./src/style.css");
  eleventyConfig.addPassthroughCopy("./src/assets");

  eleventyConfig.addPlugin(I18nPlugin, {
    defaultLanguage: "en",
    // Rename the default universal filter names
    filters: {
      // transform a URL with the current page’s locale code
      url: "locale_url",

      // find the other localized content for a specific input file
      links: "locale_links",
    },
    errorMode: "allow-fallback",
  });

  // eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  eleventyConfig.addGlobalData("myDate", () => new Date());

  // collections in reverse chronological order
  eleventyConfig.addCollection("architecture-photography", (col) =>
    col.getFilteredByTag("architecture-photography").reverse()
  );
  eleventyConfig.addCollection("exhibitions", (col) =>
    col.getFilteredByTag("exhibitions").reverse()
  );
  // Add collection of all images and optimized derivatives
  // see: https://discord.com/channels/741017160297611315/1024977349864849458
  eleventyConfig.addCollection("images", async () => {
    console.log("Processing images...");

    const imgDir = "src/images";
    const imgOptions = {
      widths: [300, 600, 980, "auto"],
      formats: ["webp", "jpg"],
      outputDir: "./_site/img",
    };

    const rawImages = fg.sync(`${imgDir}/**/*.{jpg,png,gif,tiff,webp}`);
    const mapping = {};

    for (const path of rawImages) {
      mapping[path] = await Image(path, imgOptions);
    }
    return Object.freeze(mapping);
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addFilter("values", Object.values);
  eleventyConfig.addFilter("absURL", filters.absURL);
  eleventyConfig.addFilter("pickRandom", filters.pickRandom);
  eleventyConfig.addFilter("shuffle", filters.shuffle);
  eleventyConfig.addFilter("htmlDateString", filters.htmlDateString);
  eleventyConfig.addFilter("hasItems", filters.hasItems);

  eleventyConfig.addShortcode("imagesShortcode", imagesShortcode);
  eleventyConfig.addShortcode("galleryShortcode", galleryShortcode);
  eleventyConfig.addShortcode("imageShortcode", imageShortcode);

  eleventyConfig.addTransform("cssmin", minifyCSS);
  eleventyConfig.addTransform("htmlmin", minifyHTML);

  // general config
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts",
    },
  };
}
