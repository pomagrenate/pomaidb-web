import { markdownToHtml } from "@/lib/markdown";

export default function RichText({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const merged = className ? `mdx ${className}` : "mdx";
  const html = content.includes("<") ? content : markdownToHtml(content);
  return (
    <div
      className={merged}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
