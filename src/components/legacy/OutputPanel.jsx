import { useState } from "react";
import { useTranslation } from "react-i18next";
import AgentCaseLoading from "../commno/AgentCaseLoading";

const API_BASE =
    window.__ENV__?.API_BASE ||
    process.env.REACT_APP_API_BASE ||
    "";

export default function OutputPanel({
                                        status = "idle",
                                        testPoints = [],
                                        subtleText,
                                        downloadUrl,
                                        hasAnyOutput = false,
                                        progress = { current: 0, total: 0 },
                                        caseCount = 0,
                                    }) {
    // 删除未使用的 t 变量
    const { i18n } = useTranslation();  // 只保留 i18n

    const [openIndex, setOpenIndex] = useState(null);

    const isRunning = status === "running";
    const isDone = status === "done";
    const isError = status === "error";

    const canDownload = isDone && Boolean(downloadUrl);

    const handleDownload = () => {
        if (!canDownload) return;

        const link = document.createElement("a");
        link.href = downloadUrl.startsWith("http")
            ? downloadUrl
            : `${API_BASE}${downloadUrl}`;
        link.download = "AI生成测试用例.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className="
                h-full min-h-0
                flex flex-col
                rounded-2xl
                bg-gradient-to-b from-white to-slate-50
                border border-slate-300/60
                ring-1 ring-white/60
                dark:from-[#020617]/60 dark:to-[#020617]/30
                dark:border-white/15 dark:ring-white/5
                p-6
            "
        >
            {/* ===== Header ===== */}
            <div className="mb-4 shrink-0">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    测试用例输出
                </h2>
                <p className={`text-sm ${subtleText}`}>
                    {isRunning
                        ? "AI 正在实时生成测试用例"
                        : isDone
                            ? `生成完成，共 ${caseCount} 条测试用例`
                            : "AI 自动生成的测试用例"}
                </p>
            </div>

            {/* ===== 主体 ===== */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                {/* ▶ 生成中（无输出） */}
                {isRunning && !hasAnyOutput && (
                    <div className="flex-1 flex items-center justify-center">
                        <AgentCaseLoading
                            key={`agent-loading-${i18n.language}`}
                            progress={progress}
                        />
                    </div>
                )}

                {/* ▶ 错误态 */}
                {isError && (
                    <div className="flex-1 flex items-center justify-center text-center">
                        <div>
                            <div className="text-sm text-red-500 mb-2">
                                AI 测试用例生成失败
                            </div>
                            <div className="text-xs text-slate-400">
                                请检查需求内容或稍后重试
                            </div>
                        </div>
                    </div>
                )}

                {/* ▶ 空态 */}
                {!isRunning && !hasAnyOutput && !isError && (
                    <div className="flex-1 flex items-center justify-center text-center">
                        <div>
                            <div className="text-sm text-slate-500 mb-1">
                                暂无生成结果
                            </div>
                            <div className="text-xs text-slate-400">
                                请点击「生成测试用例」
                            </div>
                        </div>
                    </div>
                )}

                {/* ▶ 用例列表（唯一允许滚动的地方） */}
                {hasAnyOutput && (
                    <div className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-1">
                        {testPoints.map((tc, i) => {
                            const opened = openIndex === i;

                            return (
                                <div
                                    key={i}
                                    className="
                                        rounded-xl
                                        bg-white
                                        border border-slate-200
                                        p-3
                                        transition
                                        hover:shadow-sm
                                        dark:bg-[#020617]/60
                                        dark:border-white/10
                                    "
                                >
                                    <button
                                        onClick={() =>
                                            setOpenIndex(opened ? null : i)
                                        }
                                        className="w-full text-left"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {tc.case_name ||
                                                        `测试用例 ${i + 1}`}
                                                </div>
                                                {tc.module && (
                                                    <div className="text-xs text-slate-400">
                                                        模块：{tc.module}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs text-slate-400">
                                                {opened ? "收起" : "展开"}
                                            </span>
                                        </div>
                                    </button>

                                    {opened && (
                                        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                                            {tc.precondition && (
                                                <div>
                                                    <strong>前置条件：</strong>
                                                    {tc.precondition}
                                                </div>
                                            )}

                                            {Array.isArray(tc.steps) &&
                                                tc.steps.length > 0 && (
                                                    <div>
                                                        <strong>步骤：</strong>
                                                        <ol className="list-decimal ml-5 mt-1 space-y-1">
                                                            {tc.steps.map(
                                                                (s, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        {s}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ol>
                                                    </div>
                                                )}

                                            {tc.expected && (
                                                <div>
                                                    <strong>预期结果：</strong>
                                                    {tc.expected}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ===== 下载 ===== */}
            <div className="pt-4 shrink-0">
                <button
                    disabled={!canDownload}
                    onClick={handleDownload}
                    className={`
                        w-full h-12 rounded-xl font-semibold transition-all
                        ${
                        canDownload
                            ? `
                                    bg-gradient-to-r
                                    from-cyan-500 via-sky-500 to-indigo-500
                                    text-white
                                    shadow-[0_10px_30px_-10px_rgba(56,189,248,0.6)]
                                    hover:brightness-110
                                    active:scale-95
                                `
                            : `
                                    bg-white/60
                                    border border-slate-200
                                    text-slate-400
                                    cursor-not-allowed
                                    dark:bg-white/5
                                    dark:border-white/10
                                `
                    }
                    `}
                >
                    {canDownload ? "下载 Excel" : "生成完成后可下载"}
                </button>
            </div>
        </div>
    );
}
