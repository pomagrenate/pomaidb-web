// components/Mermaid.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Cấu hình theme cho Mermaid (Dark mode cho hợp với PomaiDB)
mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    fontFamily: "var(--font-sora), system-ui, sans-serif", // Dùng font của dự án
    themeVariables: {
        darkMode: true,
        background: "transparent",
        primaryColor: "#c22b3d", // Màu đỏ Pomai
        lineColor: "#4a5568",
        textColor: "#ffffff",
        mainBkg: "#1a202c",
    },
});

interface MermaidProps {
    chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && chart) {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            mermaid
                .render(id, chart)
                .then(({ svg }) => {
                    setSvg(svg);
                })
                .catch((error) => {
                    console.error("Mermaid failed to render:", error);
                    // Fallback nếu lỗi syntax thì hiện text
                    setSvg(`<pre style="color:red">${error.message}</pre>`);
                });
        }
    }, [chart, isMounted]);

    if (!isMounted) return <div className="animate-pulse h-32 bg-gray-800 rounded"></div>;

    return (
        <div
            ref={ref}
            className="mermaid-diagram"
            dangerouslySetInnerHTML={{ __html: svg }}
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                overflowX: "auto" // Cho phép scroll ngang nếu hình quá to
            }}
        />
    );
}