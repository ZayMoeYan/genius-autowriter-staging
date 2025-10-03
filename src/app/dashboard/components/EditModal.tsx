"use client";
import { useState } from "react";

export default function EditModal({ content, onClose, onSave }: any) {
    const [title, setTitle] = useState(content.title);
    const [body, setBody] = useState(content.content);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(content.id, { title, content: body });
            onClose()
        } catch (err) {
            console.error("Failed to save:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Edit Content</h2>
                            <p className="text-sm text-gray-500 mt-1">Update your content details below</p>
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

                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white"
                            placeholder="Enter content title..."
                            required
                            disabled={isSaving}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white resize-none"
                            rows={14}
                            placeholder="Enter your content here..."
                            required
                            disabled={isSaving}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                "Update"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
