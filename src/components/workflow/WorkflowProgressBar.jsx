import React from "react";

/**
 * AI Workflow Progress Bar
 * - 业务逻辑不变
 * - 仅升级“连线”为渐变能量线
 */
export default function WorkflowProgressBar({
                                                stage,        // idle | fileReady | analyzing | analysisDone | generating | generated | error
                                                progress,     // 来自后端的 workflowProgress
                                                onReset,
                                            }) {
    const percent =
        typeof progress?.progress === "number"
            ? progress.progress
            : null;

    const message = progress?.message;

    const steps = [
        {
            key: "upload",
            label: "上传需求 PDF",
            active: stage !== "idle",
            done: ["fileReady", "analyzing", "analysisDone", "generating", "generated"].includes(stage),
        },
        {
            key: "process",
            label:
                message ||
                (stage === "analyzing"
                    ? "需求分析"
                    : stage === "generating"
                        ? "生成测试用例"
                        : "处理中"),
            active: ["analyzing", "analysisDone", "generating"].includes(stage),
            done: ["analysisDone", "generated"].includes(stage),
        },
        {
            key: "done",
            label: "完成",
            active: stage === "generated",
            done: stage === "generated",
        },
    ];

    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center justify-center flex-1">
                <div className="flex items-center gap-12">
                    {steps.map((step, idx) => (
                        <div key={step.key} className="flex items-center gap-4">
                            {/* ================= 圆点（原逻辑保留） ================= */}
                            <div className="relative flex items-center justify-center">
                                <div
                                    className={`
                    w-4 h-4 rounded-full transition-all
                    ${
                                        step.done
                                            ? "bg-gradient-to-br from-cyan-400 to-indigo-500"
                                            : step.active
                                                ? "border-2 border-cyan-400"
                                                : "border border-slate-300 dark:border-white/20"
                                    }
                  `}
                                />
                                {step.active && !step.done && (
                                    <div className="absolute w-6 h-6 rounded-full bg-cyan-400/20 blur-md animate-pulse" />
                                )}
                            </div>

                            {/* ================= 文案（原逻辑保留） ================= */}
                            <div
                                className={`
                  text-sm font-medium whitespace-nowrap transition
                  ${
                                    step.done
                                        ? "text-slate-900 dark:text-slate-100"
                                        : step.active
                                            ? "text-cyan-600 dark:text-cyan-400"
                                            : "text-slate-400"
                                }
                `}
                            >
                                {step.label}
                                {step.key === "process" && percent !== null && stage !== "generated" && (
                                    <span className="ml-2 text-xs text-slate-400">
                    {percent}%
                  </span>
                                )}
                            </div>

                            {/* ================= 渐变能量线（升级点） ================= */}
                            {idx < steps.length - 1 && (
                                <EnergyLine active={step.done || step.active} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {onReset && (
                <button
                    onClick={onReset}
                    className="ml-6 text-sm font-medium text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400"
                >
                    重新开始
                </button>
            )}
        </div>
    );
}

/* ================= 能量线组件（纯 UI） ================= */
function EnergyLine({ active }) {
    return (
        <div className="relative w-16 h-[2px] overflow-hidden rounded-full">
            <div
                className={`
          absolute inset-0
          bg-gradient-to-r
          from-cyan-400 via-blue-500 to-indigo-500
          bg-[length:200%_100%]
          transition-opacity
          ${active ? "animate-flow opacity-100" : "opacity-20"}
        `}
            />
        </div>
    );
}
