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
      eyebrow="PROOF I OCCASIONALLY TALK & RECORD STUFF"
      title="MY VISUAL CHAOS & TALKS"
      description="I recorded my screen, talked over some code, and uploaded it before I could change my mind. Watch me explain things, break things in 4K, and pretend I knew it was going to work on the first try."
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-8">
        {/* Funny Intro Banner */}
        <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* Spatial Room Branding Badge */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#6D5DFB] text-white">ROOM 05</span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-[#171717]">THE SCREENING ROOM (VIDEO DEMOS)</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6D5DFB] uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#6D5DFB] animate-pulse" />
            <span>VIDEO DISCLAIMER</span>
          </div>
          <p className="text-sm text-[#171717] font-semibold leading-relaxed">
            &quot;Why write a 2,000-word blog post when a 5-minute video can show the exact moment my terminal throws an unhandled exception?&quot;
          </p>
          <p className="text-xs text-[#525252] mt-1 font-mono">
            Recorded live, minimally edited, and powered by pure caffeine.
          </p>
        </div>
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