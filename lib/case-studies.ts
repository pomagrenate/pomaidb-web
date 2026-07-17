import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";

const caseStudiesDirectory = path.join(process.cwd(), "content/case-studies");

export interface CaseStudyData {
    slug: string;
    title: string;
    date: string;
    author: string;
    excerpt: string;
    category: string;
    tags: string[];
    series?: string;
    seriesOrder?: number;
    contentHtml?: string;
    repo?: string;
}

export function getSortedCaseStudiesData(): CaseStudyData[] {
    if (!fs.existsSync(caseStudiesDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(caseStudiesDirectory);
    const allCaseStudiesData = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(caseStudiesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);

        return {
            slug,
            ...(matterResult.data as Omit<CaseStudyData, "slug" | "contentHtml">),
        };
    });

    return allCaseStudiesData.sort((a, b) => {
        if (a.series && b.series && a.series === b.series) {
            return (a.seriesOrder || 0) - (b.seriesOrder || 0);
        }
        return a.date < b.date ? 1 : -1;
    });
}

export async function getCaseStudyData(slug: string): Promise<CaseStudyData> {
    const fullPath = path.join(caseStudiesDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Case Study not found: ${slug}`);
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        ...(matterResult.data as Omit<CaseStudyData, "slug" | "contentHtml">),
    };
}