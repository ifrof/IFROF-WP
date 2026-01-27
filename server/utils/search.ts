import axios from "axios";
import { TRPCError } from "@trpc/server";

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

/**
 * Performs a web search using DuckDuckGo's HTML interface.
 * This is completely free and doesn't require any API keys.
 */
export async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  console.log(`[Search] Starting DuckDuckGo search for: "${query}"`);

  const controller = new AbortController();
  const timeoutMs = 10000; // Hard timeout 10 seconds
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    // Using the direct HTML endpoint which is more stable for scraping
    const response = await axios.get(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          Referer: "https://html.duckduckgo.com/",
        },
        timeout: timeoutMs, // Axios timeout
        signal: controller.signal, // AbortController signal
      }
    );

    clearTimeout(timeout);

    const html = response.data;
    const results: SearchResult[] = [];

    // DuckDuckGo HTML structure uses specific classes for results
    // We'll use multiple regex patterns to ensure we capture results

    // Pattern 1: Look for result__a links (main result links)
    const linkPattern =
      /<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    const snippetPattern =
      /<a[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;

    // Collect all links
    const links: { url: string; title: string }[] = [];
    let linkMatch;
    while ((linkMatch = linkPattern.exec(html)) !== null) {
      let url = linkMatch[1];
      const title = linkMatch[2].replace(/<[^>]*>?/gm, "").trim();

      // Handle DDG redirect links
      if (url.includes("uddg=")) {
        try {
          const urlObj = new URL("https://duckduckgo.com" + url);
          const uddg = urlObj.searchParams.get("uddg");
          if (uddg) url = uddg;
        } catch (e) {
          const m = url.match(/uddg=([^&]+)/);
          if (m) url = decodeURIComponent(m[1]);
        }
      }

      if (title && url && !url.includes("duckduckgo.com")) {
        links.push({ url, title });
      }
    }

    // Collect all snippets
    const snippets: string[] = [];
    let snippetMatch;
    while ((snippetMatch = snippetPattern.exec(html)) !== null) {
      snippets.push(snippetMatch[1].replace(/<[^>]*>?/gm, "").trim());
    }

    // Combine links with snippets
    for (let i = 0; i < links.length && results.length < 10; i++) {
      results.push({
        link: links[i].url,
        title: links[i].title,
        snippet: snippets[i] || "",
      });
    }

    // Fallback: If no results from primary pattern, try alternative parsing
    if (results.length === 0) {
      console.log("[Search] Primary pattern failed, trying fallback...");

      // Split by result blocks
      const blocks = html.split('class="result ');
      for (let i = 1; i < blocks.length && results.length < 10; i++) {
        const block = blocks[i];

        // Find href and title
        const hrefMatch = block.match(/href="([^"]+)"/);
        const titleMatch = block.match(/>([^<]+)<\/a>/);

        if (hrefMatch && titleMatch) {
          let url = hrefMatch[1];
          if (url.includes("uddg=")) {
            const m = url.match(/uddg=([^&]+)/);
            if (m) url = decodeURIComponent(m[1]);
          }

          if (!url.includes("duckduckgo.com")) {
            results.push({
              link: url,
              title: titleMatch[1].trim(),
              snippet: "",
            });
          }
        }
      }
    }

    console.log(`[Search] Found ${results.length} results`);
    return results;
  } catch (error: any) {
    clearTimeout(timeout);
    if (axios.isCancel(error) || error.name === "AbortError") {
      throw new TRPCError({
        code: "TIMEOUT",
        message: `Web search timed out after ${timeoutMs}ms.`,
      });
    }
    console.error("[Search] DuckDuckGo scraper error:", error.message);
    return [];
  }
}
