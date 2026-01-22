import axios from 'axios';

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

/**
 * Performs a web search using DuckDuckGo's HTML interface.
 * This is a free way to get search results without an API key.
 */
export async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  try {
    // Using a public DuckDuckGo search proxy or a simple scraper approach
    // Since we are in a Node.js environment, we can use axios to fetch the HTML
    // and then parse it, or use a known free API if available.
    // For reliability in this environment, we'll use a simple search query.
    
    const response = await axios.get(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const results: SearchResult[] = [];
    
    // Simple regex-based parsing for DuckDuckGo HTML results
    // This is a fallback if we don't have a proper scraper library
    const resultRegex = /<div class="result__body">([\s\S]*?)<\/div>/g;
    const titleRegex = /<a class="result__a" href="([^"]+)">([\s\S]*?)<\/a>/;
    const snippetRegex = /<a class="result__snippet" href="[^"]+">([\s\S]*?)<\/a>/;

    let match;
    while ((match = resultRegex.exec(html)) !== null && results.length < 10) {
      const body = match[1];
      const titleMatch = titleRegex.exec(body);
      const snippetMatch = snippetRegex.exec(body);

      if (titleMatch) {
        results.push({
          link: titleMatch[1],
          title: titleMatch[2].replace(/<[^>]*>?/gm, '').trim(),
          snippet: snippetMatch ? snippetMatch[1].replace(/<[^>]*>?/gm, '').trim() : ''
        });
      }
    }

    return results;
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return [];
  }
}
