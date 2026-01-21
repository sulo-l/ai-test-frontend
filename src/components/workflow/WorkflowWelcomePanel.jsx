import { useRef } from "react";

export default function WorkflowWelcomePanel({ onUpload, uploading = false }) {
    const inputRef = useRef(null);

    const handleSelect = (file) => {
        if (!file || uploading) return;
        onUpload?.(file);
    };

    return (
        <div
            className="
        rounded-3xl
        p-10
        bg-white
        border border-slate-200
        shadow-[0_40px_120px_-40px_rgba(56,189,248,0.35)]
        dark:bg-[#020617]/80
        dark:border-cyan-400/20
        transition-opacity
        "
            style={{
                opacity: uploading ? 0.6 : 1,
                pointerEvents: uploading ? "none" : "auto",
            }}
        >
            {/* ===== 欢迎标题 ===== */}
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                欢迎进入 AI智能体测试工作台
            </h2>

            {/* ===== 引导文案 ===== */}
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                上传需求文档后，AI智能体将自动构建需求认知模型，
                识别需求中的缺陷、歧义与测试风险，
                并生成专业、可直接执行的测试用例。
            </p>

            {/* ===== 能力提示 ===== */}
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5">
                    需求认知建模
                </span>
                <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5">
                    缺陷 / 风险发现
                </span>
                <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5">
                    测试用例生成
                </span>
            </div>

            {/* ===== 上传区 ===== */}
            <div
                onClick={() => {
                    if (!uploading) inputRef.current?.click();
                }}
                onDragOver={(e) => {
                    if (!uploading) e.preventDefault();
                }}
                onDrop={(e) => {
                    if (uploading) return;
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    handleSelect(file);
                }}
                className={`
          mt-10
          rounded-2xl
          border-2 border-dashed border-cyan-400/40
          px-8 py-10
          text-center
          transition
          ${
              uploading
                  ? "bg-slate-100 cursor-not-allowed"
                  : "cursor-pointer bg-cyan-50/40 hover:bg-cyan-50/70 dark:bg-cyan-500/5 dark:hover:bg-cyan-500/10"
          }
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    disabled={uploading}
                    className="hidden"
                    onChange={(e) =>
                        handleSelect(e.target.files?.[0])
                    }
                />

                <div className="text-base font-medium text-slate-800 dark:text-slate-100">
                    {uploading
                        ? "正在上传需求文档…"
                        : "上传需求文档（PDF）"}
                </div>

                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {uploading
                        ? "请稍候，AI 正在处理文件"
                        : "支持点击或拖拽上传"}
                </div>
            </div>

            {/* ===== 底部提示 ===== */}
            <div className="mt-6 text-xs text-slate-400">
                上传后可选择「需求分析」或「直接生成测试用例」
            </div>
        </div>
    );
}
