import { useState } from "react";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import OutputPanel from "./components/OutputPanel";
import useTestcasePipeline from "./hooks/useTestcasePipeline";

export default function App() {
  const pipeline = useTestcasePipeline();

  // ⭐ 用来强制重建上传组件
  const [uploadKey, setUploadKey] = useState(Date.now());

  const [theme, setTheme] = useState("light");

  const subtleText = theme === "dark" ? "text-white/60" : "text-slate-500";

  const bgStyle =
    theme === "dark"
      ? {
          background: `
            radial-gradient(1200px 600px at 20% -10%, rgba(56,189,248,0.20), transparent 60%),
            radial-gradient(1000px 500px at 90% 10%, rgba(16,185,129,0.16), transparent 55%),
            radial-gradient(900px 500px at 50% 100%, rgba(99,102,241,0.14), transparent 60%),
            linear-gradient(180deg, #0b1220 0%, #070b14 100%)
          `,
        }
      : {
          background: `
            radial-gradient(1200px 600px at 20% -10%, rgba(56,189,248,0.14), transparent 60%),
            radial-gradient(1000px 500px at 90% 10%, rgba(16,185,129,0.12), transparent 55%),
            radial-gradient(900px 500px at 50% 100%, rgba(99,102,241,0.10), transparent 60%),
            linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
          `,
        };

  /**
   * ⭐ 包一层 reset
   * pipeline.reset() 是你原来的
   * setUploadKey 是新增的
   */
  const handleReset = () => {
    pipeline.reset?.();          // 如果存在 reset
    setUploadKey(Date.now());    // ⭐ 强制卸载 InputPanel（= UploadPanel）
  };

  return (
    <div
      className={`noise-bg min-h-screen ${
        theme === "dark" ? "text-white" : "text-slate-900"
      }`}
      style={bgStyle}
    >
      {/* 顶部 Header */}
      <Header theme={theme} setTheme={setTheme} subtleText={subtleText} />

      {/* 主体区域 */}
      <div className="max-w-6xl mx-auto px-5 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* ================= 左侧输入 ================= */}
          <div className="lg:col-span-5 h-full">
            <InputPanel
              key={uploadKey}          // ⭐⭐⭐ 就是这一行
              theme={theme}
              subtleText={subtleText}
              {...pipeline}
              onReset={handleReset}    // ⭐ 如果 InputPanel 里有“重置按钮”
            />
          </div>

          {/* ================= 右侧输出 ================= */}
          <div className="lg:col-span-7 h-full">
            <OutputPanel
              subtleText={subtleText}
              status={pipeline.status}
              testPoints={pipeline.bufferedTestPoints}
              hasAnyOutput={pipeline.hasAnyOutput}
              progress={pipeline.progress}
              downloadUrl={pipeline.downloadUrl}
              caseCount={pipeline.caseCount}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`py-5 text-center text-xs ${subtleText}`}>
        © AI智能体测试平台 V1.0
      </div>
    </div>
  );
}
