import type { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/blog";
import { getSortedCaseStudiesData } from "@/lib/case-studies";
import { getAllProjectSlugs } from "@/app/projects/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pomaidb-web.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hire-me`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dedicated & catalog project routes
  const projectSlugs = getAllProjectSlugs();
  const dedicatedProjects = [
    "cheesepath",
    "esolutions",
    "fetchr",
    "fixago",
    "ice_age",
    "morsel",
    "palloc",
    "pomai-studio",
    "pomaidb",
    "pomaikache",
    "pomailkache",
    "rust-studio",
    "vgc-user",
  ];
  const uniqueProjectSlugs = Array.from(new Set([...projectSlugs, ...dedicatedProjects]));
  const projectRoutes: MetadataRoute.Sitemap = uniqueProjectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Engineering blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = getSortedPostsData();
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    blogRoutes = [];
  }

  // Case study routes
  let caseStudyRoutes: MetadataRoute.Sitemap = [];
  try {
    const caseStudies = getSortedCaseStudiesData();
    caseStudyRoutes = caseStudies.map((cs) => ({
      url: `${baseUrl}/case-studies/${cs.slug}`,
      lastModified: cs.date ? new Date(cs.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    caseStudyRoutes = [];
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes, ...caseStudyRoutes];
}
