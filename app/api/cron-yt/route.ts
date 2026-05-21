import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const API_KEY = process.env.YOUTUBE_API_KEY;
const JSON_FILE_PATH = path.join(process.cwd(), "content", "videos", "videos.json");

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cronToken = searchParams.get("token");

    if (cronToken !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!API_KEY || !CHANNEL_ID) {
        return NextResponse.json({ error: "Missing required environment variables" }, { status: 500 });
    }

    const uploadsPlaylistId = "UU" + CHANNEL_ID.substring(2);

    try {
        const ytResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploadsPlaylistId}&key=${API_KEY}`,
            { next: { revalidate: 0 } }
        );

        if (!ytResponse.ok) {
            const errorData = await ytResponse.json();
            return NextResponse.json({ error: "YouTube API Error", details: errorData }, { status: 500 });
        }

        const ytData = await ytResponse.json();

        const fetchedVideos = ytData.items.map((item: any) => {
            const videoId = item.contentDetails.videoId;
            return {
                id: videoId,
                title: item.snippet.title,
                url: `https://youtu.be/${videoId}`,
                thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
                publishedAt: Math.floor(new Date(item.snippet.publishedAt).getTime() / 1000)
            };
        });

        let existingVideos = [];
        if (fs.existsSync(JSON_FILE_PATH)) {
            const fileContent = fs.readFileSync(JSON_FILE_PATH, "utf-8");
            existingVideos = JSON.parse(fileContent);
        }

        const videoMap = new Map();
        existingVideos.forEach((v: any) => videoMap.set(v.id, v));
        fetchedVideos.forEach((v: any) => videoMap.set(v.id, v));

        const finalVideos = Array.from(videoMap.values()).sort((a: any, b: any) => b.publishedAt - a.publishedAt);

        const dirPath = path.dirname(JSON_FILE_PATH);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const tmpPath = `${JSON_FILE_PATH}.tmp`;
        fs.writeFileSync(tmpPath, JSON.stringify(finalVideos, null, 2), "utf-8");
        fs.renameSync(tmpPath, JSON_FILE_PATH);

        return NextResponse.json({
            success: true,
            message: "YouTube sync completed successfully",
            total_videos: finalVideos.length
        });

    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}