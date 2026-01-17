import { useState } from "react";
import { useTranslation } from "react-i18next";
import AgentCaseLoading from "./AgentCaseLoading";

export default function OutputPanel({
                                        status = "idle",
                                        testPoints = [],
                                        subtleText,
                                        downloadUrl,
                                        hasAnyOutput = false,
                                        progress,
                                        caseCount = 0, // ✅ 权威用例条数（来自 hook / 后端）
                                    }) {
    const { t, i18n } = useTranslation();
    const [openIndex, setOpenIndex] = useState(null);

    const isRunning = status === "running";
    const isDone = status === "done";

    const handleDownload = () => {
        if (!downloadUrl || !isDone) return;

        const link = document.createElement("a");
        link.href = downloadUrl.startsWith("http")
            ? downloadUrl
            : `http://127.0.0.1:8000${downloadUrl}`;

        link.download = t("output.download.filename");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="h-[560px] rounded-3xl p-6 flex flex-col backdrop-blur-2xl border shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] bg-white border-black/5 dark:bg-[#020617]/80 dark:border-cyan-400/20">
            {/* ================= Header ================= */}
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {t("output.title")}
                    </h2>
                    <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
                        {t("output.subtitle")}
                    </p>
                </div>

                {/* 状态 + 用例条数 */}
                <div className="flex flex-col items-end gap-1">
          <span
              className={`
              text-xs px-3 py-1 rounded-full font-medium
              ${
                  isRunning
                      ? "bg-indigo-500/15 text-indigo-500"
                      : isDone
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-slate-500/15 text-slate-400"
              }
            `}
          >
            {isRunning
                ? t("status.running")
                : isDone
                    ? t("status.done")
                    : t("status.waiting")}
          </span>

                    {/* ✅ 只认 hook 传下来的最终数量 */}
                    {isDone && caseCount > 0 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
              {t("output.caseCount.done", { count: caseCount })}
            </span>
                    )}
                </div>
            </div>

            {/* ================= 内容区 ================= */}
            <div className="flex-1 overflow-y-auto pr-1">
                {isRunning && (
                    <div className="h-full flex items-center justify-center">
                        <AgentCaseLoading
                            key={`agent-loading-${i18n.language}`}
                            progress={progress}
                        />
                    </div>
                )}

                {!isRunning && !hasAnyOutput && (
                    <div className="h-full flex items-center justify-center text-slate-400">
                        {t("output.empty")}
                    </div>
                )}

                {!isRunning && hasAnyOutput && (
                    <div className="space-y-3">
                        {testPoints.map((tp, i) => {
                            const opened = openIndex === i;
                            const moduleName =
                                tp.module || tp.name || `${t("output.module")} ${i + 1}`;
                            const points = tp.points || [];

                            return (
                                <div
                                    key={i}
                                    className="rounded-2xl border bg-white border-slate-200 dark:bg-[#020617]/60 dark:border-cyan-400/20"
                                >
                                    <button
                                        onClick={() => setOpenIndex(opened ? null : i)}
                                        className="w-full px-4 py-3 flex items-center gap-3 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
                                    >
                                        <div className="w-8 h-8 shrink-0 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-xs font-semibold">
                                            {i + 1}
                                        </div>

                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                {t("output.module")}：{moduleName}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {t("output.viewPoints")}
                                            </div>
                                        </div>

                                        <div className="text-xs text-slate-400">
                                            {opened ? t("output.collapse") : t("output.expand")}
                                        </div>
                                    </button>

                                    {opened && (
                                        <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 space-y-3">
                                            {points.map((p, idx) => (
                                                <div key={idx}>
                                                    <div className="font-medium">
                                                        • {p.name || p.id}
                                                    </div>

                                                    {p.cases?.length > 0 ? (
                                                        <ul className="list-disc pl-6 mt-1 space-y-1">
                                                            {p.cases.map((c, ci) => (
                                                                <li key={ci}>
                                                                    {c.case_name || JSON.stringify(c)}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <div className="text-slate-400 text-xs pl-4">
                                                            {t("output.noDetail")}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ================= 下载按钮 ================= */}
            <div className="pt-5">
                <button
                    disabled={!isDone || !downloadUrl}
                    onClick={handleDownload}
                    className={`
            w-full h-12 rounded-xl font-semibold transition-all
            ${
                        isDone && downloadUrl
                            ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-[#020617] shadow-[0_0_40px_-10px_rgba(56,189,248,0.7)] hover:brightness-110"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    }
          `}
                >
                    {t("output.download.label")}
                </button>
            </div>
        </div>
    );
}
