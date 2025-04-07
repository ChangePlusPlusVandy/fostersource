// frontend/src/pages/Admin/UserTypesPage/UserTypesPage.tsx

import React, { useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import { Pencil, Trash2 } from "lucide-react";

interface UserType {
  _id: string;
  name: string;
  userCount: number;
}

export default function UserTypesPage() {
  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const res = await apiClient.get("/user-types");
        setUserTypes(res.data);
      } catch (err) {
        console.error("Error fetching user types:", err);
      }
    };

    fetchUserTypes();
  }, []);

  return (
    <div className="w-full h-full p-6 bg-[#f8f9fa]">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Types</h1>
          <button className="bg-[#7b4899] hover:bg-[#693c82] text-white font-semibold px-4 py-2 rounded">
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
                  <td className="p-3">{ut.userCount}</td>
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
    </div>
  );
}
