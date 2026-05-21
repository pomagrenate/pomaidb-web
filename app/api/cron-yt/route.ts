import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Cấu hình ID kênh YouTube của ông và ID Playlist Uploads (bắt đầu bằng UU...)
const CHANNEL_ID = "ID_KENH_YOUTUBE_CUA_BAN";
const UPLOADS_PLAYLIST_ID = "UU" + CHANNEL_ID.substring(2); // Mẹo lấy Playlist Uploads từ Channel ID
const API_KEY = process.env.YOUTUBE_API_KEY; // Lấy từ file .env

const JSON_FILE_PATH = path.join(process.cwd(), "public", "content", "videos", "videos.json");

export async function GET(request: Request) {
    // 🔒 Bảo mật: Kiểm tra secret token từ Cronjob bên ngoài để tránh người lạ tự ý ping phá Quota
    const { searchParams } = new URL(request.url);
    const cronToken = searchParams.get("token");
    if (cronToken !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!API_KEY) {
        return NextResponse.json({ error: "Missing YouTube API Key trong .env" }, { status: 500 });
    }

    try {
        // 1. Gọi lên YouTube Data API v3 lấy tối đa 50 video mới nhất từ Playlist Uploads
        const ytResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${UPLOADS_PLAYLIST_ID}&key=${API_KEY}`,
            { next: { revalidate: 0 } } // Không cache request này
        );

        if (!ytResponse.ok) {
            const errorData = await ytResponse.json();
            return NextResponse.json({ error: "YouTube API Error", details: errorData }, { status: 500 });
        }

        const ytData = await ytResponse.json();

        // 2. Định dạng lại dữ liệu chuẩn khớp với cấu trúc videos.json hiện tại của ông
        const fetchedVideos = ytData.items.map((item: any) => {
            const videoId = item.contentDetails.videoId;
            return {
                id: videoId,
                title: item.snippet.title,
                url: `https://youtu.be/${videoId}`,
                thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
                publishedAt: Math.floor(new Date(item.snippet.publishedAt).getTime() / 1000) // Đưa về Epoch Timestamp số nguyên cho nhẹ
            };
        });

        // 3. Đọc dữ liệu cũ từ file JSON hiện tại (nếu có) để tránh mất các video siêu cũ nằm ngoài top 50
        let existingVideos = [];
        if (fs.existsSync(JSON_FILE_PATH)) {
            const fileContent = fs.readFileSync(JSON_FILE_PATH, "utf-8");
            existingVideos = JSON.parse(fileContent);
        }

        // 4. Hợp nhất (Merge) dữ liệu cũ và mới, loại bỏ trùng lặp dựa trên Video ID
        const videoMap = new Map();
        // Nạp video cũ vào map trước
        existingVideos.forEach((v: any) => videoMap.set(v.id, v));
        // Nạp video mới vào đè lên hoặc bổ sung (giữ thứ tự mới nhất)
        fetchedVideos.forEach((v: any) => videoMap.set(v.id, v));

        // Chuyển map thành mảng và sắp xếp theo thời gian mới nhất lên đầu
        const finalVideos = Array.from(videoMap.values()).sort((a: any, b: any) => b.publishedAt - a.publishedAt);

        // 5. 🔒 Áp dụng cơ chế "Write-and-Rename" để ghi file an toàn chống rách file
        const tmpPath = `${JSON_FILE_PATH}.tmp`;
        fs.writeFileSync(tmpPath, JSON.stringify(finalVideos, null, 2), "utf-8");
        fs.renameSync(tmpPath, JSON_FILE_PATH);

        return NextResponse.json({
            success: true,
            message: "Đồng bộ danh sách video YouTube thành công!",
            total_videos: finalVideos.length
        });

    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}