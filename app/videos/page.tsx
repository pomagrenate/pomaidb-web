import fs from "fs";
import path from "path";
import { PageShell } from "@/components/page-shell";

function getLocalVideos() {
  const filePath = path.join(process.cwd(), "content", "videos", "videos.json");
  if (!fs.existsSync(filePath)) return [];
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export default function VideoPage() {
  const videos = getLocalVideos();

  return (
    <PageShell
      eyebrow="Media & Tutorials"
      title="Technical Videos"
      description="Engineering deep-dives, framework demonstrations, and performance benchmarks brought to life through video guides."
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: any) => (
              <div
                key={video.id}
                className="group bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-[#6D5DFB]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {video.thumbnail && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#EAEAEA] mb-4 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <div className="w-12 h-12 rounded-full bg-[#6D5DFB] text-white flex items-center justify-center shadow-lg">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <h2 className="text-base font-bold text-[#171717] group-hover:text-[#6D5DFB] transition-colors leading-snug line-clamp-2">
                    {video.title}
                  </h2>
                </div>

                <div className="mt-5 pt-4 border-t border-[#EAEAEA]">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-xs font-semibold shadow-sm transition-all text-center"
                  >
                    <span>Watch on YouTube</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#EAEAEA] rounded-2xl text-center py-16 px-6 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-[#6D5DFB] flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#171717]">No videos found</h2>
            <p className="mt-2 text-[#737373] text-sm">
              Run the initialization script or trigger the webhook endpoint to populate video data.
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}