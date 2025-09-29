import { X, Calendar, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-4xl mx-4 shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                            <h2 className="text-gray-800 mb-2">{content.title}</h2>
                            <div className="flex items-center space-x-4">
                                <Badge
                                    variant={content.is_posted ? "default" : "secondary"}
                                    className={
                                        content.is_posted
                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                    }
                                >
                                    {content.is_posted ? (
                                        <>
                                            <Eye className="h-3 w-3 mr-1" />
                                            တင်ပြီး
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="h-3 w-3 mr-1" />
                                            မတင်ရသေး
                                        </>
                                    )}
                                </Badge>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Created: {formatDate(content.created_at)}</span>
                                    </div>
                                    {content.updated_at && (
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Updated: {formatDate(content.updated_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="prose prose-lg max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {content.content}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50/50">
                    <Button
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}