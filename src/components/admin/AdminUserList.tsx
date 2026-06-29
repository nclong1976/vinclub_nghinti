import React from "react";
import { useUsers } from "../../hooks/useUsers";

export default function AdminUserList() {
  const { users, loading } = useUsers();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Quản lý người dùng ({users.length})
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Đang tải dữ liệu real-time...</span>
        </div>
      ) : users.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Chưa có người dùng nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border font-semibold">#</th>
                <th className="p-3 border font-semibold">Tên hiển thị</th>
                <th className="p-3 border font-semibold">Email</th>
                <th className="p-3 border font-semibold">Trạng thái</th>
                <th className="p-3 border font-semibold">Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border text-gray-400">{index + 1}</td>
                  <td className="p-3 border font-medium">{user.displayName}</td>
                  <td className="p-3 border text-gray-600">{user.email}</td>
                  <td className="p-3 border">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "online"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      {user.status === "online" ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="p-3 border text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString("vi-VN")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
