'use client';

import {useEffect, useState} from "react";
import {
    Users,
    UserCheck,
    UserX,
    Shield,
    Search,
    Edit,
    Trash2,
    Plus,
    X,
    ChevronLeft,
    ChevronRight, EyeOff, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {deleteUserOrAdmin, getUsers, save, updateUserOrAdmin} from "@/app/actions/usersAction";
import UserDeleteModal from "@/app/admin/dashboard/components/UserDeleteModal";
import {useToast} from "@/hooks/use-toast";
import { useAuth} from "@/app/context/AuthProvider";
import {getLoginUser} from "@/app/actions/getLoginUser";
import {useRouter} from "next/navigation";
import {logout} from "@/app/actions/logoutAction";

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState<any | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const { currentUser, setCurrentUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            getLoginUser().then((user) => {
                if (user) { // @ts-ignore
                    setCurrentUser(user);
                }
            });
        }
    }, [currentUser, setCurrentUser]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setLoading(true)
                setUsers(data);
            } catch (err: any) {

            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);


    const createUser = async (username: string, email: string, password: string, role: string) => {
        setIsSaving(true);
        try {
            const newUser = { username, email, password, role };
            const data = await save(newUser);
            toast({
                title: "Success",
                description: `${role} ${username} has been created successfully.`,
                status: "success",
            })
            setUsers([...users, data]);
        } catch (err: any) {
            toast({
                title: "Error",
                description: "Failed to save user. Please try again.",
                status: "error"
            });
            throw err;
        }
            setIsSaving(false);

    };


    const handleUserDeleteClose = () => {
        setIsUserDeleteModalOpen(false);
    };

    const handleDelete = (user: any) => {
        setUserToDelete(user);
        setIsUserDeleteModalOpen(true);
    }

    const handleUserDelete = async (id: number) => {
        setIsDeleting(true);
        try {
            const res = await deleteUserOrAdmin(id);
            toast({
                title: "Success",
                description: `${res.role} ${res.username} has been deleted successfully.`,
                status: "success",
            })
            if (res.message) {
                setUsers(users.filter((u) => u.id !== id));
            }
        } catch (err: any) {

        }
        setIsDeleting(false);
        setIsUserDeleteModalOpen(false);
    };


    const saveEdit = async () => {
        setIsSaving(true)
        if (!editUser) return;
        try {

            delete(editUser.created_at);
            if(editUser.role === "Admin" && editUser.password) {
                await updateUserOrAdmin(editUser.id, editUser);
                toast({
                    title: "Success",
                    description: `${editUser.role} ${editUser.username} has been updated successfully.`,
                    status: "success",
                })
                await logout();
                setCurrentUser(null);
                router.push('/admin/login');
            }
            const data = await updateUserOrAdmin(editUser.id, editUser);
            toast({
                title: "Success",
                description: `${editUser.role} ${editUser.username} has been updated successfully.`,
                status: "success",
            })

            setUsers(users.map((u) => (u.id === data.id ? data : u)));
            setEditUser(null);

        } catch (err: any) {
            toast({
                title: "Error",
                description: "Failed to edit user. Please try again.",
                status: "error"
            });
        }
            setIsSaving(false)

    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || u.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
        return matchesSearch && matchesStatus && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };


    const totalUsers = users.length;
    const activatedUsers = users.filter(u => u.status.toLowerCase() === "Activate".toLowerCase()).length;
    const deactivatedUsers = users.filter(u => u.status.toLowerCase() === "Deactivate".toLowerCase()).length;
    const adminUsers = users.filter(u => u.role === "Admin").length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">

            <div className="bg-black/80 backdrop-blur-sm border-b border-primary/20">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">ADMIN DASHBOARD</h1>
                            <p className="text-primary tracking-wider font-medium">USERS MANAGEMENT</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-red-100 p-3 rounded-lg">
                                <Users className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-gray-600">Total Users</p>
                                <p className="text-gray-900">{totalUsers}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-gray-600">Activated Users</p>
                                <p className="text-gray-900">{activatedUsers}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <UserX className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-gray-600">Deactivated Users</p>
                                <p className="text-gray-900">{deactivatedUsers}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-gray-600">Admins</p>
                                <p className="text-gray-900">{adminUsers}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Search by username or email..."
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
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="activate">Activated</SelectItem>
                                    <SelectItem value="deactivate">Deactivated</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-red-500 focus:ring-red-500">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admins</SelectItem>
                                    <SelectItem value="user">Users</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create User
                        </Button>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-gray-800">All Users ({filteredUsers.length})</h2>
                        <p className="text-gray-600">Manage your users and their permissions</p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No users found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-gray-700">Role</th>
                                        <th className="px-6 py-4 text-left text-gray-700">Username</th>
                                        <th className="px-6 py-4 text-left text-gray-700">Email</th>
                                        <th className="px-6 py-4 text-left text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-left text-gray-700">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {paginatedUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                                                        u.role === 'ADMIN'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800 font-bold'
                                                    }`}>
                                                        {u.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                                                        {u.role === 'TRIAL' ? `${u.role} Credit - ${u.generated_count}` : u.role}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">{u.username}</td>
                                            <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                            <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                                                        u.status === 'Activate'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {u.status === 'Activate' ? (
                                                            <UserCheck className="h-3 w-3 mr-1" />
                                                        ) : (
                                                            <UserX className="h-3 w-3 mr-1" />
                                                        )}
                                                        {u.status}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        onClick={() => setEditUser(u)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-gray-300 hover:border-red-500 "
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(u)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-red-300 text-red-600 hover:bg-red-100 hover:border-red-500 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <p className="text-gray-600">
                                                Showing <span className={'font-bold'} >{startIndex + 1}</span> to <span className={'font-bold'} >{Math.min(endIndex, filteredUsers.length)}</span> of <span className={'font-bold'} >{filteredUsers.length} </span> users
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-300 hover:border-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>

                                            <div className="flex items-center space-x-1">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                    const isCurrentPage = page === currentPage;
                                                    const isNearCurrent = Math.abs(page - currentPage) <= 2;
                                                    const isFirstOrLast = page === 1 || page === totalPages;

                                                    if (isNearCurrent || isFirstOrLast) {
                                                        return (
                                                            <Button
                                                                key={page}
                                                                onClick={() => goToPage(page)}
                                                                variant={isCurrentPage ? "default" : "outline"}
                                                                size="sm"
                                                                className={
                                                                    isCurrentPage
                                                                        ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                                                                        : "border-gray-300 hover:border-red-500 hover:text-red-600"
                                                                }
                                                            >
                                                                {page}
                                                            </Button>
                                                        );
                                                    } else if (
                                                        (page === currentPage - 3 && currentPage > 4) ||
                                                        (page === currentPage + 3 && currentPage < totalPages - 3)
                                                    ) {
                                                        return (
                                                            <span key={page} className="px-2 text-gray-400">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>

                                            <Button
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-300 hover:border-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {showCreateForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-gray-800 font-bold">Create New User</h2>
                                <Button
                                    onClick={() => setShowCreateForm(false)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <UserForm
                                onSubmit={createUser}
                                onCancel={() => setShowCreateForm(false)}
                                isSaving={isSaving}
                                onSuccess={() => setShowCreateForm(false)}
                            />

                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {editUser && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-gray-800">Edit User</h2>
                                <Button
                                    onClick={() => setEditUser(null)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={editUser.username}
                                        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            placeholder="Optional (new password)"
                                            value={editUser.password || ""}
                                            onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                                            type={showPassword ? "text" : "password"}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Role</label>
                                    <Select
                                        value={editUser.role}
                                        onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                                    >
                                        <SelectTrigger className="border border-gray-300 focus:border-none focus:border-red-500 focus:ring-red-500">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USER">User</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                            <SelectItem value="TRIAL">TRIAL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Status</label>
                                    <Select
                                        value={editUser.status}
                                        onValueChange={(value) => setEditUser({ ...editUser, status: value })}
                                    >
                                        <SelectTrigger className="border border-gray-300 focus:border-none focus:border-red-500 focus:ring-red-500">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Activate">Activate</SelectItem>
                                            <SelectItem value="Deactivate">Deactivate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        onClick={() => setEditUser(null)}
                                        variant="outline"
                                        disabled={isSaving}
                                        className="border-gray-300  hover:bg-gray-100 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={isSaving}
                                        onClick={saveEdit}
                                        className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving && (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {isSaving ? 'Updating...' : 'Update'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isUserDeleteModalOpen && (
                <UserDeleteModal
                    user={userToDelete}
                    onClose={handleUserDeleteClose}
                    onDelete={handleUserDelete}
                    isLoading={isDeleting}
                />
            )}
        </div>

    );
}

function UserForm({
                      onSubmit,
                      onCancel,
                      isSaving,
                      onSuccess,
                  }: {
    onSubmit: (username: string, email: string, password: string, role: string) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
    onSuccess: () => void;
}) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(username, email, password, role);
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("USER");
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                    type="text"
                    placeholder="Enter username"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    placeholder="Enter email"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                        placeholder={"Enter Password"}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="border border-gray-300 focus:border-none focus:border-red-500 focus:ring-red-500">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">USER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="TRIAL">TRIAL</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-100 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4 mr-2" />
                            Create User
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

