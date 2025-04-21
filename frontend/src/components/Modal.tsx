// components/ui/Modal.tsx
import React, { ReactNode, useEffect } from "react";
import { X } from "lucide-react"; // Optional, for an "X" icon

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	showCloseIcon?: boolean;
	children: ReactNode;
	className?: string;
	footer?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	showCloseIcon = false,
	children,
	className = "",
	footer,
}) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div
				className={`relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg ${className}`}
			>
				{/* Top right X button */}
				{showCloseIcon && (
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
					>
						<X className="w-5 h-5" />
					</button>
				)}

				{/* Optional title */}
				{title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

				{/* Main content */}
				<div>{children}</div>

				{/* Optional footer */}
				{footer && <div className="mt-6">{footer}</div>}
			</div>
		</div>
	);
};

export default Modal;
