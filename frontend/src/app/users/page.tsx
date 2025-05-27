"use client";

import { useEffect, useState } from "react";
import { expertApi } from "../service/api";
import RegisterPopup from "../components/RegisterPopUp";
import { Button } from "@/components/ui/button";
import {  FiTrash2, FiUserPlus, FiUsers } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import ConfirmDialog from "../components/ConfirmPopUp";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [confirmUserId, setConfirmUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await expertApi.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const confirmDeleteUser = (id: number) => {
    setConfirmUserId(id);
  };

  const handleDeleteUser = async () => {
    if (confirmUserId === null) return;

    try {
      await expertApi.delete(confirmUserId);
      setMessage("User deleted successfully");
      setMessageType("success");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
      setMessage("Failed to delete user");
      setMessageType("error");
    }

    setConfirmUserId(null);

    // Auto clear message after 3 seconds
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiUsers className="text-blue-600 dark:text-blue-400" size={28} />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Users Management
          </h1>
        </div>
        <Button
          onClick={() => setShowRegisterPopup(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FiUserPlus />
          Add User
        </Button>
      </div>
      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded-lg ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Table of users */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delete</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button
                    variant="destructive"
                    onClick={() => confirmDeleteUser(user.id)}
                    className="flex items-center gap-1"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popups */}
      <AnimatePresence>
        {showRegisterPopup && (
          <RegisterPopup
            onClose={() => {
              setShowRegisterPopup(false);
              fetchUsers();
            }}
          />
        )}
        {confirmUserId !== null && (
          
          <ConfirmDialog
            message="Are you sure you want to delete this user?"
            onConfirm={handleDeleteUser}
            onCancel={() => setConfirmUserId(null)}
          />
          
        )}
      </AnimatePresence>
    </div>
  );
}
