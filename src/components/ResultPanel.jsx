import { useTranslation } from "react-i18next";

export default function ResultPanel({
  cases = [],
  status = "idle",
  hasAnyOutput = false,
}) {
  const { t } = useTranslation();

  // 1️⃣ 尚未开始
  if (status === "idle") {
    return (
      <div className="text-zinc-400 text-center mt-40">
        {t("result.idle")}
      </div>
    );
  }

  // 2️⃣ 生成中，但还没有任何 case
  if (status === "running" && !hasAnyOutput) {
    return (
      <div className="mt-24 flex flex-col items-center text-zinc-500 gap-2">
        <div className="animate-pulse text-sm">
          {t("result.running.title")}
        </div>
        <div className="text-xs text-zinc-400">
          {t("result.running.subtitle")}
        </div>
      </div>
    );
  }

  // 3️⃣ 已完成但无用例（兜底 / 异常）
  if (status === "done" && cases.length === 0) {
    return (
      <div className="mt-24 text-center text-red-400 text-sm">
        {t("result.empty")}
      </div>
    );
  }

  // 4️⃣ 正常展示
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cases.map((tc, idx) => (
        <div
          key={idx}
          className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm"
        >
          <div className="font-semibold mb-2">
            {tc["用例名称"]}
          </div>

          <div className="text-xs text-zinc-500 mb-2">
            {t("result.module")}：{tc["所属模块"]}
            {" ｜ "}
            {t("result.tags")}：
            {Array.isArray(tc["标签"])
              ? tc["标签"].join("，")
              : tc["标签"]}
          </div>

          <div className="text-sm">
            <div className="mb-2">
              <span className="font-semibold">
                {t("result.precondition")}：
              </span>
              <span className="text-zinc-700">
                {tc["前置条件"]}
              </span>
            </div>

            <div className="mb-2 whitespace-pre-wrap">
              <span className="font-semibold">
                {t("result.steps")}：
              </span>
              <span className="text-zinc-700">
                {tc["步骤描述"]}
              </span>
            </div>

            <div className="whitespace-pre-wrap">
              <span className="font-semibold text-emerald-700">
                {t("result.expected")}：
              </span>
              <span className="text-emerald-700">
                {tc["预期结果"]}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
