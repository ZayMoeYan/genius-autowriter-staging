'use client';

import { useEffect, useState } from "react";
import { FileText, Edit, Trash2, Eye, EyeOff, Calendar, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditModal from "@/app/dashboard/components/EditModal";
import {getContents, deleteContent, updateContent} from "@/app/actions/contentsAction";
import ViewModal from "@/app/dashboard/components/ViewModal";
import DeleteModal from "@/app/dashboard/components/DeleteModal";

export default function Dashboard() {
    const [contents, setContents] = useState<any[]>([]);
    const [editingContent, setEditingContent] = useState<any | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingContent, setDeletingContent] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewingContent, setViewingContent] = useState<any | null>(null);

    useEffect(() => {
        try{
            getContents().then((c) => setContents(c));
        }finally {
            setLoading(false)
        }
    }, []);

    const handleEdit = (content: any) => {
        setEditingContent(content);
    };

    const handleDelete = (content: any) => {
        setIsDeleteModalOpen(true);
        setDeletingContent(content);
    };

    const handleDeleteContent = async (id: number) => {
        setIsDeleting(true);

        await deleteContent(id)

        setIsDeleting(false);
        setIsDeleteModalOpen(false);
    };

    const handleTogglePosted = async (content: any) => {
        const updated = await updateContent(content.id, {
            is_posted: !content.is_posted,
        });
        setContents(
            contents.map((c) =>
                c.id === content.id ? { ...c, is_posted: updated.is_posted, updated_at: updated.updated_at } : c
            )
        );
    };

    const onViewCloseHandler = () => setViewingContent(null);
    const onCloseHandler = () => setEditingContent(null);

    const onSaveHandler = async (id: number, { title, content: body }: any) => {
        const updated = await updateContent(id, { title, content: body });
        setContents(
            contents.map((c) => (c.id === id ? { ...c, ...updated } : c))
        );
        setEditingContent(null);
    };

    const handleView = (content: any) => {
        setViewingContent(content);
    };

    const handleDeleteClose = () => {
        setIsDeleteModalOpen(false);
    };

    const filteredContents = contents.filter((content) => {
        const matchesSearch = content.title.toLowerCase().includes(search.toLowerCase()) ||
            content.content.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "posted" && content.is_posted) ||
            (statusFilter === "draft" && !content.is_posted);
        return matchesSearch && matchesStatus;
    });

    const totalContents = contents.length;
    const publishedContents = contents.filter(c => c.is_posted).length;
    const draftContents = contents.filter(c => !c.is_posted).length;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="bg-black/80 backdrop-blur-sm border-b border-primary/20">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">CONTENTS DASHBOARD</h1>
                            <p className="text-primary tracking-wider font-medium">CONTENTS MANAGEMENT</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-red-100 p-3 rounded-lg">
                                <FileText className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-gray-600">Total Contents</p>
                                <p className="text-gray-900">{totalContents}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Eye className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-gray-600">Published</p>
                                <p className="text-gray-900">{publishedContents}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <EyeOff className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-gray-600">Drafts</p>
                                <p className="text-gray-900">{draftContents}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Search contents..."
                                    className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-red-500 focus:ring-red-500">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Contents</SelectItem>
                                    <SelectItem value="posted">Published</SelectItem>
                                    <SelectItem value="draft">Drafts</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <p className="text-gray-600">
                                Showing {filteredContents.length} of {totalContents} contents
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-gray-800">📑 Contents Dashboard</h2>
                        <p className="text-gray-600">Manage your content library</p>
                    </div>

                    {loading || filteredContents.length === 0 && (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading contents...</p>
                        </div>
                    )
                    }

                    {loading && filteredContents.length === 0 && (
                        <div className="p-8 text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                                {search || statusFilter !== "all" ? "No contents found matching your criteria." : "No contents found."}
                            </p>
                        </div>
                    )
                    }
                    { filteredContents.length !== 0 && (
                        <div className="divide-y divide-gray-200">
                            {filteredContents.map((content) => (
                                <div
                                    key={content.id}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-gray-900">{content.title}</h3>
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
                                            </div>

                                            <p className="text-gray-600 line-clamp-2">
                                                {content.content}
                                            </p>

                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Created: {formatDate(content.created_at)}</span>
                                                </div>
                                                {content.updated_at && (
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Updated: {formatDate(content.updated_at)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                            <div className="flex items-center space-x-3">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={content.is_posted}
                                                        onChange={() => handleTogglePosted(content)}
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`relative w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                                                            content.is_posted ? "bg-green-500" : "bg-gray-300"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                                                content.is_posted ? "translate-x-5" : "translate-x-0"
                                                            }`}
                                                        ></div>
                                                    </div>
                                                </label>
                                                <span className="text-gray-600">
                                                    {content.is_posted ? "တင်ပြီး" : "မတင်ရသေး"}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={() => handleView(content)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500 hover:bg-blue-600"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleEdit(content)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-gray-300 hover:border-red-500 "
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(content)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-red-300 text-red-600 hover:bg-red-100 hover:border-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {viewingContent && (
                    <ViewModal
                        content={viewingContent}
                        onClose={onViewCloseHandler}
                    />
                )}

                {isDeleteModalOpen && (
                    <DeleteModal
                        content={deletingContent}
                        onClose={handleDeleteClose}
                        onDelete={handleDeleteContent}
                        isLoading={isDeleting}
                    />
                )}


                {editingContent && (
                    <EditModal
                        content={editingContent}
                        onClose={onCloseHandler}
                        onSave={onSaveHandler}
                    />
                )}
            </div>
        </div>
    );
}
