import { useDropzone } from "react-dropzone";

export default function UploadPanel({
  requirement,
  setRequirement,
  file,
  setFile,
  onGenerate,
  loading,
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [] },
    onDrop: (files) => {
      setFile(files[0]);
    },
  });

  return (
    <div className="flex flex-col gap-4 flex-1">
      <textarea
        className="border border-zinc-200 rounded-xl p-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200"
        placeholder="请输入需求说明（优先级最高），例如：登录页必须校验空密码并提示中文错误"
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
      />

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-zinc-300 rounded-xl p-4 text-center cursor-pointer bg-zinc-50 hover:bg-zinc-100"
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="text-sm font-medium">{file.name}</div>
        ) : (
          <div className="text-sm text-zinc-600">
            拖拽 PDF 文件到此处，或点击上传
          </div>
        )}
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !file}
        className="mt-auto bg-emerald-600 text-white rounded-xl py-3 font-semibold hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "生成中…" : "生成测试用例并下载 Excel"}
      </button>
    </div>
  );
}
