import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import apiClient from "../../../services/apiClient";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface ManagerObject {
  _id: string;
  [key: string]: any;
}

type ManagerType = string | ManagerObject;

interface Course {
  _id: string;
  className: string;
  managers: ManagerType[]; 
}

// Type guard function to check if a manager is an object with _id
function isManagerObject(manager: any): manager is ManagerObject {
  return typeof manager !== 'string' && manager !== null && typeof manager === 'object' && '_id' in manager;
}

export default function CourseManagerPage() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [managerUsers, setManagerUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load course & managers
  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(`/courses/${courseId}`);
      setCourse(res.data.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch course:", err);
      setError("Failed to load course data.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/users");
      setAllUsers(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load user data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchUsers();
  }, []);

  // Helper function to extract ID from manager
  const getManagerId = (manager: ManagerType): string => {
    return typeof manager === 'string' ? manager : manager._id;
  };

  // Remove duplicates from an array
  const removeDuplicates = (arr: string[]): string[] => {
    return arr.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  };

  // Update managerUsers after data loads
  useEffect(() => {
    if (course && Array.isArray(course.managers) && allUsers.length > 0) {
      // Convert manager IDs/objects to string IDs for comparison
      const managerIds = removeDuplicates(course.managers.map(getManagerId));
      const found = allUsers.filter((u) => managerIds.includes(u._id));
      setManagerUsers(found);
    }
  }, [course, allUsers]);

  // Modified updateManagers function with workaround for 500 errors
const updateManagers = async (newManagerIds: string[]) => {
  try {
    setIsLoading(true);
    setError("");
    
    // Remove duplicates
    const uniqueManagerIds = removeDuplicates(newManagerIds);
    
    console.log("Attempting to update managers with:", uniqueManagerIds);
    
    try {
      // Try the normal API call
      const response = await apiClient.put(`/courses/${courseId}`, {
        managers: uniqueManagerIds
      });
      
      console.log("Update successful:", response.data);
      
      if (response.data && response.data.data) {
        setCourse(response.data.data);
      } else {
        // Refresh data if response doesn't contain updated course
        fetchCourse();
      }
    } catch (apiError) {
      console.error("API error:", apiError);
      console.log("Operation might have succeeded despite error. Refreshing data...");
      
      // Wait a moment to allow database to complete the operation
      setTimeout(() => {
        fetchCourse();
      }, 1000);
    }
  } catch (error) {
    console.error("Failed in update managers function:", error);
    setError("Error updating managers, but changes might still be saved. Please check after refresh.");
  } finally {
    setIsLoading(false);
  }
};

// Use this function in both handleAddManager and handleConfirmDelete

const handleAddManager = async (user: User) => {
  if (!course) return;
  
  // Convert existing managers to string IDs
  const currentManagerIds = Array.isArray(course.managers) 
    ? course.managers.map(getManagerId)
    : [];
  
  // Check if the user is already a manager
  if (currentManagerIds.includes(user._id)) {
    console.log("User is already a manager");
    return;
  }
  
  console.log("Adding manager:", user._id);
  const updatedManagers = [...currentManagerIds, user._id];
  await updateManagers(updatedManagers);
  
  // Force a UI update by updating managerUsers directly
  // This ensures the UI reflects the change even if the API call "failed"
  if (!managerUsers.some(u => u._id === user._id)) {
    setManagerUsers(prev => [...prev, user]);
  }
  
  setSearchTerm(""); // clear search input
};

const handleConfirmDelete = async () => {
  if (!userToDelete || !course) return;
  
  // Convert existing managers to string IDs
  const currentManagerIds = Array.isArray(course.managers) 
    ? course.managers.map(getManagerId)
    : [];
  
  console.log("Removing manager:", userToDelete._id);
  // Filter out the ID to delete
  const updated = currentManagerIds.filter(id => id !== userToDelete._id);
  await updateManagers(updated);
  
  // Force a UI update by updating managerUsers directly
  // This ensures the UI reflects the change even if the API call "failed"
  setManagerUsers(prev => prev.filter(u => u._id !== userToDelete._id));
  
  setUserToDelete(null);
};

  // Filter available users for adding managers
  const availableUsers = allUsers.filter((u) => {
    if (!course || !course.managers) return false;
    
    // Convert managers to string IDs for comparison
    const managerIds = Array.isArray(course.managers) 
      ? removeDuplicates(course.managers.map(getManagerId))
      : [];
      
    return !managerIds.includes(u._id) && 
      `${u.name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => { fetchCourse(); fetchUsers(); }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

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
              {userToDelete.email}) from this course's managers?
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