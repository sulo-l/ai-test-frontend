import { useRef, useState } from "react";

export default function WorkflowUploadPanel({ onUpload, uploading = false }) {
    const inputRef = useRef(null);
    const [file, setFile] = useState(null);

    const handleFile = (f) => {
        if (!f || uploading) return;

        if (!f.name.toLowerCase().endsWith(".pdf")) {
            alert("仅支持 PDF 文件");
            return;
        }

        setFile(f);
        onUpload?.(f);
    };

    return (
        <div className="relative">
            {/* ===== 顶部引导文案 ===== */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    上传需求文档，自动分析需求 / 测试用例
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    AI智能体将分析需求完整性、风险点，并生成可直接使用的测试用例
                </p>
            </div>

            {/* ===== 主卡片 ===== */}
            <div
                className={`
                  relative
                  rounded-[32px]
                  p-8
                  bg-white
                  border border-slate-200
                  shadow-[0_40px_120px_-30px_rgba(0,0,0,0.25)]
                  transition-all duration-300
                  dark:bg-[#020617]/80
                  dark:border-cyan-400/20
                  ${uploading ? "opacity-60 pointer-events-none" : ""}
                `}
            >
                {/* ===== Upload Area ===== */}
                <div
                    className={`
                      flex flex-col items-center justify-center
                      h-56
                      rounded-2xl
                      border-2 border-dashed
                      transition-all duration-300
                      ${
                          uploading
                              ? "border-slate-300 bg-slate-100 cursor-not-allowed"
                              : "border-slate-300 bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-cyan-400 hover:scale-[1.01]"
                      }
                      dark:bg-[#020617]/60
                      dark:border-cyan-400/30
                    `}
                    onClick={() => {
                        if (!uploading) inputRef.current?.click();
                    }}
                    onDragOver={(e) => {
                        if (!uploading) e.preventDefault();
                    }}
                    onDrop={(e) => {
                        if (uploading) return;
                        e.preventDefault();
                        handleFile(e.dataTransfer.files?.[0]);
                    }}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => handleFile(e.target.files?.[0])}
                    />

                    {/* ===== 内容区 ===== */}
                    {!file ? (
                        <>
                            <div className="mb-4 text-4xl">
                                {uploading ? "⏳" : "📄"}
                            </div>

                            <div className="text-base font-semibold text-slate-800 dark:text-slate-100">
                                {uploading
                                    ? "正在上传需求文档…"
                                    : "点击或拖拽上传 PDF"}
                            </div>

                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {uploading
                                    ? "请稍候，正在处理文件"
                                    : "仅支持 PDF 文件 · 单个文件"}
                            </div>

                            {!uploading && (
                                <div className="mt-4 text-xs text-cyan-600 dark:text-cyan-400">
                                    开始AI智能体需求分析 →
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="mb-3 text-3xl">
                                {uploading ? "⏳" : "✅"}
                            </div>

                            <div className="text-sm font-semibold text-emerald-600">
                                {uploading
                                    ? "正在上传中"
                                    : "已选择需求文档"}
                            </div>

                            <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                                📄 {file.name}
                            </div>

                            {!uploading && (
                                <div className="mt-3 text-xs text-slate-400">
                                    点击可重新选择
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ===== 底部提示 ===== */}
            <div className="mt-6 text-center text-xs text-slate-400">
                支持标准 PRD / 产品需求文档 / 设计说明类 PDF
            </div>
        </div>
    );
}
