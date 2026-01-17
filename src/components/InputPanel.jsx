import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function InputPanel({
  start,
  status,
  subtleText,
  requirement,
  setRequirement,

  // ⭐ 从 pipeline 传入
  resetPipeline,
}) {
  const { t } = useTranslation(); // ✅ 必须使用
  const [file, setFile] = useState(null);

  // ===============================
  // 重置处理
  // ===============================
  const handleReset = () => {
    setFile(null);       // 清空本地 PDF
    resetPipeline?.();  // 清空 pipeline
  };

  return (
    <div
      className="
        h-[560px]
        rounded-3xl
        p-6
        flex flex-col
        backdrop-blur-2xl
        border
        shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)]

        bg-white
        border-black/5

        dark:bg-[#020617]/80
        dark:border-cyan-400/20
      "
    >
      {/* ================= Header ================= */}
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t("input.title", "测试生成配置")}
        </h2>
        <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
          {t(
            "input.subtitle",
            "上传需求文档，AI 智能体自动拆解并生成测试用例"
          )}
        </p>
      </div>

      {/* ================= 内容区 ================= */}
      <div className="flex-1 flex flex-col space-y-5">
        {/* ===== 补充需求 ===== */}
        <div>
          <label className="text-xs mb-2 block text-slate-500 dark:text-slate-400">
            {t("input.requirement.label", "补充测试要求（可选）")}
          </label>

          <textarea
            className="
              w-full rounded-xl p-4 text-sm resize-none transition

              bg-white
              border border-slate-200
              text-slate-800
              placeholder:text-slate-400

              dark:bg-[#020617]/60
              dark:border-cyan-400/20
              dark:text-slate-100
              dark:placeholder:text-slate-500

              focus:outline-none
              focus:ring-2 focus:ring-cyan-400/40
            "
            rows={5}
            placeholder={t(
              "input.requirement.placeholder",
              "例如：重点关注异常场景、边界值、配置记忆功能"
            )}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
          />
        </div>

        {/* ===== 需求文档（PDF） ===== */}
        <div>
          <label className="text-xs mb-2 block text-slate-500 dark:text-slate-400">
            {t("input.pdf.label", "需求文档（PDF）")}
          </label>

          <label
            className="
              flex flex-col items-center justify-center
              h-36
              rounded-xl
              border-2 border-dashed
              border-slate-300
              bg-slate-50
              cursor-pointer
              transition

              hover:border-cyan-400
              hover:bg-cyan-50

              dark:border-cyan-400/30
              dark:bg-[#020617]/40
              dark:hover:bg-[#020617]/60
            "
          >
            <input
              key={file ? file.name : "empty"}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {file ? file.name : t("input.pdf.upload", "点击或拖拽上传 PDF")}
            </div>

            <div className="text-xs mt-1 text-slate-500 dark:text-slate-400">
              {t("input.pdf.tip", "仅支持 PDF 文件")}
            </div>
          </label>
        </div>
      </div>

      {/* ================= 底部按钮 ================= */}
      <div className="pt-6 flex gap-3 flex-shrink-0">
        {/* ===== 生成按钮 ===== */}
        <button
          disabled={!file || status === "running"}
          onClick={() => start(file)}
          className="
            flex-1 h-12 rounded-xl
            font-semibold
            transition-all

            bg-gradient-to-r from-cyan-400 to-indigo-500
            text-[#020617]
            shadow-[0_0_40px_-10px_rgba(56,189,248,0.7)]
            hover:brightness-110

            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          {status === "running"
            ? t("input.actions.generating", "生成中…")
            : t("input.actions.generate", "生成测试用例")}
        </button>

        {/* ===== 重置按钮 ===== */}
        <button
          disabled={status === "running"}
          onClick={handleReset}
          className="
            h-12 px-6 rounded-xl
            border border-slate-300
            text-slate-500
            transition

            hover:bg-slate-100
            active:scale-95

            disabled:opacity-40
            disabled:cursor-not-allowed

            dark:border-cyan-400/30
            dark:text-slate-300
            dark:hover:bg-[#020617]/60
          "
        >
          {t("input.actions.reset", "重置")}
        </button>
      </div>
    </div>
  );
}
