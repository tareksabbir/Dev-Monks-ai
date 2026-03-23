/**
 * Remove HTML tags from a string and decode basic entities if needed
 */
export function cleanHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Extract the domain name from a URL
 */
export function getDomain(url: string): string {
  if (!url) return "";
  try {
    const domain = new URL(url).hostname;
    return domain.startsWith("www.") ? domain.substring(4) : domain;
  } catch (e) {
    return "";
  }
}
