import React, { useState } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange = (page: number) => console.log(page)
}) => {
    const [showDropdown, setShowDropdown] = useState<number | null>(null);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            setShowDropdown(null);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-4 py-2 min-w-[40px] ${currentPage === i ? 'text-white bg-[#8757a3] rounded-lg' : 'hover:bg-gray-50'}`}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            pageNumbers.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`px-4 py-2 min-w-[40px] ${currentPage === 1 ? 'text-white bg-[#8757a3] rounded-lg' : 'hover:bg-gray-50'}`}
                >
                    1
                </button>
            );

            if (currentPage > 2) {
                pageNumbers.push(
                    <div key="ellipsis-1" className="relative">
                        <button onClick={() => setShowDropdown(1)} className="px-4 py-2">...</button>
                        {showDropdown === 1 && (
                            <div className="absolute bg-white shadow-md border rounded-md p-2">
                                {Array.from({ length: currentPage - 2 }, (_, i) => (
                                    <button
                                        key={i + 2}
                                        onClick={() => handlePageChange(i + 2)}
                                        className="block w-full px-4 py-2 hover:bg-gray-100"
                                    >
                                        {i + 2}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }

            let startPage = Math.max(2, currentPage);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-4 py-2 min-w-[40px] ${currentPage === i ? 'text-white bg-[#8757a3] rounded-lg' : 'hover:bg-gray-50'}`}
                    >
                        {i}
                    </button>
                );
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push(
                    <div key="ellipsis-2" className="relative">
                        <button onClick={() => setShowDropdown(2)} className="px-4 py-2">...</button>
                        {showDropdown === 2 && (
                            <div className="absolute bg-white shadow-md border rounded-md p-2">
                                {Array.from({ length: totalPages - (currentPage + 2) }, (_, i) => (
                                    <button
                                        key={currentPage + 2 + i}
                                        onClick={() => handlePageChange(currentPage + 2 + i)}
                                        className="block w-full px-4 py-2 hover:bg-gray-100"
                                    >
                                        {currentPage + 2 + i}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }

            pageNumbers.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-4 py-2 min-w-[40px] ${currentPage === totalPages ? 'text-white bg-[#8757a3] rounded-lg' : 'hover:bg-gray-50'}`}
                >
                    {totalPages}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="flex items-center rounded-lg border bg-white overflow-hidden shadow-sm relative">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
                aria-label="Previous page"
            >
                &#171;
            </button>

            {renderPageNumbers()}

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
                aria-label="Next page"
            >
                &#187;
            </button>
        </div>
    );
}; 