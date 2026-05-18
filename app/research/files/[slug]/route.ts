import fs from "fs/promises";
import { notFound } from "next/navigation";
import { getResearchFilePath } from "@/lib/research";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const filePath = getResearchFilePath(slug);

  if (!filePath) {
    notFound();
  }

  const file = await fs.readFile(filePath);

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${slug}.pdf"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
