export const NAV_LINKS = [
  { label: "My Bookmarks", hasDropdown: true, href: "/bookmarks" },
  { label: "Products", hasDropdown: true, href: "#" },
  { label: "Solutions", hasDropdown: true, href: "#" },
  { label: "Research", hasDropdown: true, href: "#" },
  { label: "Blog", hasDropdown: true, href: "#" },
  { label: "Customers", hasDropdown: true, href: "#" },
  { label: "Company", hasDropdown: true, href: "#" },
];

export const CATEGORIES = [
  "All",
  "Top",
  "New",
  "Best",
  "Ask HN",
  "Show HN",
  "Jobs",
];

export const TAG_COLORS: Record<string, string> = {
  Research: "bg-tag-bg text-foreground border-foreground",
  Company: "bg-tag-bg text-foreground border-foreground",
  Product: "bg-tag-bg text-foreground border-foreground",
  Engineering: "bg-tag-bg text-foreground border-foreground",
  Solutions: "bg-tag-bg text-foreground border-foreground",
};
