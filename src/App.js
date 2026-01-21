import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/commno/Header";
import HomeHero from "./pages/HomeHero";
import WorkflowPage from "./pages/WorkflowPage";

export default function App() {
    const [theme, setTheme] = useState("light");
    const subtleText =
        theme === "dark" ? "text-white/60" : "text-slate-500";

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

    return (
        <div
            className={`min-h-screen flex flex-col ${
                theme === "dark" ? "text-white" : "text-slate-900"
            }`}
            style={bgStyle}
        >
            {/* Header */}
            <Header
                theme={theme}
                setTheme={setTheme}
                subtleText={subtleText}
            />

            {/* 主体内容（关键：flex-1） */}
            <main className="flex-1 relative z-10">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomeHero
                                theme={theme}
                                subtleText={subtleText}
                            />
                        }
                    />
                    <Route
                        path="/workflow"
                        element={
                            <WorkflowPage
                                theme={theme}
                                subtleText={subtleText}
                            />
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            {/* Footer（不再 absolute） */}
            <footer className={`py-6 text-center text-xs ${subtleText}`}>
                © AI 智能体测试平台 V1.5
            </footer>
        </div>
    );
}
