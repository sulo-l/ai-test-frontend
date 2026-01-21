import { useEffect, useState } from "react";

const STEPS = [
    "解析需求结构",
    "识别核心功能模块",
    "分析边界与异常场景",
    "评估测试风险",
    "生成测试关注点",
];

export default function AIThinkingPanel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % STEPS.length);
        }, 1600);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center py-16 select-none">
            {/* 能量环 */}
            <div className="relative w-36 h-36 mb-8">
                <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-spin-slow" />
                <div className="absolute inset-4 rounded-full border border-indigo-400/40 animate-spin-reverse" />
                <div className="absolute inset-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 opacity-90 shadow-[0_0_40px_rgba(56,189,248,0.6)]" />

                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white tracking-wide">
                    AI
                </div>
            </div>

            {/* 思考文案 */}
            <div className="text-sm text-slate-600 dark:text-slate-300">
                <span className="mr-2 text-cyan-500">●</span>
                {STEPS[index]}
            </div>

            {/* 扫描线 */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-pulse" />
        </div>
    );
}
