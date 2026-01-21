import InputPanel from "../components/legacy/InputPanel";
import OutputPanel from "../components/legacy/OutputPanel";
import AIThinkingPanel from "../components/workflow/AIThinkingPanel";

/**
 * ✅ AIWorkbenchPanel（最终职责版）
 * - 不触发生成
 * - 不调用 pipeline.start
 * - 只做「状态展示 + 事件转发」
 */
export default function AIWorkbenchPanel({
                                             pipeline,
                                             subtleText,

                                             requirement,
                                             onRequirementChange,
                                             onGenerate, // ⭐ 由 WorkflowPage 控制生成
                                             appendRequirementRef,
                                         }) {
    const { status } = pipeline;

    const isRunning = status === "running";
    const isDone = status === "done";

    return (
        <div className="relative">
            {/* ===== 顶部标题区 ===== */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">AI 测试用例工作台</h2>

                    {isRunning && (
                        <p className={`text-sm ${subtleText}`}>
                            AI 正在进行需求推理与测试用例构建…
                        </p>
                    )}

                    {isDone && (
                        <p className={`text-sm ${subtleText}`}>
                            测试用例已生成完成，可查看与下载
                        </p>
                    )}
                </div>
            </div>

            {/* ===== 生成中：AI 思考态 ===== */}
            {isRunning && <AIThinkingPanel />}

            {/* ===== 工作台主体 ===== */}
            {!isRunning && (
                <div
                    className="
            grid grid-cols-1 lg:grid-cols-12 gap-6
            rounded-3xl
            bg-white/70 backdrop-blur
            border border-slate-200
            shadow-[0_40px_120px_-40px_rgba(0,0,0,0.35)]
            dark:bg-[#020617]/70
            dark:border-cyan-400/20
            p-6
          "
                >
                    {/* ===== 左侧：生成配置 ===== */}
                    <div
                        className={`
              lg:col-span-5
              ${isDone ? "opacity-70 pointer-events-none" : ""}
            `}
                    >
                        <InputPanel
                            status={pipeline.status}
                            subtleText={subtleText}
                            requirement={requirement}
                            onRequirementChange={onRequirementChange}
                            /* ✅ 只抛事件，不生成 */
                            onGenerate={onGenerate}
                            onReset={pipeline.resetPipeline}
                            appendRequirementRef={appendRequirementRef}
                        />
                    </div>

                    {/* ===== 右侧：测试用例输出 ===== */}
                    <div className="lg:col-span-7">
                        <OutputPanel
                            subtleText={subtleText}
                            status={pipeline.status}
                            testPoints={pipeline.cases}
                            hasAnyOutput={pipeline.hasAnyOutput}
                            progress={pipeline.progress}
                            downloadUrl={pipeline.downloadUrl}
                            caseCount={pipeline.caseCount}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
