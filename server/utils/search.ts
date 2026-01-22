import axios from 'axios';
import { callDataApi } from '../_core/dataApi';

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

/**
 * Performs a web search. 
 * Tries to use the built-in Data API first for reliability, 
 * then falls back to a robust DuckDuckGo scraper.
 */
export async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  // 1. Try built-in Data API first (most reliable in this environment)
  try {
    const data: any = await callDataApi("Google/search", {
      query: { q: query, gl: "us", hl: "en" }
    });
    
    if (data && data.organic_results) {
      return data.organic_results.map((r: any) => ({
        title: r.title || '',
        link: r.link || '',
        snippet: r.snippet || ''
      }));
    }
  } catch (error) {
    console.warn('Data API search failed, falling back to scraper:', error);
  }

  // 2. Fallback to DuckDuckGo Scraper
  try {
    // Using the direct HTML endpoint which is more stable for scraping
    const response = await axios.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://html.duckduckgo.com/',
      },
      timeout: 10000
    });

    const html = response.data;
    const results: SearchResult[] = [];
    
    // The HTML version of DDG uses a very specific structure:
    // <div class="result results_links results_links_deep web-result ">
    //   <div class="links_main links_deep result__body">
    //     <h2 class="result__title">
    //       <a class="result__a" href="...">Title</a>
    //     </h2>
    //     <a class="result__snippet" href="...">Snippet</a>
    //   </div>
    // </div>

    const resultRegex = /<div[^>]*class="[^"]*result__body[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
    const titleRegex = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/;
    const snippetRegex = /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/;

    let match;
    while ((match = resultRegex.exec(html)) !== null && results.length < 10) {
      const body = match[1];
      const titleMatch = titleRegex.exec(body);
      const snippetMatch = snippetRegex.exec(body);

      if (titleMatch) {
        let link = titleMatch[1];
        // Handle DDG redirect links
        if (link.includes('uddg=')) {
          try {
            const urlObj = new URL('https://duckduckgo.com' + link);
            const uddg = urlObj.searchParams.get('uddg');
            if (uddg) link = uddg;
          } catch (e) {
            // Fallback if URL parsing fails
            const m = link.match(/uddg=([^&]+)/);
            if (m) link = decodeURIComponent(m[1]);
          }
        }

        results.push({
          link: link,
          title: titleMatch[2].replace(/<[^>]*>?/gm, '').trim(),
          snippet: snippetMatch ? snippetMatch[1].replace(/<[^>]*>?/gm, '').trim() : ''
        });
      }
    }

    // Fallback: if regex fails, try a simpler split approach
    if (results.length === 0) {
      const parts = html.split('class="result__a"');
      for (let i = 1; i < parts.length && results.length < 5; i++) {
        const part = parts[i];
        const hrefMatch = parts[i-1].match(/href="([^"]+)"$/);
        const titleMatch = part.match(/^[^>]*>([\s\S]*?)<\/a>/);
        if (hrefMatch && titleMatch) {
          results.push({
            link: hrefMatch[1],
            title: titleMatch[1].replace(/<[^>]*>?/gm, '').trim(),
            snippet: ''
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error('DuckDuckGo scraper error:', error);
    return [];
  }
}
