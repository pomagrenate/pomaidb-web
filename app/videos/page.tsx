import fs from "fs";
import path from "path";

function getLocalVideos() {
    const filePath = path.join(process.cwd(), "content", "videos", "videos.json");
    if (!fs.existsSync(filePath)) return [];

    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
}

export default function VideoPage() {
    const videos = getLocalVideos();

    return (
        <div className="bg-background">
            {/* Header Section: Synced with Research Page typography */}
            <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:px-8">
                <div className="max-w-3xl">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Media & Tutorials</p>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
                        Technical Videos
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Engineering deep-dives, framework demonstrations, and performance benchmarks brought to life through video guides.
                    </p>
                </div>
            </section>

            {/* Content Section: Refactored with bright, modern grid cards */}
            <section className="border-t border-border/70 bg-muted/10">
                <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
                    {videos && videos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video: any) => (
                                <div
                                    key={video.id}
                                    className="flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all duration-300"
                                >
                                    <div>
                                        {video.thumbnail && (
                                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted border border-border/40 mb-4">
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <h2 className="text-base font-bold text-foreground line-clamp-2 tracking-tight">
                                            {video.title}
                                        </h2>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border/40">
                                        <a
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                                        >
                                            Watch on YouTube
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border border-border bg-card p-8 rounded-xl text-center">
                            <h2 className="text-xl font-bold tracking-tight text-foreground">No videos found</h2>
                            <p className="mt-3 text-muted-foreground">
                                Run the initialization script or trigger the webhook endpoint to populate data.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}