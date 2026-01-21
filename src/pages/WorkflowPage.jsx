import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import WorkflowErrorModal from "../components/workflow/WorkflowErrorModal";
import WorkflowWelcomePanel from "../components/workflow/WorkflowWelcomePanel";
import ActionSelector from "../components/workflow/ActionSelector";
import RequirementAnalysisPanel from "../components/workflow/RequirementAnalysisPanel";
import AIWorkbenchPanel from "../components/workflow/AIWorkbenchPanel";
import WorkflowProgressBar from "../components/workflow/WorkflowProgressBar";
import AgentCaseLoading from "../components/commno/AgentCaseLoading";

import useTestcasePipeline from "../hooks/useTestcasePipeline";
import useRequirementAnalysis from "../hooks/useRequirementAnalysis";

import { uploadPdfToWorkflow, resetWorkflow } from "../api/testcaseApi";

/**
 * 后端 stage：
 * idle | fileReady | analyzing | analysisDone | generating | generated | error
 */
export default function WorkflowPage({ subtleText }) {
    const navigate = useNavigate();

    const [workflowId, setWorkflowId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [extraRequirement, setExtraRequirement] = useState("");

    // UI 模式：select | analysis | workbench
    const [uiMode, setUiMode] = useState("select");

    const [fileName, setFileName] = useState(
        sessionStorage.getItem("workflow_file_name") || ""
    );

    const [errorModal, setErrorModal] = useState({
        open: false,
        title: "",
        message: "",
    });

    /* ================= 页面进入 ================= */
    useEffect(() => {
        const id = sessionStorage.getItem("workflow_id");
        if (!id) {
            navigate("/");
            return;
        }
        setWorkflowId(id);
    }, [navigate]);

    const pipeline = useTestcasePipeline({ workflowId });
    const analysis = useRequirementAnalysis({ workflowId });

    // 后端 stage（仅用于展示）
    const stage = useMemo(() => {
        return pipeline.workflowProgress?.stage || "idle";
    }, [pipeline.workflowProgress]);

    /* ================= 上传 PDF ================= */
    const handleFileSelected = async (pdfFile) => {
        if (!pdfFile || !workflowId || uploading) return;

        setUploading(true);
        try {
            await uploadPdfToWorkflow(workflowId, pdfFile);
            setFileName(pdfFile.name || "");
            sessionStorage.setItem("workflow_file_name", pdfFile.name || "");
            setUiMode("select");
        } catch {
            setErrorModal({
                open: true,
                title: "上传需求文档失败",
                message: "PDF 文件上传失败，请稍后重试。",
            });
        } finally {
            setUploading(false);
        }
    };

    /* ================= 需求分析 ================= */
    const handleAnalyze = async () => {
        try {
            setUiMode("analysis");
            await analysis.start();
        } catch {
            setErrorModal({
                open: true,
                title: "需求分析失败",
                message: "AI智能体需求分析失败，请稍后重试。",
            });
        }
    };

    /* ================= 生成用例（✅ 修复点） ================= */
    const handleGenerate = (analysisResult) => {
        let finalRequirement = extraRequirement;

        // ✅ 只取 requirements
        if (analysisResult?.requirements && Array.isArray(analysisResult.requirements)) {
            finalRequirement = analysisResult.requirements.join("\n");
            setExtraRequirement(finalRequirement);
        }

        setUiMode("workbench");
        pipeline.start({ requirement: finalRequirement });
    };

    /* ================= 跳过分析 ================= */
    const handleSkipToConfig = () => {
        setUiMode("workbench");
    };

    /* ================= Reset ================= */
    const handleReset = async () => {
        try {
            await resetWorkflow(workflowId);
        } catch {}

        analysis.reset?.();
        pipeline.resetPipeline?.();

        sessionStorage.removeItem("workflow_id");
        sessionStorage.removeItem("workflow_file_name");

        setExtraRequirement("");
        setUiMode("select");
        navigate("/");
    };

    /* ================= 主渲染 ================= */
    const renderMain = () => {
        if (stage === "idle") {
            return (
                <WorkflowWelcomePanel
                    onUpload={handleFileSelected}
                    uploading={uploading}
                />
            );
        }

        if (uiMode === "analysis") {
            return (
                <RequirementAnalysisPanel
                    status={analysis.status}
                    result={analysis.result}
                    onGenerate={handleGenerate}
                    onSkip={handleSkipToConfig}
                />
            );
        }

        if (uiMode === "select" && stage === "fileReady") {
            return (
                <ActionSelector
                    file={fileName ? { name: fileName } : null}
                    workflowState="fileReady"
                    onAnalyze={handleAnalyze}
                    onSkipAnalysis={handleSkipToConfig}
                />
            );
        }

        if (uiMode === "workbench") {
            return (
                <AIWorkbenchPanel
                    pipeline={pipeline}
                    subtleText={subtleText}
                    requirement={extraRequirement}
                    onRequirementChange={setExtraRequirement}
                    onGenerate={handleGenerate}
                />
            );
        }

        return null;
    };

    return (
        <div className="relative min-h-[calc(100vh-120px)]">
            {uploading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/60">
                    <AgentCaseLoading title="正在上传需求文档" />
                </div>
            )}

            {workflowId && (
                <div className="max-w-7xl mx-auto px-6 pt-8 space-y-6">
                    <WorkflowProgressBar
                        stage={stage}
                        onReset={handleReset}
                        progress={pipeline.workflowProgress}
                    />
                    {renderMain()}
                </div>
            )}

            {!workflowId && (
                <div className="max-w-7xl mx-auto px-6 pt-8">
                    <WorkflowWelcomePanel
                        onUpload={handleFileSelected}
                        uploading={uploading}
                    />
                </div>
            )}

            <WorkflowErrorModal
                open={errorModal.open}
                title={errorModal.title}
                message={errorModal.message}
                onClose={() =>
                    setErrorModal({ open: false, title: "", message: "" })
                }
                onRetry={() => window.location.reload()}
            />
        </div>
    );
}
