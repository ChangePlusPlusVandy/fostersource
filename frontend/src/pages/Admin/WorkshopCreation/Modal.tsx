import React from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                {/* Close Button (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                >
                    ✖
                </button>

                {/* Title */}
                {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

                {/* Content */}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
