import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  breadcrumbs?: BreadcrumbItem[];
}

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords,
  author,
  publishedTime,
  modifiedTime,
  schema,
  breadcrumbs,
}: SEOProps) {
  const location = useLocation();
  const baseUrl = 'https://aistudentchapter.vercel.app';
  const canonicalUrl = url || `${baseUrl}${location.pathname === '/' ? '' : location.pathname}`;
  
  const defaultDesc = "Exploring AI — we learn, we build, we compete, and we grow together at AI Student Chapters, RCPET's IMRD Shirpur.";
  const defaultImage = `${baseUrl}/images/club-logo.png`;
  const defaultKeywords = "ai student chapters, AI Student Chapters, aistudentchapters, imrdaisc, AISC, AISC RCPIMRD, RCPIMRD AI club, AI student community, machine learning student club Shirpur, artificial intelligence education";
  
  const ogImage = image?.startsWith('http') ? image : (image ? `${baseUrl}${image}` : defaultImage);

  // Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': crumb.item.startsWith('http') ? crumb.item : `${baseUrl}${crumb.item}`,
    })),
  } : null;

  const schemasToRender = [
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    ...(Array.isArray(schema) ? schema : schema ? [schema] : []),
  ];

  return (
    <Helmet>
      <title>{title.includes('AI Student Chapters') ? title : `${title} | AI Student Chapters`}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:site_name" content="AI Student Chapters" />
      <meta property="og:title" content={`${title} | AI Student Chapters`} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | AI Student Chapters`} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Schemas */}
      {schemasToRender.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

