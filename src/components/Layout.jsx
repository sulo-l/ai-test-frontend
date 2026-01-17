export default function Layout({ left, right }) {
    return (
      <div className="h-screen bg-zinc-100 flex">
        <div className="w-[420px] bg-white border-r border-zinc-200 p-5 flex flex-col">
          <div className="text-xl font-bold text-center mb-5">AI 测试用例生成器</div>
          {left}
          <div className="mt-4 text-xs text-zinc-500 text-center">
            PDF → 解析 → Gemini → Excel
          </div>
        </div>
  
        <div className="flex-1 p-6 overflow-y-auto">
          {right}
        </div>
      </div>
    );
  }
  