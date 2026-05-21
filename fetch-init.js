const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 1. Nạp các biến môi trường từ file .env
dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;
// 🟢 ĐỔI DÒNG NÀY: Đọc trực tiếp từ .env thay vì sửa cứng
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

if (!CHANNEL_ID || CHANNEL_ID.startsWith("ID_KENH")) {
    console.error("❌ Thất bại: Vui lòng cấu hình YOUTUBE_CHANNEL_ID thật trong file .env!");
    process.exit(1);
}

// Tự động chuyển đổi UC... thành UU... để lấy đúng Playlist Uploads
const UPLOADS_PLAYLIST_ID = "UU" + CHANNEL_ID.substring(2);

const OUTPUT_PATH = path.join(__dirname, 'public', 'content', 'videos', 'videos.json');

async function bootstrapYouTubeData() {
    if (!API_KEY) {
        console.error("❌ Thất bại: Không tìm thấy YOUTUBE_API_KEY trong file .env!");
        process.exit(1);
    }

    console.log("🚀 Đang cào dữ liệu khởi tạo từ YouTube API v3...");
    console.log(`📺 Channel ID: ${CHANNEL_ID}`);
    console.log(`🎵 Playlist ID: ${UPLOADS_PLAYLIST_ID}`);

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${UPLOADS_PLAYLIST_ID}&key=${API_KEY}`
        );

        if (!response.ok) {
            const err = await response.json();
            throw new Error(JSON.stringify(err));
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            console.log("⚠️ Kênh của ông hiện chưa có video nào công khai.");
            return;
        }

        const formattedVideos = data.items.map(item => {
            const videoId = item.contentDetails.videoId;
            return {
                id: videoId,
                title: item.snippet.title,
                url: `https://youtu.be/${videoId}`,
                thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
                publishedAt: Math.floor(new Date(item.snippet.publishedAt).getTime() / 1000)
            };
        });

        const dir = path.dirname(OUTPUT_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const tmpPath = `${OUTPUT_PATH}.tmp`;
        fs.writeFileSync(tmpPath, JSON.stringify(formattedVideos, null, 2), 'utf-8');
        fs.renameSync(tmpPath, OUTPUT_PATH);

        console.log(`\n=== ✅ KHỞI TẠO THÀNH CÔNG ===`);
        console.log(`📂 File đã ghi: ${OUTPUT_PATH}`);
        console.log(`📊 Tổng số video thu thập được: ${formattedVideos.length}`);
        console.log(`--------------------------------`);

    } catch (error) {
        console.error("❌ Lỗi trong quá trình fetch dữ liệu:", error.message);
    }
}

bootstrapYouTubeData();