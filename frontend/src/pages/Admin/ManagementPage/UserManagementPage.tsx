import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import apiClient from "../../../services/apiClient";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/users");
      setUsers(response.data); // Adjust if response is nested under `data.data`
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiClient.delete(`/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold mb-4">Managers</h1>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-l-lg px-4 py-2 w-full"
        />
        <button className="bg-purple-500 text-white px-4 py-2 rounded-r-lg">
          Add Manager
        </button>
      </div>

      <div className="bg-white border rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr
                key={user.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <button onClick={() => deleteUser(user.id)}>
                    <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
