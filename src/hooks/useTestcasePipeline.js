import { useState, useRef, useCallback, useEffect } from "react";
import {
    generateTestcasesStream,
    fetchWorkflowStatus,
} from "../api/testcaseApi";

/**
 * ===============================
 * ⭐ 仅用于 requirements → string
 * ===============================
 */
function normalizeRequirementsOnly(input) {
    if (!input) return "";

    // 1️⃣ 已经是字符串（最理想情况）
    if (typeof input === "string") {
        return input;
    }

    // 2️⃣ 直接是 requirements 数组
    if (Array.isArray(input)) {
        return input.join("\n");
    }

    // 3️⃣ 是 analysisResult 对象，只取 requirements
    if (typeof input === "object") {
        const reqs = input.requirements;
        if (Array.isArray(reqs)) {
            return reqs.join("\n");
        }
    }

    // 兜底（理论上不该走到）
    return "";
}

export default function useTestcasePipeline({ workflowId }) {
    /* ================= 权威状态（非生成态） ================= */
    const [workflowProgress, setWorkflowProgress] = useState(null);

    /* ================= 内容态 ================= */
    const [cases, setCases] = useState([]);
    const casesRef = useRef([]);

    /* ================= UI 状态 ================= */
    const [status, setStatus] = useState("idle"); // idle | running | done | error
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [caseCount, setCaseCount] = useState(0);
    const [hasAnyOutput, setHasAnyOutput] = useState(false);

    const [downloadReady, setDownloadReady] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState("");

    /* ================= 控制 Ref ================= */
    const sseCloseRef = useRef(null);
    const startedRef = useRef(false);
    const finishedRef = useRef(false);
    const pollingRef = useRef(true);

    /* ================= workflow/status 轮询（非生成态） ================= */
    useEffect(() => {
        if (!workflowId) return;

        pollingRef.current = true;
        let timer = null;

        const poll = async () => {
            if (!pollingRef.current || startedRef.current) return;

            try {
                const data = await fetchWorkflowStatus(workflowId);
                setWorkflowProgress(data);

                if (data.stage === "generated") {
                    setStatus("done");
                } else if (data.stage === "analyzing") {
                    setStatus("running");
                } else {
                    setStatus("idle");
                }

                setProgress((p) => ({
                    ...p,
                    current: data.progress ?? p.current,
                }));
            } catch (e) {
                console.warn("workflow poll failed", e);
            }
        };

        poll();
        timer = setInterval(poll, 1000);

        return () => {
            pollingRef.current = false;
            timer && clearInterval(timer);
        };
    }, [workflowId]);

    /* ================= Reset ================= */
    const resetPipeline = useCallback(() => {
        if (sseCloseRef.current) {
            sseCloseRef.current();
            sseCloseRef.current = null;
        }

        startedRef.current = false;
        finishedRef.current = false;
        pollingRef.current = true;

        casesRef.current = [];
        setCases([]);
        setCaseCount(0);
        setHasAnyOutput(false);

        setDownloadReady(false);
        setDownloadUrl("");

        setWorkflowProgress(null);
        setStatus("idle");
        setProgress({ current: 0, total: 0 });
    }, []);

    /* ================= 🚀 启动生成 ================= */
    const start = useCallback(
        (input = {}) => {
            if (!workflowId) return;
            if (startedRef.current) return;

            startedRef.current = true;
            finishedRef.current = false;
            pollingRef.current = false;

            setStatus("running");
            setProgress({ current: 0, total: 0 });

            casesRef.current = [];
            setCases([]);
            setCaseCount(0);
            setHasAnyOutput(false);
            setDownloadReady(false);
            setDownloadUrl("");

            if (sseCloseRef.current) {
                sseCloseRef.current();
                sseCloseRef.current = null;
            }

            /**
             * ✅ 核心修复点：
             * 只提取 requirements，并转成 string
             */
            const requirement = normalizeRequirementsOnly(
                input?.requirement ?? input
            );

            try {
                const close = generateTestcasesStream({
                    workflowId,
                    requirement,

                    onMeta: () => {},

                    onCase: (testCase) => {
                        if (!testCase || finishedRef.current) return;
                        casesRef.current.push(testCase);
                        setCases([...casesRef.current]);
                        setCaseCount(casesRef.current.length);
                        setHasAnyOutput(true);
                    },

                    onDone: ({ download_url }) => {
                        finishedRef.current = true;
                        startedRef.current = false;

                        setDownloadUrl(download_url || "");
                        setDownloadReady(true);
                        setStatus("done");

                        pollingRef.current = true;
                    },

                    onError: (err) => {
                        console.error("SSE error", err);
                        finishedRef.current = true;
                        startedRef.current = false;
                        setStatus("error");
                        pollingRef.current = true;
                    },
                });

                sseCloseRef.current = close;
            } catch (e) {
                console.error("generate failed", e);
                startedRef.current = false;
                pollingRef.current = true;
                setStatus("error");
            }
        },
        [workflowId]
    );

    return {
        workflowProgress,

        cases,
        status,
        progress,
        caseCount,
        hasAnyOutput,

        downloadReady,
        downloadUrl,

        start,
        resetPipeline,
    };
}
