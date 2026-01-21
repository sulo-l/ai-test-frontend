import InputPanel from "../legacy/InputPanel";
import OutputPanel from "../legacy/OutputPanel";

/**
 * ✅ AIWorkbenchPanel（最终稳定版 · 无 triggerByUser）
 *
 * 原则：
 * - 生成测试用例 = 用户点击按钮
 * - 不存在任何“隐式触发”
 * - pipeline.start 是唯一入口
 */
export default function AIWorkbenchPanel({
                                             pipeline,
                                             subtleText,

                                             // ✅ 来自 WorkflowPage（唯一可信源）
                                             requirement,
                                             onRequirementChange,

                                             appendRequirementRef,
                                         }) {
    return (
        <div className="space-y-8">
            {/* ===== 标题区 ===== */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    AI智能体测试用例工作台
                </h2>
                <p className={`text-sm ${subtleText}`}>
                    在生成前确认并调整补充测试要求
                </p>
            </div>

            {/* ===== 主工作台 ===== */}
            <div
                className="
                    grid grid-cols-1 lg:grid-cols-12
                    rounded-[28px]
                    bg-white
                    border border-slate-200
                    shadow-[0_40px_100px_-40px_rgba(0,0,0,0.28)]
                    dark:bg-[#020617]
                    dark:border-white/10
                    px-10 py-10
                    lg:px-14 lg:py-12
                "
            >
                {/* ===== 左侧：测试生成配置 ===== */}
                <div className="lg:col-span-5 pr-0 lg:pr-10">
                    <InputPanel
                        status={pipeline.status}
                        subtleText={subtleText}

                        /* 受控 requirement */
                        requirement={requirement}
                        onRequirementChange={onRequirementChange}

                        /* ✅ 唯一生成入口 */
                        onGenerate={() => {
                            pipeline.start({ requirement });
                        }}

                        /* 重置 */
                        onReset={() => {
                            onRequirementChange("");
                            pipeline.resetPipeline();
                        }}

                        appendRequirementRef={appendRequirementRef}
                    />
                </div>

                {/* ===== 右侧：测试用例输出 ===== */}
                <div className="lg:col-span-7 pl-0 lg:pl-10 mt-10 lg:mt-0">
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
        </div>
    );
}
