import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function AgentCaseLoading({ progress }) {
  const { t } = useTranslation();

  // ✅ 直接从 i18n 读取，语言变化会自动触发重新渲染
  const STEPS = (() => {
    const steps = t("loading.steps", { returnObjects: true });
    return Array.isArray(steps) ? steps : [];
  })();

  const [stepIndex, setStepIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // ✅ 当 steps 变化（语言切换）时，自动重建 interval
  useEffect(() => {
    if (!STEPS.length) return;

    setStepIndex(0); // 🔥 语言切换时，从第一个步骤重新开始

    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setStepIndex((i) => (i + 1) % STEPS.length);
        setFade(true);
      }, 250);
    }, 1600);

    return () => clearInterval(timer);
  }, [STEPS]);

  return (
    <div className="flex flex-col items-center justify-center h-full select-none">
      {/* ================= 核心视觉 ================= */}
      <div className="relative w-28 h-28 mb-6">
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin [animation-duration:12s]" />
        <div className="absolute inset-3 rounded-full border border-indigo-400/30 animate-spin [animation-duration:8s]" />
        <div
          className="
            absolute inset-7
            rounded-full
            bg-gradient-to-br from-cyan-400 to-indigo-500
            shadow-[0_0_50px_0_rgba(56,189,248,0.85)]
            animate-pulse
          "
        />
      </div>

      {/* ================= 主标题 ================= */}
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {t("loading.title")}
      </div>

      {/* ================= 推理步骤 ================= */}
      {STEPS.length > 0 && (
        <div
          className={`
            mt-2 text-xs text-slate-500 dark:text-slate-400
            transition-all duration-300
            ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
          `}
        >
          {STEPS[stepIndex]}
        </div>
      )}

      {/* ================= 进度提示 ================= */}
      <div className="mt-3 text-xs text-cyan-500">
        {progress?.current > 0
          ? t("loading.progress", { current: progress.current })
          : t("loading.thinking")}
      </div>
    </div>
  );
}
