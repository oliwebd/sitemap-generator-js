import React, { useState, useCallback } from 'react';
import { CrawlStatus, CrawledPage } from './types';
import { LinkIcon } from './components/icons';
import UrlInput from './components/UrlInput';
import SitemapOutput from './components/SitemapOutput';
import StatusIndicator from './components/StatusIndicator';
import CorsWarning from './components/CorsWarning';
import RobotsTxtEditor from './components/RobotsTxtEditor';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [status, setStatus] = useState<CrawlStatus>(CrawlStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [crawledPagesCount, setCrawledPagesCount] = useState(0);
  const [currentCrawlingUrl, setCurrentCrawlingUrl] = useState<string | null>(null);
  const [maxDepth, setMaxDepth] = useState<number>(2);

  const normalizeUrl = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      // Return origin + pathname, stripping search params, hash, and trailing slash on pathname
      return urlObj.origin + urlObj.pathname.replace(/\/$/, '');
    } catch (e) {
      return urlString.replace(/\/$/, '');
    }
  };

  const escapeXml = (unsafe: string): string => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  const generateSitemapXml = (pages: CrawledPage[]): string => {
    const urls = pages
      .map(page => {
        const lastmodTag = page.lastMod ? `\n    <lastmod>${new Date(page.lastMod).toISOString().split('T')[0]}</lastmod>` : '';
        const priority = page.isHomepage ? 0.8 : 0.6;
        return `
  <url>
    <loc>${escapeXml(page.url)}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
      .join('');
  
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
  };

  const handleGenerateSitemap = useCallback(async () => {
    if (!url) {
      setError('Please enter a valid URL.');
      setStatus(CrawlStatus.ERROR);
      return;
    }

    let initialUrl: URL;
    try {
      initialUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      setError('Invalid URL format.');
      setStatus(CrawlStatus.ERROR);
      return;
    }

    setStatus(CrawlStatus.CRAWLING);
    setSitemapXml('');
    setError(null);
    setCrawledPagesCount(0);
    setCurrentCrawlingUrl(initialUrl.href);

    const visited = new Set<string>();
    const results = new Map<string, string | null>();
    const queue: { url: string; depth: number }[] = [{ url: initialUrl.href, depth: 0 }];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;

      const { url: currentUrlStr, depth } = current;
      const normalized = normalizeUrl(currentUrlStr);

      if (visited.has(normalized) || depth > maxDepth) {
        continue;
      }
      
      visited.add(normalized);
      setCurrentCrawlingUrl(currentUrlStr);

      try {
        const response = await fetch(currentUrlStr);

        if (!response.ok) continue; // Skip bad responses
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) continue; // Skip non-HTML

        const lastMod = response.headers.get('Last-Modified');
        results.set(normalized, lastMod || null);
        setCrawledPagesCount(results.size);

        if (depth < maxDepth) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const links = Array.from(doc.querySelectorAll('a'));
            
            for (const link of links) {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
                
                try {
                    const absoluteUrl = new URL(href, currentUrlStr);
                    if (absoluteUrl.origin === initialUrl.origin) {
                        queue.push({ url: absoluteUrl.href, depth: depth + 1 });
                    }
                } catch (e) {
                    // Ignore invalid hrefs
                }
            }
        }
      } catch (e) {
        console.warn(`Could not fetch ${currentUrlStr}. Likely a CORS issue. Skipping.`);
      }
    }

    setCurrentCrawlingUrl(null);
    setStatus(CrawlStatus.GENERATING);
    
    if (results.size === 0) {
        setError("Could not crawl the website. This is likely due to CORS policy restrictions. See the warning below for more information.");
        setStatus(CrawlStatus.ERROR);
        return;
    }

    const homeUrlNormalized = normalizeUrl(initialUrl.href);
    const crawledPages: CrawledPage[] = Array.from(results.entries()).map(([pageUrl, lastMod]) => ({
      url: pageUrl,
      lastMod: lastMod,
      isHomepage: pageUrl === homeUrlNormalized,
    }));
    
    const xml = generateSitemapXml(crawledPages);
    setSitemapXml(xml);
    setStatus(CrawlStatus.DONE);
  }, [url, maxDepth]);

  const handleDownload = () => {
    const blob = new Blob([sitemapXml], { type: 'application/xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <LinkIcon className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              Sitemap Generator
            </h1>
          </div>
          <p className="text-gray-400 mt-2">
            A browser-based tool to crawl a website and generate an XML sitemap.
          </p>
        </header>

        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/20 border border-gray-700">
          <UrlInput 
            url={url} 
            setUrl={setUrl} 
            onSubmit={handleGenerateSitemap}
            isLoading={status === CrawlStatus.CRAWLING || status === CrawlStatus.GENERATING}
            maxDepth={maxDepth}
            setMaxDepth={setMaxDepth}
          />
          <StatusIndicator 
            status={status}
            error={error}
            crawledCount={crawledPagesCount}
            currentUrl={currentCrawlingUrl}
          />
        </div>

        <RobotsTxtEditor baseUrl={url} />
        
        {sitemapXml && status === CrawlStatus.DONE && (
          <SitemapOutput xml={sitemapXml} onDownload={handleDownload} />
        )}

        <CorsWarning />
      </main>
      <footer className="w-full max-w-4xl mx-auto text-center mt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Sitemap Generator. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;