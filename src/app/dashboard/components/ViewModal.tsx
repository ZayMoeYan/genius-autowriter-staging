import { X, Calendar, Eye, EyeOff, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {useTranslation} from "react-i18next";
import {useToast} from "@/hooks/use-toast";

interface ViewModalProps {
    content: {
        id: number;
        title: string;
        content: string;
        is_posted: boolean;
        created_at: string;
        updated_at?: string;
    };
    onClose: () => void;
}

export default function ViewModal({ content, onClose }: ViewModalProps) {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const { t } = useTranslation();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content.content);
            toast({
                title: t("viewModal.copy_success"),
                description: t("viewModal.copy_success_desc"),
                status: "success",
            })
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2 sm:p-4">
            <div className="max-h-[90vh] sm:max-h-[85vh] bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-4xl mx-auto shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex-1 space-y-2">
                        <h2 className="text-gray-800 text-lg sm:text-xl font-semibold break-words">
                            {content.title}
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                            <div
                                className={'bg-white border border-red-600 rounded-full w-fit'}
                            >
                                {content.is_posted ? (
                                    <div className={'text-red-600 flex items-center px-2 font-semibold'} >
                                        <Eye className="h-3 w-3 mr-1 " />
                                        {t("viewModal.status_posted")}
                                    </div>
                                ) : (
                                    <div className={'text-red-600 flex items-center px-2 font-semibold'}>
                                        <EyeOff className="h-3 w-3 mr-1 " />
                                        {t("viewModal.status_not_posted")}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span className="truncate">
                                        {t("viewModal.created_at")}: {formatDate(content.created_at)}
                                    </span>
                                </div>
                                {content.updated_at && (
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span className="truncate">
                                            {t("viewModal.updated_at")}: {formatDate(content.updated_at)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 hidden md:block lg:block rounded-full transition-colors duration-200 group"
                        aria-label="Close modal"
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

                <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="prose prose-sm sm:prose-lg max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed break-words">
                            {content.content}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50/50">
                    <Button
                        onClick={onClose}
                        className="px-4 py-2 sm:px-6 sm:py-2.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        {t("viewModal.button_close")}
                    </Button>
                    <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="px-4 py-2 sm:px-6 sm:py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                    >
                        <Copy className="h-4 w-4" />
                        <span>{copied ? t("viewModal.button_copied") : t("viewModal.button_copy")}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
