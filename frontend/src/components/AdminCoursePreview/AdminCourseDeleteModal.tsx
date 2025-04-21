import { useEffect, useState } from "react";
import {
    Trash2,
} from "lucide-react";
import apiClient from "../../services/apiClient";

function AdminCourseDeleteModal({
    isOpen,
    id,
    onClose,
    refreshCourses
}: {
    isOpen: boolean;
    id: string | string[];
    onClose: () => void;
    refreshCourses: () => void;
}) {

    const [modalOpen, setModalOpen] = useState<boolean>(isOpen)

    useEffect(() => {
        setModalOpen(isOpen);
    }, [isOpen]);


    if (!isOpen || !id) return null;


    const handleDelete = async () => {
        try { 
            if (Array.isArray(id)) {
                for (let i = 0; i < id.length; i++) {
                    
                    await apiClient.delete(`/courses/${id[i]}`);

                }
            } else {
                await apiClient.delete(`/courses/${id}`);
            }
            await refreshCourses();
            onClose();
        } catch (e) {
            console.log("Error deleting course", e);
        }
    };

    return (
        <div>
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => {setModalOpen(false); onClose();}}>
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div
                            className="w-[200px] h-[200px] flex flex-col items-center justify-center bg-white overflow-auto border rounded-md p-5 md:p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash2 className="w-10 h-10 text-red-600" />
                            <h1 className="mt-3">Confirm Delete?</h1>
                            <div className="flex flex-row gap-2 mt-3">
                                <button
                                    className="border bg-white border-[#8757a3] text-[#8757a3] text-sm w-20 rounded-md"
                                    onClick={() => {setModalOpen(false); onClose();}}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="border bg-[#8757a3] text-white text-sm w-20 rounded-md"
                                    onClick={() => {handleDelete(); onClose();}}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default AdminCourseDeleteModal