import { useEffect, useState } from "react";
import {
    Trash2,
} from "lucide-react";
import apiClient from "../../services/apiClient";
import Modal from "../Modal";

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Delete?"
            showCloseIcon
            className="w-[200px] h-[200px]"
            footer={
                <div className="flex flex-row gap-2 mt-3">
                    <button
                        className="border bg-white border-[#8757a3] text-[#8757a3] text-sm w-20 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="border bg-[#8757a3] text-white text-sm w-20 rounded-md"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            }
        >
            <div className="flex flex-col items-center justify-center">
                <Trash2 className="w-10 h-10 text-red-600" />
            </div>
        </Modal>
    );
}

export default AdminCourseDeleteModal