interface DeleteModalProps {
    content: {
        id: number;
        title: string;
    };
    onClose: () => void;
    onDelete: (id: number) => void;
    isLoading?: boolean;
}

export default function DeleteModal({ content, onClose, onDelete, isLoading = false }: DeleteModalProps) {
    const handleDelete = async () => {
        await onDelete(content.id);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg max-h-[90vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-4 py-5 sm:px-6 sm:py-6 text-center overflow-y-auto flex-1">
                    {/* Warning Icon */}
                    <div className="mx-auto flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full mb-4">
                        <svg
                            className="w-7 h-7 sm:w-8 sm:h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0
                                   2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732
                                   0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>

                    {/* Title and Description */}
                    <div className="mb-5 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Delete Content</h2>
                        <p className="text-xs sm:text-sm text-gray-500 mb-3">
                            Are you sure you want to delete this content? This action cannot be undone.
                        </p>

                        {/* Content Preview */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3 text-left">
                            <p className="text-sm font-medium text-gray-700 truncate">
                                "{content.title}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-100 shrink-0">
                    <div className="flex items-center justify-end gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 sm:px-6 sm:py-2.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="px-4 py-2 sm:px-6 sm:py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                        >
                            {isLoading && (
                                <svg
                                    className="animate-spin -ml-1 mr-1 sm:mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373
                                           0 0 5.373 0 12h4zm2 5.291A7.962
                                           7.962 0 014 12H0c0 3.042 1.135
                                           5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            )}
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
