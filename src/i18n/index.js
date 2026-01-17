import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import zhCN from "./zh-CN.json";
import enUS from "./en-US.json";

/**
 * ===============================
 * i18n 初始化（最终稳定版）
 * ===============================
 */

// 🔍 调试：确认文件被加载
console.log("[i18n] index.js loaded");

// ✅ 语言白名单 + 归一化
function getInitialLang() {
  const lang = localStorage.getItem("lang");
  if (lang === "en-US") return "en-US";
  return "zh-CN";
}

i18n
  .use(initReactI18next)
  .init({
    /**
     * -------------------------------
     * 语言资源
     * -------------------------------
     */
    resources: {
      "zh-CN": {
        translation: zhCN,
      },
      "en-US": {
        translation: enUS,
      },
    },

    /**
     * -------------------------------
     * 当前语言 & 兜底
     * -------------------------------
     */
    lng: getInitialLang(),
    fallbackLng: "zh-CN",

    /**
     * -------------------------------
     * 🔥 关键修复（没有这两行就一定翻译失败）
     * -------------------------------
     */
    ns: ["translation"],
    defaultNS: "translation",

    /**
     * -------------------------------
     * 插值配置
     * -------------------------------
     */
    interpolation: {
      escapeValue: false, // React 已经做了 XSS 防护
    },

    /**
     * -------------------------------
     * React 行为
     * -------------------------------
     */
    react: {
      useSuspense: false,
    },

    /**
     * -------------------------------
     * 调试期开启（可选）
     * -------------------------------
     */
    // debug: true,
  });

/**
 * ===============================
 * 🔍 启动调试日志（强烈建议保留）
 * ===============================
 */
console.log("[i18n] language =", i18n.language);
console.log(
  "[i18n] has zh-CN translation =",
  !!i18n.getResourceBundle("zh-CN", "translation")
);
console.log(
  "[i18n] has en-US translation =",
  !!i18n.getResourceBundle("en-US", "translation")
);

export default i18n;
