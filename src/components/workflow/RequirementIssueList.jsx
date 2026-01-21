import { useState, useMemo } from "react";

/* =====================================================
 * ⭐ 模块级常量（stable，不参与 render）
 * ===================================================== */
const TYPE_META = {
    incomplete: {
        label: "需求不完整",
        color: "text-red-500",
        bg: "bg-red-500/10",
        icon: "❌",
    },
    ambiguous: {
        label: "业务歧义",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        icon: "⚠️",
    },
    risk: {
        label: "测试风险",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        icon: "🚨",
    },
    other: {
        label: "其他问题",
        color: "text-slate-500",
        bg: "bg-slate-500/10",
        icon: "ℹ️",
    },
};

export default function RequirementIssueList({
                                                 issues = [],
                                                 risks = [],
                                                 className = "",
                                                 style = {},
                                             }) {
    const [openIndex, setOpenIndex] = useState("all");

    /* =====================================================
     * ⭐ 问题 / 风险规范化（不包含 suggestion）
     * ===================================================== */
    const normalized = useMemo(() => {
        const list = [];

        const toText = (v) => {
            if (v === null || v === undefined) return "";
            if (typeof v === "string") return v;
            if (typeof v === "number") return String(v);
            try {
                return JSON.stringify(v);
            } catch {
                return "";
            }
        };

        const normalizeItem = (item, defaultType) => {
            if (!item || typeof item !== "object") return null;

            const id = toText(item.id || item.issue_id || item.risk_id);

            const title = toText(
                item.title ||
                item.summary ||
                item.category ||
                item.name ||
                ""
            );

            const desc = toText(
                item.description ||
                item.desc ||
                item.content ||
                ""
            );

            if (defaultType === "risk") {
                const level = toText(item.level || item.severity || "");
                return {
                    _key: id ? `risk:${id}` : `risk:${title}:${desc}`,
                    type: "risk",
                    title: title || desc || "未命名风险",
                    desc,
                    level,
                };
            }

            const sev = toText(item.severity || item.level || "").toLowerCase();
            const inferredType =
                sev === "high" || sev === "critical"
                    ? "incomplete"
                    : "ambiguous";

            return {
                _key: id ? `issue:${id}` : `issue:${title}:${desc}`,
                type: inferredType,
                title: title || desc || "未命名问题",
                desc,
            };
        };

        issues.forEach((i) => {
            const n = normalizeItem(i, "ambiguous");
            if (n) list.push(n);
        });

        risks.forEach((r) => {
            const n = normalizeItem(r, "risk");
            if (n) list.push(n);
        });

        return list;
    }, [issues, risks]);

    if (normalized.length === 0) {
        return null;
    }

    const allOpen = openIndex === "all";

    return (
        <div className={className} style={style}>
            {/* ================= 问题 / 风险 ================= */}
            <h3 className="text-sm font-semibold mb-3 text-slate-800 dark:text-slate-100">
                问题与风险
            </h3>

            <button
                onClick={() => setOpenIndex(allOpen ? null : "all")}
                className="text-blue-500 mb-4 text-sm"
            >
                {allOpen ? "收起所有" : "展开所有"}
            </button>

            <div className="space-y-2">
                {normalized.map((issue, idx) => {
                    const meta = TYPE_META[issue.type] || TYPE_META.other;
                    const opened = allOpen || openIndex === idx;

                    return (
                        <div
                            key={issue._key || idx}
                            className="rounded-xl border bg-white border-slate-200
                                dark:bg-[#020617]/60 dark:border-cyan-400/20"
                        >
                            <button
                                onClick={() =>
                                    setOpenIndex(opened ? null : idx)
                                }
                                className="w-full px-4 py-3 flex items-start gap-3 text-left
                                    hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center
                                        text-sm ${meta.bg} ${meta.color}`}
                                >
                                    {meta.icon}
                                </div>

                                <div className="flex-1">
                                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                        {issue.title}
                                    </div>

                                    <div className={`text-xs mt-0.5 ${meta.color}`}>
                                        {meta.label}
                                        {issue.type === "risk" && issue.level
                                            ? ` · ${issue.level}`
                                            : ""}
                                    </div>
                                </div>

                                <div className="text-xs text-slate-400 ml-2">
                                    {opened ? "收起" : "展开"}
                                </div>
                            </button>

                            {opened && issue.desc && (
                                <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                    {issue.desc}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
