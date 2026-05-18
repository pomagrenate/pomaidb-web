import fs from "fs";
import path from "path";

const researchDirectory = path.join(process.cwd(), "content/research");

type ResearchMetadata = {
  title: string;
  authors: string;
  date: string;
  abstract: string;
  keywords: string[];
};

export interface ResearchItem extends ResearchMetadata {
  slug: string;
  fileName: string;
  href: string;
  pages?: number;
  fileSize: string;
}

const researchMetadata: Record<string, ResearchMetadata & { pages?: number }> = {
  mfhoi: {
    title: "MFHOI-Miner: An Efficient Method for Mining Maximal Frequent High-Occupancy Itemsets",
    authors: "Quan Van",
    date: "May 18, 2026",
    pages: 34,
    abstract:
      "This paper introduces Maximal Frequent High-Occupancy Itemsets and MFHOI-Miner, an exact vertical bitset-based depth-first algorithm for discovering concise, occupancy-aware dense frequent patterns.",
    keywords: [
      "Frequent itemset mining",
      "High-occupancy itemsets",
      "Maximal frequent itemsets",
      "Pattern mining",
    ],
  },
};

export function getResearchItems(): ResearchItem[] {
  if (!fs.existsSync(researchDirectory)) {
    return [];
  }

  return fs
    .readdirSync(researchDirectory)
    .filter((fileName) => fileName.endsWith(".pdf"))
    .map((fileName) => {
      const slug = fileName.replace(/\.pdf$/, "");
      const metadata = researchMetadata[slug] ?? fallbackMetadata(slug);
      const fullPath = path.join(researchDirectory, fileName);
      const stats = fs.statSync(fullPath);

      return {
        slug,
        fileName,
        href: `/research/files/${slug}`,
        fileSize: formatFileSize(stats.size),
        ...metadata,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getResearchFilePath(slug: string) {
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    return null;
  }

  const fullPath = path.join(researchDirectory, `${slug}.pdf`);

  if (!fullPath.startsWith(researchDirectory) || !fs.existsSync(fullPath)) {
    return null;
  }

  return fullPath;
}

function fallbackMetadata(slug: string): ResearchMetadata {
  return {
    title: slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    authors: "Quan Van",
    date: "Research",
    abstract: "Research paper available as a PDF.",
    keywords: ["Research"],
  };
}

function formatFileSize(bytes: number) {
  const megabytes = bytes / 1024 / 1024;
  return `${megabytes.toFixed(1)} MB`;
}
