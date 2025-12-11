import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
  schema?: Record<string, any>;
}

export function SEO({ 
  title, 
  description, 
  image = '/logo-placeholder.png', // Add a default logo path later
  url,
  type = 'website',
  keywords = [],
  schema 
}: SEOProps) {
  const siteTitle = 'Maestra de Música - Laura Karol';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  const currentUrl = url || window.location.href;

  // Default Schema.org data for the organization/person
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Maestra de Música - Laura Karol",
    "image": image,
    "description": description,
    "url": currentUrl,
    "telephone": "+58-000-0000000",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Punto Fijo",
      "addressRegion": "Falcón",
      "addressCountry": "VE"
    },
    "priceRange": "$$"
  };

  // Merge provided schema with default if needed, or just use provided schema as an additional block
  const jsonLd = schema ? [defaultSchema, schema] : [defaultSchema];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) for AI & SEO */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}
