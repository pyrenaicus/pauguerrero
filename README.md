## Overview

This is an Eleventy static site for a photography portfolio website featuring architecture and landscape photography. The site supports three languages (Catalan, Spanish, English) using Eleventy's i18n plugin.

## Development Commands

- `npm start` - Start development server with live reload (runs `eleventy --serve`)
- `npm run build` - Builds site onto `_site` directory
- `npm run deploy` - Deploys site via ftp (runs `/scripts/deploy.js`)
- The site uses ES modules (`"type": "module"` in package.json)

## Architecture & Structure

### Content Organization

Content is organized by language in `src/{lang}/`:
- `src/ca/` - Catalan content
- `src/es/` - Spanish content
- `src/en/` - English content

Each language directory contains:
- Collections: `architecture-photography/`, `exhibitions/` - markdown files with image galleries
- Standalone pages: `contact.md`, `copyright.md`, `cv.md`, etc.
- `{lang}.11tydata.js` - Sets `lang` property for all files in that directory

### i18n System

The site uses Eleventy's `I18nPlugin` configured in `eleventy.config.js:17-28`:
- Default language: English
- Custom filter names: `locale_url`, `locale_links`
- Error mode: `allow-fallback`

Translations are managed via `src/_data/languages.js` which provides internationalization (i18n) strings for the three supported languages on the site: Catalan, Spanish, and English.

It provides text used throughout the templates for:

- Locale identifiers (`locale`): Format strings like "ca-ES", "es-ES", "en-GB" used in HTML lang attributes
- Skip links (`skipText`): Accessibility feature allowing keyboard users to skip to main content
- ARIA labels (`ariaPrimary`, `ariaLang`): Screen reader labels for navigation landmarks and language switcher

Accessed in templates as `languages.{lang}.{key}`


#### Usage in Templates

Since this is in the `_data/` directory, Eleventy makes it globally available in templates as `languages`. Templates can access these strings like:

{{ languages.ca.skipText }} <!-- "Saltar al contingut principal" -->

### meta.js

Site-wide metadata (name, descriptions, SEO) and configuration is in `src/_data/meta.js` with multilingual support.

- HTML meta tags
- SEO optimization
- Social media cards (Open Graph)
- Schema.org structured data

#### Key Data Included

1. Site Identity

   - `siteName`, `siteDescription`: Basic site info
   - `url`: Site URL (from environment variable or localhost default)
   - `author`, `authorEmail`, `authorWebsite`: Creator information

2. SEO & Social Media

   - `meta_data.opengraph_default`: Fallback image for social media previews
   - `meta_data.mastodonProfile`: Mastodon verification link
   - `siteType`: "Person" - used for Schema.org structured data

3. Legal & Fallbacks
   - `copyrightNotice`: Dynamic copyright text (updates yearly)

#### Usage

Globally available in templates as `meta`:

```html
<title>{{ title }} | {{ meta.siteName }}</title>
<meta name="description" content="{{ meta.siteDescription }}" />
```

### Image Handling

Images for each page are defined in frontmatter, under `images` as an array, with each image attributes `src`, `alt`, and `caption` (optional). `page.njk` layout puts images right after page's content.

For special cases where we may need to display images in between the main content, we ca use `galleryShortcode`, and set the images in frontmatter under `someGallery`, passing it to the shortcode, as in: `{% galleryShortcode someGallery %}`

Images are handled through three shortcodes:

1. **imageShortcode** (`src/_config/shortcodes/image.js`) - Single responsive image
   - Uses `@11ty/eleventy-img` plugin
   - Generates widths: 300, 400, 600px
   - Formats: webp, jpg
   - Output: `_site/img/`
   - Lazy loading enabled

2. **imagesShortcode** (`src/_config/shortcodes/images.js`) - Array of images defined in frontmatter under `images`
   - Used in `page.njk` layout to display images after content

3. **galleryShortcode** (`src/_config/shortcodes/gallery.js`) - Inline gallery from custom frontmatter array
   - Usage: `{% galleryShortcode customGalleryName %}`
   - For displaying images within content rather than after

### Frontmatter Structure for Pages

Pages with images use this frontmatter structure:

```yaml
images:
  - src: "images/filename.jpg"
    id: "img01"  # Unique identifier
    alt: "Descriptive alt text"
    caption: "Display caption"
    contentLocation: "Location name"  # Schema.org structured data
    name: "Image name"  # Schema.org structured data
    description: "Image description"  # Schema.org structured data
```

### Layouts

Located in `src/_layouts/`:
- `base.njk` - Base template with HTML structure
- `page.njk` - For content pages with image galleries
- `list.njk` - For collection listing pages
- `contact.njk` - Contact form page

Includes in `src/_includes/`:
- `header.njk` - Site navigation
- `footer.njk` - Site footer
- `schemas/` - Schema.org structured data templates

### Collections

Collections are defined in `eleventy.config.js:48-53` in reverse chronological order:
- `architecture-photography` - Architecture photography projects
- `exhibitions` - Photography exhibitions pages

Both are filtered by tag and reversed for newest-first ordering.

#### list pages in reverse chronological order

We define a collection by setting a tag in frontmatter.

```js
eleventyConfig.addCollection("architecture-photography", (col) =>
  col.getFilteredByTag("architecture-photography").reverse()
);
```

#### list collections filtered by language

```njk
{% for item in collections[collectionName] %} {% if item.data.lang == page.lang %}
<li>
{% imageShortcode item.data.teaser, item.data.teaserAlt %}
   <h2>
     <a href="{{ item.url }}">{{ item.data.title | lower }}</a>
   </h2>
{% endif %}
{% endfor %}
</li>
```

### Custom Filters

Defined in `src/_config/filters.js`:
- `absURL` - return absolute url of a given page
- `pickRandom` - pick a random element from a collection
- `shuffle` - shuffle a collection
- `htmlDateString` - Format date for HTML datetime attributes
- `readableDate` - Format date using Luxon (defined in eleventy.config.js)
- `hasItems` - Check if specific item exists in a collection

### Configuration

`eleventy.config.js` configures:
- Input: `src/`
- Output: `_site/`
- Layouts: `src/_layouts/`
- Markdown template engine: Nunjucks
- Passthrough copies: CSS files (`reset.css`, `fonts.css`, `style.css`) and `assets/` directory

### Utility Scripts

`scripts/` contains helper scripts:
- `organize_md.zsh` - Shell script for organizing markdown files
- `deploy.js`- Script to deploy build via ftp (uses `@samkirkland/ftp-deploy`)

## Working with Content

When creating new pages with images:
1. Add images to `src/images/` directory
2. Define images in frontmatter following the structure above
3. Images are automatically processed by eleventy-img and displayed via the page layout
4. For inline galleries, use `galleryShortcode` with a custom frontmatter array

When filtering collections by language in templates:
```njk
{% for item in collections[collectionName] %}
  {% if item.data.lang == page.lang %}
    {# Display item #}
  {% endif %}
{% endfor %}
```