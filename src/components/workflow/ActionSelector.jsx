const WORKFLOW = {
    IDLE: "idle",
    FILE_READY: "fileReady",

    ANALYZING: "analyzing",
    ANALYSIS_DONE: "analysisDone",

    CONFIGURING: "configuring", // ⭐ 新增：测试用例生成配置页

    GENERATING: "generating",
    GENERATED: "generated",
};

export default function ActionSelector({
                                           file,
                                           workflowState,

                                           // ✅ 语义清晰、只做一件事
                                           onAnalyze,        // 开始需求分析
                                           onSkipAnalysis,   // 跳过分析 → 进入生成配置页
                                       }) {
    // ⚠️ 只允许在 FILE_READY 阶段操作
    const canAnalyze = workflowState === WORKFLOW.FILE_READY;
    const canSkipAnalysis = workflowState === WORKFLOW.FILE_READY;

    if (!canAnalyze && !canSkipAnalysis) return null;

    return (
        <div className="space-y-6">
            {/* ================= 当前文件 ================= */}
            <div className="rounded-xl px-4 py-3 text-sm bg-slate-50 border border-slate-200 text-slate-600">
                📄 当前需求文档：
                <span className="ml-1 font-medium">{file?.name}</span>
            </div>

            {/* ================= 推荐流程：需求分析 ================= */}
            <div
                className="
            rounded-3xl
            p-8
            bg-gradient-to-br from-cyan-50 to-indigo-50
            border border-cyan-200
          "
            >
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-slate-900">
                        推荐：先进行需求分析
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                        AI智能体将先理解需求结构，发现遗漏与风险，再生成更完整的测试用例
                    </p>
                </div>

                <ul className="text-sm text-slate-600 space-y-1 mb-6">
                    <li>• 自动识别功能模块与边界</li>
                    <li>• 发现歧义点与遗漏场景</li>
                    <li>• 生成更全面、可维护的用例</li>
                </ul>

                <button
                    onClick={onAnalyze}
                    disabled={!canAnalyze}
                    className={`
              w-full h-12 rounded-xl font-semibold transition
              ${
                        canAnalyze
                            ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-[#020617] shadow-[0_0_40px_-10px_rgba(56,189,248,0.7)] hover:brightness-110"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }
            `}
                >
                    开始需求分析
                </button>
            </div>

            {/* ================= 次要路径：进入配置（不生成） ================= */}
            {canSkipAnalysis && (
                <div
                    className="
              rounded-2xl
              p-6
              border border-slate-200
              bg-white
            "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                                跳过分析，进入测试用例生成配置
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                适合需求明确，希望手动确认测试生成配置的场景
                            </p>
                        </div>

                        <button
                            onClick={onSkipAnalysis}
                            className="
                  h-10 px-5
                  rounded-lg
                  border border-slate-300
                  text-sm font-medium
                  text-slate-600
                  hover:bg-slate-100
                  transition
                "
                        >
                            测试用例生成配置
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
  