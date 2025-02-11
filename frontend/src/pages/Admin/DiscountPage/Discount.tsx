import React, { useState } from 'react';
import { Search, Edit2, Trash2, Users, Layers } from 'lucide-react';

interface Discount {
  id: number;
  code: string;
  amount: number;
  date: string;
  selected: boolean;
}

// Pagination component remains the same
const Pagination = ({ 
  currentPage = 1,
  totalPages = 2,
  onPageChange = (page: number) => console.log(page)
}) => {
  // ... existing Pagination code ...
  return (
    <div className="flex items-center rounded-full border bg-white overflow-hidden shadow-sm">
      <button 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
        aria-label="First page"
      >
        &#171;
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 min-w-[40px] ${
            currentPage === page 
              ? 'text-white bg-[#8757a3]' 
              : 'hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
        aria-label="Last page"
      >
        &#187;
      </button>
    </div>
  );
};

const ResizeButton = ({ isExpanded, onClick }: { isExpanded: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="border rounded p-1.5 hover:bg-gray-50 transition-colors"
    aria-label={isExpanded ? "Collapse view" : "Expand view"}
  >
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
    >
      <path 
        d="M1 15L15 15M1 1L15 1M3.5 3.5L1 1M3.5 3.5L1 6M3.5 3.5L6 1M12.5 3.5L15 1M12.5 3.5L15 6M12.5 3.5L10 1M3.5 12.5L1 15M3.5 12.5L1 10M3.5 12.5L6 15M12.5 12.5L15 15M12.5 12.5L15 10M12.5 12.5L10 15" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  </button>
);

export default function DiscountsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([
    ...Array(8).fill(null).map((_, i) => ({
      id: i + 1,
      code: 'newmexico',
      amount: 25.00,
      date: '09/01/2023 - 1:00AM (CDT)',
      selected: i < 3
    }))
  ]);

  const selectedCount = discounts.filter(d => d.selected).length;

  const toggleSelection = (id: number) => {
    setDiscounts(discounts.map(d => 
      d.id === id ? { ...d, selected: !d.selected } : d
    ));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`w-full min-h-screen bg-gray-100 ${isExpanded ? 'p-0' : ''}`}>
      <div className={`transition-all duration-300 ${
        isExpanded ? 'max-w-none m-0' : 'max-w-screen-2xl mx-auto px-8'
      } py-6`}>
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Discounts</h1>
            <ResizeButton isExpanded={isExpanded} onClick={toggleExpand} />
          </div>

          <div className="mb-6">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full p-3 border rounded-lg bg-white text-gray-400"
                placeholder="Search discounts..."
              />
              <Search className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <span style={{ color: '#8757a3' }}>{selectedCount} Selected</span>
              <button className="text-red-500">Delete</button>
            </div>
            <button 
              className="text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90"
              style={{ backgroundColor: '#8757a3' }}
            >
              Add Discount
            </button>
          </div>

          <div className="space-y-3">
            {discounts.map((discount) => (
              <div
                key={discount.id}
                className={`flex items-center justify-between w-full p-4 rounded-lg border`}
                style={{
                  backgroundColor: discount.selected ? '#f5f0f7' : 'white'
                }}
              >
                <div className="flex items-center space-x-8 flex-1">
                  <input
                    type="checkbox"
                    checked={discount.selected}
                    onChange={() => toggleSelection(discount.id)}
                    className="w-5 h-5"
                    style={{ accentColor: '#8757a3' }}
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{discount.code}</span>
                    <div className="flex items-center gap-1">
                      <div className="p-1 rounded-full" style={{ backgroundColor: '#8757a3' }}>
                        <Users className="w-3 h-3 text-white" />
                      </div>
                      <div className="p-1 rounded-full" style={{ backgroundColor: '#8757a3' }}>
                        <Layers className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <span className="font-medium">${discount.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-end space-x-8 flex-1">
                  <span className="text-gray-500">{discount.date}</span>
                  <div className="flex gap-4">
                    <button><Edit2 className="w-4 h-4 text-gray-400" /></button>
                    <button><Trash2 className="w-4 h-4 text-gray-400" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Pagination 
              currentPage={currentPage}
              totalPages={2}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}