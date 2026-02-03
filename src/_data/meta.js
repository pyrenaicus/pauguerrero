const meta = {
  url: process.env.URL || "http://localhost:8080",
  siteName: {
    en: "Pau Guerrero, photographer",
    es: "Pau Guerrero, fotógrafo",
    ca: "Pau Guerrero, fotògraf",
  },
  siteDescription: {
    en: "Barcelona-based photographer specializing in architecture and fine art photography. Portfolio of commissioned projects and exhibition work.",
    es: "Fotógrafo en Barcelona especializado en fotografía de arquitectura y fotografía fine art. Portfolio de trabajos por encargo y proyectos expositivos.",
    ca: "Fotògraf a Barcelona especialitzat en fotografia d'arquitectura i fotografia fine art. Portfolio de treballs per encàrrec i projectes d'exposició.",
  },
  title: {
    arch: {
      en: "Architecture Photography by Pau Guerrero",
      es: "Fotografía de arquitectura | Pau Guerrero",
      ca: "Fotografia d'arquitectura | Pau Guerrero",
    },
    retail: {
      en: "Luxury Retail Architecture Photography by Pau Guerrero",
      es: "Fotografía de Arquitectura del Retail | Pau Guerrero",
      ca: "Fotografia d'Arquitectura del Retail |",
    },
    exhibit: {
      en: "Fine Art Photography Exhibition by Pau Guerrero",
      es: "Exposicion de Fotografía | Pau Guerrero",
      ca: "Exposició de Fotografia | Pau Guerrero",
    },
  },
  siteType: "WebSite", // schema
  author: "Pau Guerrero",
  authorEmail: "info@pauguerrero.com",
  authorWebsite: "https://www.pauguerrero.com",
  copyrightNotice: `© ${new Date().getFullYear()} Pau Guerrero. Please contact for licensing and usage rights.`,
  mastodonProfile: "https://mastodon.social/@pyrenaicus",
  etsab: {
    en: "ETSAB - Barcelona School of Architecture",
    es: "ETSAB - Escuela Técnica Superior de Arquitectura de Barcelona",
    ca: "ETSAB - Escola Tècnica Superior d'Arquitectura de Barcelona",
  },
  photographer: {
    en: "Photographer",
    es: "Fotógrafo",
    ca: "Fotògraf",
  },
};

export default meta;
