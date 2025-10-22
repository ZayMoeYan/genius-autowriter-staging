'use client';

import {useEffect, useMemo, useState} from "react";
import {
    FileText,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Calendar,
    Search,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditModal from "@/app/dashboard/components/EditModal";
import {getContents, deleteContent, updateContent} from "@/app/actions/contentsAction";
import ViewModal from "@/app/dashboard/components/ViewModal";
import DeleteModal from "@/app/dashboard/components/DeleteModal";
import {useToast} from "@/hooks/use-toast";
import {useTranslation} from "react-i18next";

const contentsPerPage = 8;

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
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const { t, i18n } = useTranslation();


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const c = await getContents();
                setContents(c);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
        toast({
            title: t("contentDashboard.toast.success"),
            description: t("contentDashboard.toast.deleteSuccess"),
            status: "success",
        })
        setContents((prev) => prev.filter((c) => c.id !== id));
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
    };

    const handleTogglePosted = async (content: any) => {
        const newStatus = !content.is_posted;
        setContents((prev) =>
            prev.map((c) =>
                c.id === content.id
                    ? { ...c, is_posted: newStatus, updated_at: new Date().toISOString() }
                    : c
            )
        );
        setTogglingId(content.id);
        try {
            const updated = await updateContent(content.id, { is_posted: newStatus });

            setContents((prev) =>
                prev.map((c) =>
                    c.id === content.id
                        ? { ...c, is_posted: updated.is_posted, updated_at: updated.updated_at }
                        : c
                )
            );
        } catch (error) {
            console.error("Failed to update:", error);

            setContents((prev) =>
                prev.map((c) =>
                    c.id === content.id ? { ...c, is_posted: content.is_posted } : c
                )
            );
        } finally {
            setTogglingId(null);
        }
    };

    const onViewCloseHandler = () => setViewingContent(null);
    const onCloseHandler = () => setEditingContent(null);

    const onSaveHandler = async (id: number, { title, content: body }: any) => {

        console.log(title, body)

        const updated = await updateContent(id, { title, content: body });
        toast({
            title: t("contentDashboard.toast.success"),
            description: t("contentDashboard.toast.updateSuccess"),
            status: "success",
        })
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

    const filteredContents = useMemo(() => {
        return contents.filter((content) => {
            const matchesSearch = content.title.toLowerCase().includes(search.toLowerCase())
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "posted" && content.is_posted) ||
                (statusFilter === "draft" && !content.is_posted);
            return matchesSearch && matchesStatus;
        });
    }, [contents, search, statusFilter]);

    const totalContents = filteredContents.length;
    const totalPages = Math.ceil(totalContents / contentsPerPage);
    const startIndex = (currentPage - 1) * contentsPerPage;
    const paginatedContents = filteredContents.slice(
        (currentPage - 1) * contentsPerPage,
        currentPage * contentsPerPage
    );

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
            <div className="bg-black/80 backdrop-blur-sm border-b border-primary/20 mb-8 border-red-800 border-[0.5px] rounded-xl mt-10 lg:mx-20 md:mx-10 mx-5 "  >
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div>
                            <h1 className={`font-bold text-white mb-1 text-3xl`}>{t('contentDashboard.title')}</h1>
                            <p className={`tracking-wider font-medium  text-red-600 ${i18n.language === "mm" ? "text-sm" : "text-primary"}`}>{t('contentDashboard.subtitle')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl  lg:mx-20 md:mx-10 mx-5">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-black/95 backdrop-blur-sm border-red-800 border-[0.5px] p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-red-100 p-3 rounded-lg">
                                <FileText className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-white">{t("contentDashboard.stats.total")}</p>
                                <p className="text-gray-400">{totalContents}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-black/95 backdrop-blur-sm  border-red-800 border-[0.5px]  p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Eye className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-white">{t("contentDashboard.stats.published")}</p>
                                <p className="text-gray-400">{publishedContents}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-black/95 backdrop-blur-sm border-red-800 border-[0.5px] p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <EyeOff className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-white">{t("contentDashboard.stats.drafts")}</p>
                                <p className="text-gray-400">{draftContents}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-black/95 backdrop-blur-sm rounded-2xl shadow-2xl border-red-800  border-[0.5px] p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder={t("contentDashboard.searchPlaceholder")}
                                    className="pl-10 border-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-48 border-none">
                                    <SelectValue placeholder={t("contentDashboard.filterPlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("contentDashboard.filter.all")}</SelectItem>
                                    <SelectItem value="posted">{t("contentDashboard.filter.posted")}</SelectItem>
                                    <SelectItem value="draft">{t("contentDashboard.filter.draft")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2 ">
                            <p className="text-gray-400">
                                {t("contentDashboard.showing")} {paginatedContents.length} of {totalContents}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-black/95 backdrop-blur-sm rounded-2xl shadow-2xl border-red-800 border-[0.5px] overflow-hidden">
                    <div className="p-6 border-b border-red-800">
                        <h2 className={`text-white text-2xl`}>{t("contentDashboard.table.title")}</h2>
                        <p className={`text-gray-400 ${i18n.language === "mm" ? "text-sm mt-2" : ""}`}>{t("contentDashboard.table.description")}</p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">{t("contentDashboard.loading.title")}</p>
                        </div>
                    ) : paginatedContents.length === 0 ? (
                        <div className="p-8 text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                                {search || statusFilter !== "all"
                                    ? t("contentDashboard.loading.emptyFiltered")
                                    : t("contentDashboard.loading.emptyTitle")}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {paginatedContents.map((content) => (
                                <div
                                    key={content.id}
                                    className="p-6 bg-white/20 hover:bg-white/40 transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-white text-xl">{content.title}</h3>
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
                                                            {t("contentDashboard.status.posted")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="h-3 w-3 mr-1" />
                                                            {t("contentDashboard.status.draft")}
                                                        </>
                                                    )}
                                                </Badge>
                                                <div className="flex items-center space-x-3">
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={content.is_posted}
                                                            disabled={togglingId === content.id}
                                                            onChange={() => handleTogglePosted(content)}
                                                            className="sr-only"
                                                        />
                                                        <div
                                                            className={`relative w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                                                                content.is_posted ? "bg-green-500" : "bg-gray-300"
                                                            } ${togglingId === content.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        >
                                                            <div
                                                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                                                    content.is_posted ? "translate-x-5" : "translate-x-0"
                                                                }`}
                                                            ></div>
                                                            {togglingId === content.id && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <p className="text-white line-clamp-2">
                                                {content.content}
                                            </p>

                                            <div className="flex items-center space-x-4 text-xs text-white">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{t("contentDashboard.table.created")} {formatDate(content.created_at)}</span>
                                                </div>
                                                {content.updated_at && (
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{t("contentDashboard.table.updated")} {formatDate(content.updated_at)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">


                                            {/* Action Buttons */}
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={() => handleView(content)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-blue-300 text-blue-600  hover:border-blue-500 hover:bg-blue-600"
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

                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-red-800">
                        <p className="text-sm text-gray-400">
                            { i18n.language === "en" ? 'Showing ' : (
                                <>
                                    Content စာမျက်နှာ{" "}
                                    <span className="font-semibold">{filteredContents.length}</span>
                                    {" "} ခုထဲမှ {" "}
                                </>
                            )}
                            <span className="font-semibold">
                                {(currentPage - 1) * contentsPerPage + 1}
                              </span>{" "}
                            { i18n.language === "en" ? "to " : "မှ " }
                            <span className="font-semibold">
                                {Math.min(currentPage * contentsPerPage, filteredContents.length)}
                              </span>{" "}
                            { i18n.language === "en" ? "of " : "အထိ" }
                            <span className="font-semibold">{i18n.language === "en" && filteredContents.length}</span>{" "}
                            { i18n.language === "en" ? "contents" : "ပြသနေပါသည်" }
                        </p>

                        <div className="flex items-center space-x-2">
                            {/* Previous */}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => goToPage(currentPage - 1)}
                                className="border-gray-300"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                {t("contentDashboard.buttons.previous")}
                            </Button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    size="sm"
                                    className={`${
                                        page === currentPage
                                            ? "bg-red-900 text-white"
                                            : "border-gray-300 hover:bg-gray-200 hover:text-red-600"
                                    }`}
                                >
                                    {page}
                                </Button>
                            ))}

                            {/* Next */}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => goToPage(currentPage + 1)}
                                className="border-gray-300"
                            >
                                {t("contentDashboard.buttons.next")}
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

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
