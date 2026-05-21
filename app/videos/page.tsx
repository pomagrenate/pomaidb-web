'use client'

import { useState, useEffect } from "react"

export default function VideoPage() {
    const [videos, setVideos] = useState([])

    useEffect(() => {
        const fetchVideos = async () => {
            // Thêm timestamp ngẫu nhiên để tránh việc trình duyệt cache file JSON cũ
            const response = await fetch(`/content/videos/videos.json?t=${Date.now()}`)
            const data = await response.json()
            setVideos(data)
        }
        fetchVideos()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center bg-black min-height-screen py-10">
            <div className="w-full max-w-7xl px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between border-b border-zinc-800 mb-8">
                    <h1 className="text-2xl font-bold tracking-tighter text-white">My YouTube Videos</h1>
                </div>
            </div>

            {videos && videos.length > 0 ? (
                <div className="w-full max-w-7xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video: any) => (
                        <div key={video.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 p-4 flex flex-col justify-between">
                            <div>
                                {video.thumbnail && (
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full aspect-video object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h2 className="text-lg font-semibold text-zinc-100 line-clamp-2 mb-2">{video.title}</h2>
                            </div>
                            <div className="mt-4">
                                <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-lime-400 hover:underline break-all"
                                >
                                    Watch Video →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-zinc-500">No videos found.</p>
            )}
        </div>
    )
}