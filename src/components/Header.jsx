import { useTranslation } from "react-i18next";

export default function Header({
  theme,
  setTheme,
  subtleText,
  onOpenRecords,
}) {
  const { t, i18n } = useTranslation();

  // ✅ 始终以 resolvedLanguage 为准
  const currentLang = i18n.resolvedLanguage || i18n.language;

  const switchLang = (lang) => {
    const current = i18n.resolvedLanguage || i18n.language;
    console.log("[Header] switchLang ->", lang, "current =", current);

    if (lang === current) return;

    i18n.changeLanguage(lang).then(() => {
      console.log("[i18n] language changed to", i18n.language);
      localStorage.setItem("lang", lang);
    });
  };

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
      {/* ===== 背景能量层 ===== */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-1/4 w-[360px] h-[360px] bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-24 right-1/4 w-[320px] h-[320px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* ===== Header 主体 ===== */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-5 grid grid-cols-3 items-center">
        <div />

        {/* ===== Logo + 标题 ===== */}
        <div className="flex justify-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 blur-xl opacity-70" />
              <div
                className={`
                  relative h-14 w-14 rounded-full
                  flex items-center justify-center shadow-xl
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

            <div className="flex flex-col leading-tight">
              <span className={`text-[11px] tracking-widest uppercase ${subtleText}`}>
                AI TEST AGENT
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight whitespace-nowrap">
                {t("app.title")}
              </h1>
            </div>
          </div>
        </div>

        {/* ===== 右侧操作区 ===== */}
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

            {/* 🌍 语言切换 */}
            <div
              className={`
                h-9 px-4 rounded-full text-xs font-medium
                flex items-center gap-1
                ${
                  theme === "dark"
                    ? "bg-white/10 text-white"
                    : "bg-black/5 text-slate-800"
                }
              `}
            >
              <button
                onClick={() => switchLang("zh-CN")}
                className={currentLang === "zh-CN" ? "underline font-semibold" : ""}
              >
                中
              </button>
              <span>/</span>
              <button
                onClick={() => switchLang("en-US")}
                className={currentLang === "en-US" ? "underline font-semibold" : ""}
              >
                EN
              </button>
            </div>

            {/* 🌙 深浅色切换 */}
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
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
