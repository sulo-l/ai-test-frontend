export default function WorkflowErrorModal({
                                               open,
                                               title = "发生错误",
                                               message,
                                               onClose,
                                               onRetry,
                                           }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* 背景遮罩 */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal 主体 */}
            <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white dark:bg-[#020617] shadow-2xl border border-slate-200 dark:border-white/10">
                {/* Header */}
                <div className="px-6 pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {title}
                    </h3>
                </div>

                {/* 内容 */}
                <div className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {message ||
                        "系统在处理请求时发生异常，请稍后重试或刷新页面。"}
                </div>

                {/* 操作区 */}
                <div className="px-6 pb-6 flex justify-end gap-3">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="h-10 px-4 rounded-xl text-sm font-medium
                         bg-gradient-to-r from-cyan-400 to-indigo-500
                         text-[#020617] hover:brightness-110 transition"
                        >
                            重试
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="h-10 px-4 rounded-xl text-sm
                       border border-slate-300 text-slate-600
                       hover:bg-slate-100 transition
                       dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/5"
                    >
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
}
