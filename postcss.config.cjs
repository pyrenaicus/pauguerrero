const purgecss = require('@fullhuman/postcss-purgecss')({
  // Point this to your Eleventy output directory
  content: ['./_site/**/*.html'],
  // Safelist default Bulma dynamic modifiers if you use JS toggles
  safelist: {
    standard: ["is-active", "is-clipped"], 
  },
  variables: true, // ⚡ Tell PurgeCSS to prune unused CSS custom properties
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

const postcssLightningcss = require('postcss-lightningcss');

module.exports = {
  plugins: [
    ...(process.env.NODE_ENV === 'production'
       ? [
        purgecss,
         postcssLightningcss({ minify: true })
        ] : [])
  ]
};