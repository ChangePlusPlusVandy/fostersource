import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import apiClient from "../../../services/apiClient";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Course {
  _id: string;
  className: string;
  managers: string[];
}

export default function CourseManagerPage() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [managerUsers, setManagerUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load course & managers
  const fetchCourse = async () => {
    const res = await apiClient.get(`/courses/${courseId}`);
    setCourse(res.data.data);
  };

  const fetchUsers = async () => {
    const res = await apiClient.get("/users");
    setAllUsers(res.data);
  };

  useEffect(() => {
    fetchCourse();
    fetchUsers();
  }, []);

  // Update managerUsers after data loads
  useEffect(() => {
    if (course && Array.isArray(course.managers) && allUsers.length > 0) {
      const found = allUsers.filter((u) => course.managers.includes(u._id));
      setManagerUsers(found);
    }
  }, [course, allUsers]);

  const updateManagers = async (newManagerIds: string[]) => {
    await apiClient.put(`/courses/${courseId}`, {
      managers: newManagerIds,
    });
    fetchCourse(); // refresh local state
  };

  const handleAddManager = async (user: User) => {
    if (!course || course.managers.includes(user._id)) return;
  
    const updatedManagers = [...course.managers, user._id];
    await updateManagers(updatedManagers);
  
    setManagerUsers((prev) => [...prev, user]);
    setCourse({ ...course, managers: updatedManagers });
    setSearchTerm(""); // clear search input
  };  

  const handleConfirmDelete = async () => {
    if (!userToDelete || !course) return;
  
    const updated = course.managers.filter((id) => id !== userToDelete._id);
    await updateManagers(updated);
  
    setManagerUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
    setCourse({ ...course, managers: updated });
    setUserToDelete(null);
  };  

  const availableUsers = allUsers.filter(
    (u) =>
      !(course?.managers ?? []).includes(u._id) &&
      `${u.name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Managers for: {course?.className}</h1>

      {/* Add manager */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="border px-4 py-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <div className="mt-2 border rounded max-h-48 overflow-y-auto">
            {availableUsers.map((u) => (
              <div
                key={u._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddManager(u)}
              >
                {u.name} – {u.email}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manager list */}
      <table className="w-full table-auto border-t">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {managerUsers.map((u, idx) => (
            <tr key={u._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">
                <button onClick={() => setUserToDelete(u)}>
                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirm Delete Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Removal</h2>
            <p className="mb-4">
              Remove <strong>{userToDelete.name}</strong> (
              {userToDelete.email}) from this course’s managers?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setUserToDelete(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
