"use client";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    status: 'active' | 'deactivated';
}

interface UserDeleteModalProps {
    user: User;
    onClose: () => void;
    onDelete: (id: number) => void;
    isLoading?: boolean;
}

export default function UserDeleteModal({ user, onClose, onDelete, isLoading = false }: UserDeleteModalProps) {
    const handleDelete = async () => {
        await onDelete(user.id);
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
    };

    const getRoleIcon = (role: string) => {
        if (role.toLowerCase().includes('admin')) {
            return (
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            );
        }
        return (
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-6 text-center">
                    {/* Warning Icon */}
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>

                    {/* Title and Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete User</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user from the system.
                        </p>

                        {/* User Details Card */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left space-y-3">
                            {/* Username */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {getRoleIcon(user.role)}
                                    <span className="text-sm font-medium text-gray-700">Username:</span>
                                </div>
                                <span className="text-sm text-gray-900 font-medium">{user.username}</span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Email:</span>
                                </div>
                                <span className="text-sm text-gray-900">{user.email}</span>
                            </div>

                            {/* Role */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Role:</span>
                                </div>
                                <span className="text-sm text-gray-900 capitalize">{user.role}</span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Status:</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="px-6 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isLoading ? 'Deleting User...' : 'Delete User'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}