import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import apiClient from "../../../services/apiClient";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "staff" });
  const [userToDelete, setUserToDelete] = useState<User | null>(null);


  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiClient.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const addUser = async () => {
    try {
      const payload = {
        ...newUser,
        firebaseId: `${newUser.email}-fake-uid`, // placeholder until connected to Firebase
      };
      const response = await apiClient.post("/users", payload);
      setUsers((prev) => [...prev, response.data.user]);
      setNewUser({ name: "", email: "", role: "staff" });
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add user", err);
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

      <div className="flex items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 flex-1"
        />
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "Add Manager"}
        </button>
      </div>


      {showAddForm && (
        <div className="mb-6 bg-gray-50 border rounded-lg p-4 space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={addUser}
          >
            Submit
          </button>
        </div>
      )}

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
                key={user._id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <button onClick={() => setUserToDelete(user)}>
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
      {userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{userToDelete.name}</strong> (
              <span className="text-gray-600">{userToDelete.email}</span>)?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteUser(userToDelete._id);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
