import fs from "fs";
import path from "path";
import { ForestPageShell } from "@/components/forest-journey/ForestPageShell";

function getLocalVideos() {
  const filePath = path.join(process.cwd(), "content", "videos", "videos.json");
  if (!fs.existsSync(filePath)) return [];
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export default function VideoPage() {
  const videos = getLocalVideos();

  return (
    <ForestPageShell
      eyebrow="Media & Tutorials"
      title="Technical Videos"
      description="Engineering deep-dives, framework demonstrations, and performance benchmarks brought to life through video guides."
    >
      <div className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: any, i: number) => (
              <div
                key={video.id}
                className="fp-card fp-card--hover group flex flex-col"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {video.thumbnail && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-emerald-900/30 mb-5 bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center backdrop-blur-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-300 ml-1">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                <h2 className="text-base font-bold text-white/90 line-clamp-2 tracking-tight flex-1 group-hover:text-emerald-300 transition-colors">
                  {video.title}
                </h2>

                <div className="mt-5 pt-4 border-t border-emerald-900/30">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fp-btn fp-btn--primary w-full text-center"
                  >
                    Watch on YouTube ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="fp-card text-center py-16">
            <div className="w-16 h-16 rounded-full bg-emerald-900/30 border border-emerald-700/20 flex items-center justify-center mx-auto mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400/50">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white/70">No videos found</h2>
            <p className="mt-3 text-zinc-500 text-sm max-w-xs mx-auto">
              Run the initialization script or trigger the webhook endpoint to populate video data.
            </p>
          </div>
        )}
      </div>
    </ForestPageShell>
  );
}