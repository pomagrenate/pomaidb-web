import Link from "next/link";

export interface PostContext {
    title: string;
    slug: string;
    seriesOrder: number;
}

export interface SeriesNavigatorProps {
    seriesName: string;
    currentOrder: number;
    allSeriesPosts: PostContext[];
}

export function SeriesNavigator({ seriesName, currentOrder, allSeriesPosts }: SeriesNavigatorProps) {
    const sortedPosts = [...allSeriesPosts].sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));

    const currentIndex = sortedPosts.findIndex((p) => p.seriesOrder === currentOrder);
    const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
    const nextPost = currentIndex >= 0 && currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

    return (
        <div className="fp-card bg-[#030a03] border-emerald-900/40 my-12 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest font-mono">
                    Series: {seriesName}
                </h4>
            </div>

            <p className="text-zinc-400 text-sm mb-6">
                You are reading part {currentOrder} of {sortedPosts.length} in this architectural case study.
            </p>

            <div className="space-y-2 mb-8">
                {sortedPosts.map((post) => (
                    <div
                        key={post.slug}
                        className={`flex items-center gap-3 text-sm ${post.seriesOrder === currentOrder ? 'text-white font-bold' : 'text-zinc-500'
                            }`}
                    >
                        <span className="font-mono opacity-50">{post.seriesOrder}.</span>
                        {post.seriesOrder === currentOrder ? (
                            <span>{post.title} (Current)</span>
                        ) : (
                            <Link href={`/blog/${post.slug}`} className="hover:text-emerald-400 transition-colors">
                                {post.title}
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-emerald-900/30">
                {prevPost ? (
                    <Link href={`/blog/${prevPost.slug}`} className="flex flex-col group w-1/2 pr-4">
                        <span className="text-xs text-zinc-500 font-mono mb-1 group-hover:text-emerald-400 transition-colors">
                            ← Previous Part
                        </span>
                        <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors line-clamp-1">
                            {prevPost.title}
                        </span>
                    </Link>
                ) : (
                    <div className="w-1/2" />
                )}

                {nextPost ? (
                    <Link href={`/blog/${nextPost.slug}`} className="flex flex-col items-end group text-right w-1/2 pl-4">
                        <span className="text-xs text-zinc-500 font-mono mb-1 group-hover:text-emerald-400 transition-colors">
                            Next Part →
                        </span>
                        <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors line-clamp-1">
                            {nextPost.title}
                        </span>
                    </Link>
                ) : (
                    <div className="w-1/2" />
                )}
            </div>
        </div>
    );
}