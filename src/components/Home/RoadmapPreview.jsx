export default function RoadmapPreview() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* ===== 背景能量层 ===== */}
            <div className="absolute inset-0 -z-10">
                {/* 渐变底 */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/70 via-indigo-50/40 to-white dark:from-[#020617] dark:via-[#020617] dark:to-[#020617]" />

                {/* 中央能量光晕 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-cyan-400/10 blur-[180px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 text-center">
                {/* ===== 标题区 ===== */}
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
                    产品持续进化中
                </h2>

                <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    我们正在不断增强 AI 智能体对需求理解与测试生成的能力
                </p>

                {/* ===== Roadmap 卡片 ===== */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* ================= v2.0 ================= */}
                    <div
                        className="
                        group relative rounded-3xl p-8
                        bg-white/60 dark:bg-white/5
                        backdrop-blur-xl
                        border border-white/50 dark:border-white/10
                        shadow-[0_20px_80px_-20px_rgba(56,189,248,0.35)]
                        transition-all duration-300
                        hover:shadow-[0_30px_120px_-30px_rgba(56,189,248,0.55)]
                    "
                    >
                        {/* 内发光 */}
                        <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition" />

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                                        bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            v2.0 · 下一个版本
                        </div>

                        <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                            核心能力强化
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                            <li>需求 ID 全链路贯穿（分析 → 用例 → Excel）</li>
                            <li>Excel 测试用例模块自动映射</li>
                            <li>进度条与暗黑模式稳定性修复</li>
                        </ul>
                    </div>

                    {/* ================= v3.0 ================= */}
                    <div
                        className="
                        group relative rounded-3xl p-8
                        bg-white/50 dark:bg-white/5
                        backdrop-blur-xl
                        border border-white/40 dark:border-white/10
                        transition-all duration-300
                        hover:bg-white/60
                    "
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                        bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            v3.0 · 未来规划
                        </div>

                        <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                            智能化与规模化
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                            <li>优化AI智能体需求分析质量评分体系</li>
                            <li>支持更多需求文档格式（PRD / 原型 /WORD）</li>
                            <li>优化UI表现，增强流式反馈体验</li>
                            <li>后端生成链路优化，显著降低用例生成耗时</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
