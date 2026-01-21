export default function Layout({ left, right }) {
    return (
        <div
            className="
                min-h-screen
                flex
                flex-col
                bg-gradient-to-br
                from-cyan-50
                via-white
                to-indigo-50
            "
        >
            {/* ================= 主体内容区 ================= */}
            <div className="flex-1">
                <div
                    className="
                        mx-auto
                        max-w-screen-2xl
                        px-3
                        sm:px-6
                        lg:px-8
                        py-4
                    "
                >
                    {/* ================= 响应式布局 ================= */}
                    <div
                        className="
                            flex
                            flex-col
                            lg:flex-row
                            gap-4
                            lg:gap-8
                        "
                    >
                        {/* ========== 左侧：配置区 ========== */}
                        <div
                            className="
                                w-full
                                lg:w-[420px]
                                bg-white
                                border
                                border-zinc-200
                                rounded-2xl
                                p-4
                                sm:p-5
                                flex
                                flex-col
                            "
                        >
                            <div className="text-base sm:text-xl font-bold text-center mb-4 sm:mb-5">
                                AI智能体测试用例生成器
                            </div>

                            {/* 左侧内容 */}
                            {left}

                            <div className="mt-4 text-xs text-zinc-500 text-center">
                                PDF → 解析 → Gemini → Excel
                            </div>
                        </div>

                        {/* ========== 右侧：结果区 ========== */}
                        <div
                            className="
                                w-full
                                flex-1
                                bg-white
                                border
                                border-zinc-200
                                rounded-2xl
                                p-4
                                sm:p-6
                                overflow-y-auto
                            "
                        >
                            {right}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= Footer（关键修复点） ================= */}
            <footer className="py-6 text-center text-xs text-zinc-400">
                © AI 智能体测试平台 V1.5
            </footer>
        </div>
    );
}
