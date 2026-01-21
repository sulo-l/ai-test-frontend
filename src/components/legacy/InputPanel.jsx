import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * ✅ InputPanel（最终职责版）
 * - 只负责「配置输入」
 * - 不知道 pipeline / start / workflow
 * - 不产生任何副作用
 */
export default function InputPanel({
  status,
  subtleText,

  requirement = "",
  onRequirementChange,

  onGenerate,   // ⭐ 只抛事件
  onReset,

  appendRequirementRef,
}) {
  const { i18n } = useTranslation();

  const isRunning = status === "running";
  const canGenerate = !isRunning;

  /* ===============================
   * 重置配置
   * =============================== */
  const handleReset = () => {
    if (isRunning) return;
    onReset?.();
  };

  /* ===============================
   * 点击生成（只通知外部）
   * =============================== */
  const handleGenerate = () => {
    if (!canGenerate) return;
    onGenerate?.();
  };

  /* ===============================
   * 向外暴露「追加需求」能力
   *（需求分析 → 配置页）
   * =============================== */
  useEffect(() => {
    if (!appendRequirementRef) return;

    appendRequirementRef.current = (text) => {
      if (!text) return;

      onRequirementChange?.((prev) => {
        if (!prev) {
          return `【AI智能体需求分析建议】\n${text}`;
        }
        if (prev.includes(text)) return prev;
        return `${prev}\n\n【AI智能体需求分析建议】\n${text}`;
      });
    };

    return () => {
      appendRequirementRef.current = null;
    };
  }, [appendRequirementRef, onRequirementChange]);

  return (
    <div
      className="
        flex flex-col
        rounded-2xl
        bg-gradient-to-b from-white to-slate-50
        border border-slate-300/60
        ring-1 ring-white/60
        dark:from-[#020617]/60 dark:to-[#020617]/30
        dark:border-white/15 dark:ring-white/5
        p-6
        max-h-[520px]
        overflow-auto
      "
    >
      {/* ===== Header ===== */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold">测试生成配置</h2>
        <p className={`text-sm mt-1 ${subtleText}`}>
          编辑补充要求，确认后生成测试用例
        </p>
      </div>

      {/* ===== 补充测试要求 ===== */}
      <div className="flex-1 flex flex-col">
        <label className="text-xs mb-2">补充测试要求（可选）</label>

        <textarea
          className="
            w-full
            min-h-[180px]
            resize-y
            rounded-xl
            border border-slate-300
            px-4 py-3
            text-sm
            leading-relaxed
            focus:outline-none
            focus:ring-2 focus:ring-cyan-400
            dark:bg-[#020617]
            dark:border-white/20
            dark:text-slate-100
          "
          placeholder="例如：重点关注异常场景、边界值、配置记忆功能"
          value={requirement}
          onChange={(e) => onRequirementChange?.(e.target.value)}
        />

        <div className="mt-2 text-xs text-slate-400">
          可由需求分析自动补充，也可手动编辑调整
        </div>
      </div>

      {/* ===== 操作按钮 ===== */}
      <div className="mt-6 flex justify-center gap-4">
        {/* 生成测试用例 */}
        <button
          disabled={!canGenerate}
          onClick={handleGenerate}
          className={`
            h-11 px-10 rounded-xl font-semibold transition
            ${
              canGenerate
                ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-[#020617] shadow-[0_0_40px_-10px_rgba(56,189,248,0.7)] hover:brightness-110"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }
          `}
        >
          {isRunning ? "生成中…" : "生成测试用例"}
        </button>

        {/* 重置配置 */}
        <button
          disabled={isRunning}
          onClick={handleReset}
          className="
            h-11 px-6 rounded-xl
            border border-slate-300
            text-sm text-slate-600
            hover:bg-slate-100
            transition
            disabled:opacity-50 disabled:cursor-not-allowed
            dark:text-slate-300 dark:border-white/20
            dark:hover:bg-white/5
          "
        >
          重置配置
        </button>
      </div>
    </div>
  );
}
