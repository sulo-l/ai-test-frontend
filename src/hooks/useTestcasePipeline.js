import { useState, useRef } from "react";

/**
 * ✅ SSE 流式用例生成 Pipeline（最终稳定版）
 * 修复点：
 * 1️⃣ case 按 test_point_id 精准挂载（不广播）
 * 2️⃣ 不再 O(N×M) 全量复制，性能恢复
 * 3️⃣ Excel / UI / 后端 total 三方一致
 * 4️⃣ 原有结构 & API 100% 不变
 */
export default function useTestcasePipeline() {
    const [status, setStatus] = useState("idle");
    const [requirement, setRequirement] = useState("");

    const [pdfText, setPdfText] = useState("");
    const [testPoints, setTestPoints] = useState([]);

    const [bufferedTestPoints, setBufferedTestPoints] = useState([]);
    const bufferRef = useRef([]);

    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [downloadReady, setDownloadReady] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState("");

    const abortRef = useRef(null);
    const finishedRef = useRef(false);

    const [hasAnyOutput, setHasAnyOutput] = useState(false);
    const hasAnyOutputRef = useRef(false);

    const [caseCount, setCaseCount] = useState(0);
    const caseCountRef = useRef(0);

    // ================= 重置 =================
    const resetPipeline = () => {
        abortRef.current?.abort();
        abortRef.current = null;
        finishedRef.current = false;

        setRequirement("");
        setPdfText("");
        setTestPoints([]);
        setBufferedTestPoints([]);
        bufferRef.current = [];

        setProgress({ current: 0, total: 0 });
        setDownloadReady(false);
        setDownloadUrl("");

        setHasAnyOutput(false);
        hasAnyOutputRef.current = false;

        setCaseCount(0);
        caseCountRef.current = 0;

        setStatus("idle");
    };

    // ================= 中断 =================
    const stopGeneration = () => {
        abortRef.current?.abort();
        abortRef.current = null;
        finishedRef.current = true;
        setStatus("idle");
    };

    // ================= 启动 SSE =================
    const start = async (file) => {
        if (!file || status === "running") return;

        setStatus("running");
        finishedRef.current = false;

        setPdfText("");
        setTestPoints([]);
        setBufferedTestPoints([]);
        bufferRef.current = [];

        setProgress({ current: 0, total: 0 });
        setDownloadReady(false);
        setDownloadUrl("");

        setHasAnyOutput(false);
        hasAnyOutputRef.current = false;

        setCaseCount(0);
        caseCountRef.current = 0;

        const controller = new AbortController();
        abortRef.current = controller;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("requirement", requirement || "");

        try {
            const res = await fetch(
                "http://127.0.0.1:8000/generate-testcases/stream",
                {
                    method: "POST",
                    body: formData,
                    signal: controller.signal,
                    headers: { Accept: "text/event-stream" },
                }
            );

            if (!res.ok || !res.body) {
                throw new Error("SSE connection failed");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                let idx;
                while ((idx = buffer.indexOf("\n\n")) !== -1) {
                    const raw = buffer.slice(0, idx);
                    buffer = buffer.slice(idx + 2);

                    if (!raw.startsWith("data:")) continue;

                    const json = raw.replace(/^data:\s*/, "").trim();
                    if (!json) continue;

                    handleEvent(JSON.parse(json));
                }
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                setStatus("error");
            }
        }
    };

    // ================= SSE 分发（核心修复） =================
    const handleEvent = (payload) => {
        if (finishedRef.current && payload.type !== "done") return;

        switch (payload.type) {
            case "test_points": {
                if (bufferRef.current.length > 0) return;

                const next = (payload.data || []).map((m) => ({
                    module: m.module,
                    points: (m.points || []).map((p) => ({
                        ...p,
                        cases: [],
                    })),
                }));

                bufferRef.current = next;
                setBufferedTestPoints(next);
                break;
            }

            case "case": {
                // ✅ 防止 done 之后尾包污染统计
                if (finishedRef.current) return;

                const c = payload.data?.case || payload.data;
                if (!c || !c.test_point_id) return;

                // 精准挂载
                for (const m of bufferRef.current) {
                    for (const p of m.points) {
                        if (p.id === c.test_point_id) {
                            p.cases.push(c);
                            break;
                        }
                    }
                }

                setBufferedTestPoints([...bufferRef.current]);

                if (!hasAnyOutputRef.current) {
                    hasAnyOutputRef.current = true;
                    setHasAnyOutput(true);
                }

                caseCountRef.current += 1;
                setCaseCount(caseCountRef.current);
                setProgress((p) => ({ ...p, current: caseCountRef.current }));
                break;
            }

            case "done": {
                finishedRef.current = true;

                setTestPoints(bufferRef.current);
                setDownloadUrl(payload.data?.download_url || "");
                setDownloadReady(true);

                if (typeof payload.data?.total === "number") {
                    // ✅ 用后端 total 作为最终唯一真值
                    caseCountRef.current = payload.data.total;
                    setCaseCount(payload.data.total);
                    setProgress({
                        current: payload.data.total,
                        total: payload.data.total,
                    });
                }

                setHasAnyOutput(true);
                setStatus("done");
                abortRef.current?.abort();
                break;
            }

            case "error":
                finishedRef.current = true;
                setStatus("error");
                break;

            default:
                break;
        }
    };

    // ================= 返回 =================
    return {
        status,
        requirement,
        pdfText,
        testPoints,
        bufferedTestPoints,
        hasAnyOutput,
        progress,
        downloadReady,
        downloadUrl,
        caseCount,

        setRequirement,
        start,
        stopGeneration,
        resetPipeline,
    };
}
