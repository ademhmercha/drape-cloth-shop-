import { Helmet } from 'react-helmet-async';

export default function SEOHead({
  title,
  description = 'DRAPE — Mode de luxe éditorial. Collections exclusives pour femmes, hommes et enfants en Tunisie.',
  image = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
  url
}) {
  const fullTitle = title ? `${title} — DRAPE` : 'DRAPE — Luxury Fashion Tunisia';
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="DRAPE" />
      <meta property="og:locale" content="fr_TN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
