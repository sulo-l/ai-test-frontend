import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorkflow } from "../api/testcaseApi";

import WorkflowErrorModal from "../components/workflow/WorkflowErrorModal";
import RoadmapPreview from "../components/Home/RoadmapPreview";

export default function HomeHero() {
    const navigate = useNavigate();

    const [errorModal, setErrorModal] = useState({
        open: false,
        title: "",
        message: "",
    });

    /* ===============================
     * 创建 workflow
     * =============================== */
    const handleEnter = async () => {
        console.log("🔥 CTA clicked");

        try {
            const res = await createWorkflow();
            const workflowId = res?.workflow_id;

            console.log("✅ workflow created:", workflowId);

            if (!workflowId) {
                setErrorModal({
                    open: true,
                    title: "创建工作流失败",
                    message: "未获取到 workflow_id，请稍后重试。",
                });
                return;
            }

            sessionStorage.setItem("workflow_id", workflowId);
            navigate("/workflow");
        } catch (err) {
            console.error("❌ create workflow error", err);

            setErrorModal({
                open: true,
                title: "创建工作流失败",
                message:
                    "初始化 AI 智能体测试工作流失败，可能是网络异常或服务暂不可用。",
            });
        }
    };

    return (
        <>
            {/* ===============================
             * Hero 主区
             * =============================== */}
            <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
                {/* 背景光晕 */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-cyan-400/10 blur-[160px]" />
                    <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-indigo-500/10 blur-[140px]" />
                </div>

                <div className="relative z-10 max-w-4xl w-full px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white">
                        AI智能分析需求缺陷，
                        <span className="block mt-2 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                            生成专业测试用例
                        </span>
                    </h1>

                    <p className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-300">
                        自动识别需求中的歧义、遗漏与风险点，
                        <br />
                        将需求文档转化为可直接执行的测试用例
                    </p>

                    <div className="mt-16 flex justify-center">
                        <button
                            onClick={handleEnter}
                            className="px-10 py-4 rounded-2xl font-semibold
                                bg-gradient-to-r from-cyan-400 to-indigo-500
                                text-[#020617]
                                shadow-[0_30px_100px_-30px_rgba(56,189,248,0.6)]
                                hover:brightness-110 transition"
                        >
                            进入 AI 智能体需求分析与测试生成工作台
                        </button>
                    </div>
                </div>

                {/* ❗ 错误弹窗 */}
                <WorkflowErrorModal
                    open={errorModal.open}
                    title={errorModal.title}
                    message={errorModal.message}
                    onClose={() =>
                        setErrorModal({ open: false, title: "", message: "" })
                    }
                    onRetry={() => {
                        setErrorModal({
                            open: false,
                            title: "",
                            message: "",
                        });
                        handleEnter();
                    }}
                />
            </div>

            {/* ===============================
             * 版本更新计划（Roadmap）
             * =============================== */}
            <RoadmapPreview />
        </>
    );
}
