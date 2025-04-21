// frontend/src/pages/Admin/UserTypesPage/UserTypesPage.tsx

import React, { useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import { Pencil, Trash2 } from "lucide-react";

interface UserType {
  _id: string;
  name: string;
  userCount?: number;
}

export default function UserTypesPage() {
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const fetchUserTypes = async () => {
    try {
      const res = await apiClient.get("/user-types");
      setUserTypes(res.data.data);
    } catch (err) {
      console.error("Error fetching user types:", err);
    }
  };

  const handleCreateUserType = async () => {
    if (!newTypeName.trim()) {
      setError("Type name is required.");
      return;
    }

    try {
      await apiClient.post("/user-types", { name: newTypeName.trim() });
      setNewTypeName("");
      setShowModal(false);
      fetchUserTypes();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Error creating user type."
      );
    }
  };

  return (
    <div className="w-full h-full p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Types</h1>
          <button
            className="bg-[#7b4899] hover:bg-[#6f3e8c] text-white px-6 py-2 rounded-md"
            onClick={() => setShowModal(true)}
          >
            + New Type
          </button>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-[#f1f1f1] text-left text-sm font-semibold text-gray-700">
              <th className="p-3">Type</th>
              <th className="p-3">Number of Users</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userTypes.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-black font-medium py-6"
                >
                  No user types found.
                </td>
              </tr>
            ) : (
              userTypes.map((ut) => (
                <tr
                  key={ut._id}
                  className="border-t border-gray-200 text-sm hover:bg-gray-50"
                >
                  <td className="p-3">{ut.name}</td>
                  <td className="p-3">{ut.userCount ?? 0}</td>
                  <td className="p-3 flex gap-3">
                    <Pencil className="w-4 h-4 cursor-pointer text-gray-600 hover:text-blue-600" />
                    <Trash2 className="w-4 h-4 cursor-pointer text-gray-600 hover:text-red-600" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New User Type</h2>
            <input
              className="border w-full p-2 mb-2 rounded"
              placeholder="Enter user type name"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
            />
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="border px-4 py-2 rounded"
                onClick={() => {
                  setShowModal(false);
                  setError("");
                  setNewTypeName("");
                }}
              >
                Cancel
              </button>
              <button
                className="bg-[#7b4899] text-white px-4 py-2 rounded"
                onClick={handleCreateUserType}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}