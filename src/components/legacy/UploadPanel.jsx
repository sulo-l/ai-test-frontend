import { useState } from "react";
import { useDropzone } from "react-dropzone";

/**
 * ===============================
 * Workflow 专用 UploadPanel
 * 职责：
 * 1️⃣ 选择 PDF
 * 2️⃣ 通知父组件 onUpload(file)
 * 不做：分析 / 生成 / pipeline
 * ===============================
 */
export default function UploadPanel({ onUpload }) {
    const [file, setFile] = useState(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "application/pdf": [] },
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                setFile(acceptedFiles[0]);
            }
        },
    });

    return (
        <div
            className="
        rounded-3xl
        p-6
        backdrop-blur-2xl
        border
        shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)]
        bg-white
        border-black/5
        dark:bg-[#020617]/80
        dark:border-cyan-400/20
      "
        >
            {/* ================= Header ================= */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    上传需求文档
                </h2>
                <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
                    请上传 PDF 格式的需求文档，后续可选择需求分析或直接生成测试用例
                </p>
            </div>

            {/* ================= Dropzone ================= */}
            <div
                {...getRootProps()}
                className={`
          flex flex-col items-center justify-center
          h-44
          rounded-xl
          border-2 border-dashed
          cursor-pointer
          transition
          ${
                    isDragActive
                        ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-400/10"
                        : "border-slate-300 bg-slate-50 dark:bg-[#020617]/40 dark:border-cyan-400/30"
                }
        `}
            >
                <input {...getInputProps()} />

                {!file ? (
                    <>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            拖拽 PDF 文件到此处，或点击上传
                        </div>
                        <div className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                            仅支持 PDF 文件
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            📄 {file.name}
                        </div>
                        <div className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                            点击可重新选择
                        </div>
                    </>
                )}
            </div>

            {/* ================= Action ================= */}
            <div className="mt-6 flex justify-end">
                <button
                    disabled={!file}
                    onClick={() => onUpload?.(file)}
                    className={`
            h-11 px-6 rounded-xl
            font-semibold transition-all
            ${
                        file
                            ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-[#020617] shadow-[0_0_40px_-10px_rgba(56,189,248,0.7)] hover:brightness-110"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    }
          `}
                >
                    确认上传
                </button>
            </div>
        </div>
    );
}
