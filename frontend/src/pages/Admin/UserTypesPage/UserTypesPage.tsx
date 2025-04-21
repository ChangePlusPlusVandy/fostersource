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
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const fetchUserTypes = async () => {
    try {
      const res = await apiClient.get("/user-types");
      setUserTypes(res.data.data);
    } catch (err) {
      console.error("Error fetching user types:", err);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const handleCreate = async () => {
    try {
      await apiClient.post("/user-types", { name: newName });
      setShowCreate(false);
      setNewName("");
      fetchUserTypes();
    } catch (err) {
      console.error("Error creating user type:", err);
    }
  };

  const handleEdit = async () => {
    try {
      await apiClient.put(`/user-types/${selectedType?._id}`, { name: newName });
      setShowEdit(false);
      setSelectedType(null);
      setNewName("");
      fetchUserTypes();
    } catch (err) {
      console.error("Error editing user type:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/user-types/${selectedType?._id}`);
      setShowDelete(false);
      setSelectedType(null);
      fetchUserTypes();
    } catch (err) {
      console.error("Error deleting user type:", err);
    }
  };

  return (
    <div className="w-full h-full p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Types</h1>
          <button
            className="bg-[#7b4899] hover:bg-[#6f3e8c] text-white px-6 py-2 rounded-md"
            onClick={() => setShowCreate(true)}
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
                <td colSpan={3} className="text-center text-black font-medium py-6">
                  No user types found.
                </td>
              </tr>
            ) : (
              userTypes.map((ut) => (
                <tr key={ut._id} className="border-t border-gray-200 text-sm hover:bg-gray-50">
                  <td className="p-3">{ut.name}</td>
                  <td className="p-3">{ut.userCount}</td>
                  <td className="p-3 flex gap-3">
                    <Pencil
                      className="w-4 h-4 cursor-pointer text-gray-600 hover:text-blue-600"
                      onClick={() => {
                        setSelectedType(ut);
                        setNewName(ut.name);
                        setShowEdit(true);
                      }}
                    />
                    <Trash2
                      className="w-4 h-4 cursor-pointer text-gray-600 hover:text-red-600"
                      onClick={() => {
                        setSelectedType(ut);
                        setShowDelete(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Create User Type</h2>
              <button onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <input
              type="text"
              className="w-full border p-2 mb-4"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded" onClick={() => setShowCreate(false)}>Cancel</button>
              <button
                className="px-4 py-2 bg-[#7b4899] text-white rounded"
                onClick={handleCreate}
              >
                Create Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit User Type</h2>
              <button onClick={() => setShowEdit(false)}>✕</button>
            </div>
            <input
              type="text"
              className="w-full border p-2 mb-4"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New Name"
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded" onClick={() => setShowEdit(false)}>Cancel</button>
              <button
                className="px-4 py-2 bg-[#7b4899] text-white rounded"
                onClick={handleEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Confirmation</h2>
              <button onClick={() => setShowDelete(false)}>✕</button>
            </div>
            <p className="mb-4">Are you sure you want to remove this user type?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded" onClick={() => setShowDelete(false)}>Keep</button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}