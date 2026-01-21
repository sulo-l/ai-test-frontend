import { useTranslation } from "react-i18next";

export default function Header({
                                   theme,
                                   setTheme,
                                   subtleText,
                                   onOpenRecords,
                               }) {
    const { t } = useTranslation();

    return (
        <div
            className={`
        sticky top-0 z-30
        backdrop-blur-xl
        border-b
        ${
                theme === "dark"
                    ? "bg-[#0b1220]/80 border-white/10"
                    : "bg-white/80 border-black/10"
            }
      `}
        >
            {/* ===== 背景能量层（桌面端保留） ===== */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none hidden md:block">
                <div className="absolute -top-20 left-1/4 w-[360px] h-[360px] bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -top-24 right-1/4 w-[320px] h-[320px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* ================= 📱 手机端 Header ================= */}
            <div className="md:hidden relative px-3 pt-3 pb-4">
                {/* 右上角操作区 */}
                <div className="absolute right-3 top-3 flex items-center gap-2">
                    {/* 🌙 深浅色切换 */}
                    <button
                        onClick={() =>
                            setTheme((t) => (t === "dark" ? "light" : "dark"))
                        }
                        className={`
              h-8 w-8 rounded-full flex items-center justify-center
              ${
                            theme === "dark"
                                ? "bg-white/10 text-white"
                                : "bg-black/5 text-slate-800"
                        }
            `}
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>
                </div>

                {/* 居中 Logo + 标题 */}
                <div className="flex flex-col items-center justify-center gap-2">
                    <div
                        className={`
              h-10 w-10 rounded-full flex items-center justify-center
              shadow
              ${
                            theme === "dark"
                                ? "bg-white/10 border border-white/20"
                                : "bg-white border border-black/10"
                        }
            `}
                    >
                        <img
                            src="/logo.png"
                            alt="logo"
                            className="h-6 w-6 rounded-full"
                        />
                    </div>

                    <h1 className="text-base font-semibold tracking-tight">
                        {t("app.title")}
                    </h1>
                </div>
            </div>

            {/* ================= 🖥 桌面端 Header ================= */}
            <div
                className="
          hidden md:grid
          max-w-6xl mx-auto
          px-4 sm:px-6
          pt-4 pb-4
          grid-cols-3
          gap-4
          items-center
        "
            >
                {/* 左占位 */}
                <div />

                {/* Logo + 标题 */}
                <div className="flex justify-center">
                    <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 blur-xl opacity-70" />
                            <div
                                className={`
                  relative h-14 w-14
                  rounded-full flex items-center justify-center shadow-xl
                  ${
                                    theme === "dark"
                                        ? "bg-white/10 border border-white/20"
                                        : "bg-white border border-black/10"
                                }
                `}
                            >
                                <img
                                    src="/logo.png"
                                    alt="logo"
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col leading-tight text-left">
              <span
                  className={`text-[11px] tracking-widest uppercase ${subtleText}`}
              >
                AI TEST AGENT
              </span>
                            <h1 className="text-3xl font-extrabold tracking-tight whitespace-nowrap">
                                {t("app.title")}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* 右侧操作区 */}
                <div className="flex justify-end">
                    <div className="flex items-center gap-3">
                        {onOpenRecords && (
                            <button
                                onClick={onOpenRecords}
                                className={`
                  h-9 px-4 rounded-full text-xs font-medium transition
                  ${
                                    theme === "dark"
                                        ? "bg-white/10 text-white hover:bg-white/20"
                                        : "bg-black/5 text-slate-800 hover:bg-black/10"
                                }
                `}
                            >
                                {t("header.records")}
                            </button>
                        )}

                        {/* 🌙 深浅色切换 */}
                        <button
                            onClick={() =>
                                setTheme((t) =>
                                    t === "dark" ? "light" : "dark"
                                )
                            }
                            className={`
                h-9 px-4 rounded-full text-xs font-medium
                flex items-center gap-2 transition shadow
                ${
                                theme === "dark"
                                    ? "bg-white/10 text-white hover:bg-white/20"
                                    : "bg-black/5 text-slate-800 hover:bg-black/10"
                            }
              `}
                        >
              <span className="text-sm">
                {theme === "dark" ? "☀️" : "🌙"}
              </span>
                            {theme === "dark"
                                ? t("header.lightMode")
                                : t("header.darkMode")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
