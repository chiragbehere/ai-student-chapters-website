import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
let errors = [];

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${message}`);
  } else {
    errors.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('====================================================');
console.log('🚀 RUNNING COMPREHENSIVE SEO, AEO & SCHEMA VALIDATOR');
console.log('====================================================\n');

// 1. Validate public/robots.txt
console.log('📋 1. Auditing robots.txt...');
const robotsPath = path.join(rootDir, 'public', 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt exists in public directory');

if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert(robotsContent.includes('Sitemap: https://imrdaisc.vercel.app/sitemap.xml'), 'robots.txt references canonical sitemap.xml');
  assert(robotsContent.includes('User-agent: GPTBot') && robotsContent.includes('Allow: /'), 'robots.txt explicitly accommodates GPTBot');
  assert(robotsContent.includes('User-agent: ClaudeBot') && robotsContent.includes('Allow: /'), 'robots.txt explicitly accommodates ClaudeBot');
  assert(robotsContent.includes('User-agent: PerplexityBot') && robotsContent.includes('Allow: /'), 'robots.txt explicitly accommodates PerplexityBot');
  assert(robotsContent.includes('Disallow: /admin'), 'robots.txt protects admin routes');
  assert(!robotsContent.match(/User-agent:\s*\*\s*\nDisallow:\s*\/\s*$/m), 'robots.txt does NOT block entire site from all crawlers');
}

// 2. Validate public/sitemap.xml
console.log('\n🗺️ 2. Auditing sitemap.xml...');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists in public directory');

if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const expectedRoutes = [
    'https://imrdaisc.vercel.app/',
    'https://imrdaisc.vercel.app/about',
    'https://imrdaisc.vercel.app/events',
    'https://imrdaisc.vercel.app/team',
    'https://imrdaisc.vercel.app/sessions',
    'https://imrdaisc.vercel.app/gallery',
    'https://imrdaisc.vercel.app/tools',
    'https://imrdaisc.vercel.app/code-carnival',
    'https://imrdaisc.vercel.app/faq'
  ];

  for (const route of expectedRoutes) {
    assert(sitemapContent.includes(`<loc>${route}</loc>`), `sitemap.xml contains indexable route: ${route}`);
  }

  assert(!sitemapContent.includes('/admin'), 'sitemap.xml excludes private /admin route');
  assert(!sitemapContent.includes('aistudentchapters.vercel.app'), 'sitemap.xml has no outdated domain references');
}

// 3. Validate index.html static baseline
console.log('\n📄 3. Auditing index.html Baseline...');
const indexPath = path.join(rootDir, 'index.html');
assert(fs.existsSync(indexPath), 'index.html exists');

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  assert(indexContent.includes('<title>AI Student Chapters | RCPIMRD</title>'), 'index.html has title with entity branding');
  assert(indexContent.includes('meta name="description"'), 'index.html has meta description');
  assert(indexContent.includes('rel="canonical" href="https://imrdaisc.vercel.app/"'), 'index.html has canonical link to imrdaisc.vercel.app');
  assert(indexContent.includes('meta name="robots" content="index, follow"'), 'index.html has robots index, follow');
  assert(indexContent.includes('meta name="referrer" content="strict-origin-when-cross-origin"'), 'index.html has strict referrer policy');
  assert(indexContent.includes('"@type": "WebSite"'), 'index.html contains WebSite JSON-LD');
  assert(indexContent.includes('"@type": "EducationalOrganization"'), 'index.html contains EducationalOrganization JSON-LD');
  assert(indexContent.includes('rel="manifest" href="/site.webmanifest"'), 'index.html references PWA site.webmanifest');
  assert(indexContent.includes('rel="preconnect" href="https://fonts.googleapis.com"'), 'index.html has preconnect optimization for fonts');
}

// Summary Report
console.log('\n====================================================');
console.log(`Validation Completed: ${passedChecks}/${totalChecks} tests passed`);
if (errors.length === 0) {
  console.log('🎉 ALL SEO, AEO, GEO & LLMO VALIDATIONS PASSED!');
  process.exit(0);
} else {
  console.error(`❌ ${errors.length} validation errors occurred:`);
  errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
}
