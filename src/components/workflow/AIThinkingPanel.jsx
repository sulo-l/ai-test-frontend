import { useEffect, useState } from "react";

/**
 * ✅ 静态步骤定义（组件外）
 * - 不依赖 props / state
 * - 不会在 render 时重新创建
 * - 完全符合 react-hooks 规范
 */
const STEPS = [
    "解析需求结构",
    "构建业务领域模型",
    "推导核心业务逻辑",
    "识别歧义与风险点",
    "扩展边界与异常场景",
    "形成测试认知模型",
];

export default function AIThinkingPanel() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((i) => (i + 1) % STEPS.length);
        }, 1600);

        return () => clearInterval(timer);
    }, []); // ✅ 这里现在是“真正安全的空依赖”

    return (
        <div className="relative rounded-[32px] overflow-hidden border border-cyan-400/20 bg-[#0b1220] shadow-[0_60px_180px_-60px_rgba(56,189,248,0.55)]">
            {/* ===== 背景能量 ===== */}
            <div className="absolute inset-0">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-400/10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px]" />
            </div>

            <div className="relative z-10 px-10 py-12">
                {/* ===== 标题区 ===== */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-white tracking-wide">
                        AI智能体需求分析中
                    </h2>
                    <p className="text-sm mt-2 text-slate-400">
                        AI智能体正在理解需求结构，识别潜在风险并生成测试关注点
                    </p>
                </div>

                {/* ===== 核心区域 ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                    {/* AI Core */}
                    <div className="flex justify-center">
                        <div className="relative w-44 h-44">
                            <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin-slow" />
                            <div className="absolute inset-6 rounded-full border border-indigo-400/20 animate-spin-reverse" />
                            <div className="absolute inset-12 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_80px_rgba(56,189,248,0.8)]" />
                        </div>
                    </div>

                    {/* 思考步骤流 */}
                    <div className="space-y-3 text-sm text-slate-300">
                        {STEPS.map((text, i) => (
                            <div
                                key={i}
                                className={`transition ${
                                    i === step
                                        ? "text-cyan-400"
                                        : "text-slate-500"
                                }`}
                            >
                                {i === step ? "▸ " : "  "}
                                {text}
                            </div>
                        ))}
                    </div>

                    {/* 认知信号 */}
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-xs text-slate-300">
                        <div className="mb-2 text-cyan-400 font-medium">
                            认知信号
                        </div>
                        <ul className="space-y-2">
                            <li>• 发现潜在遗漏场景</li>
                            <li>• 映射业务规则与约束</li>
                            <li>• 评估测试可覆盖性</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 text-xs text-slate-500">
                    AI智能体正在构建面向测试的系统认知模型
                </div>
            </div>
        </div>
    );
}
