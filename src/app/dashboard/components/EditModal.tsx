"use client";
import { useState } from "react";
import {useTranslation} from "react-i18next";

export default function EditModal({ content, onClose, onSave }: any) {
    const [title, setTitle] = useState(content.title);
    const [body, setBody] = useState(content.content);
    const [isSaving, setIsSaving] = useState(false);
    const { t, i18n } = useTranslation();

    const handleSubmit = async (e: any) => {
        console.log('submit')
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(content.id, { title, content: body });
            onClose();
        } catch (err) {
            console.error("Failed to save:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
                <div className="px-6 py-4 sm:px-8 sm:py-6 border-b border-gray-100 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">{t("editModal.title")}</h2>
                            <p className={`text-xs sm:text-sm text-gray-500 mt-1 ${i18n.language === "mm" && 'mt-2'} `}>{t("editModal.subtitle")}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
                            aria-label="Close modal"
                            disabled={isSaving}
                        >
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    id={'edit-form'}
                    className="px-6 py-4 sm:px-8 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1"
                >
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            {t("editModal.label_title")}
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white text-sm sm:text-base"
                            placeholder={t("editModal.placeholder_title")}
                            required
                            disabled={isSaving}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            {t("editModal.label_content")}
                        </label>
                        <textarea
                            id="content"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white resize-none text-sm sm:text-base"
                            rows={10}
                            placeholder={t("editModal.placeholder_content")}
                            required
                            disabled={isSaving}
                        />
                    </div>
                </form>

                <div className="flex items-center justify-end gap-3 px-6 py-4 sm:px-8 sm:py-6 border-t border-gray-100 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 sm:px-6 sm:py-2.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        disabled={isSaving}
                    >
                        {t("editModal.button_cancel")}
                    </button>
                    <button
                        type="submit"
                        form="edit-form"
                        className="px-4 py-2 sm:px-6 sm:py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0
                                        3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                {t("editModal.button_updating")}
                            </>
                        ) : (
                            t("editModal.button_update")
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
