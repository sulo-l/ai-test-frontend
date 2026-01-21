import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function AgentCaseLoading({
                                             title,
                                             steps,
                                             progress,
                                         }) {
    const { t } = useTranslation();

    /**
     * ===============================
     * 标题（props 优先，其次 i18n）
     * ===============================
     */
    const finalTitle = useMemo(() => {
        return title || t("loading.title");
    }, [title, t]);

    /**
     * ===============================
     * 步骤（props 优先，其次 i18n）
     * ===============================
     */
    const STEPS = useMemo(() => {
        if (Array.isArray(steps) && steps.length > 0) {
            return steps;
        }

        const i18nSteps = t("loading.steps", { returnObjects: true });
        return Array.isArray(i18nSteps) ? i18nSteps : [];
    }, [steps, t]);

    const [stepIndex, setStepIndex] = useState(0);
    const [fade, setFade] = useState(true);

    /**
     * ===============================
     * 步骤轮播（steps / 语言变化时重建）
     * ===============================
     */
    useEffect(() => {
        if (!STEPS.length) return;

        setStepIndex(0);

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
                {finalTitle}
            </div>

            {/* ================= 步骤文案 ================= */}
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

            {/* ================= 进度 / Thinking ================= */}
            <div className="mt-3 text-xs text-cyan-500">
                {progress?.current > 0
                    ? t("loading.progress", { current: progress.current })
                    : t("loading.thinking")}
            </div>
        </div>
    );
}
