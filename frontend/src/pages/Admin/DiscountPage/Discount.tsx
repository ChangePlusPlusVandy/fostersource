import React, { useState } from 'react';
import { Search, Edit2, Trash2, Users, Layers } from 'lucide-react';

interface Discount {
  id: number;
  code: string;
  amount: number;
  date: string;
  selected: boolean;
}

const Pagination = ({ 
  currentPage = 1,
  totalPages = 1,
  onPageChange = (page: number) => console.log(page)
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center rounded-lg border bg-white overflow-hidden shadow-sm">
      <button 
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
        aria-label="First page"
      >
        &#171;
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
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
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400"
        aria-label="Last page"
      >
        &#187;
      </button>
    </div>
  );
};

export default function DiscountsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page
  const [discounts, setDiscounts] = useState<Discount[]>([
    ...Array(8).fill(null).map((_, i) => ({
      id: i + 1,
      code: 'newmexico',
      amount: 25.00,
      date: '09/01/2023 - 1:00AM (CDT)',
      selected: false
    }))
  ]);

  const selectedCount = discounts.filter(d => d.selected).length;

  const toggleSelection = (id: number) => {
    setDiscounts(discounts.map(d => 
      d.id === id ? { ...d, selected: !d.selected } : d
    ));
  };

  const handleDelete = (id: number) => {
    setDiscounts(discounts.filter(d => d.id !== id));
  };

  const totalPages = Math.ceil(discounts.length / itemsPerPage);
  const displayedDiscounts = discounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="max-w-screen-2xl mx-auto px-8 py-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Discounts</h1>
          </div>

          <div className="mb-6">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full pl-4 pr-16 py-3 rounded-lg border bg-white text-gray-800 placeholder-gray-400"
                placeholder="Search discounts..."
              />
              <div className="absolute right-0 top-0 bottom-0 flex items-center rounded-r-lg overflow-hidden">
                <div className="h-full px-4 flex items-center bg-[#9c74b4]">
                  <Search className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <span style={{ color: '#8757a3' }}>{selectedCount} Selected</span>
              <button 
                className="text-red-600 font-bold" 
                onClick={() => setDiscounts(discounts.filter(d => !d.selected))}
              >
                Delete
              </button>
            </div>
            <button 
              className="text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90"
              style={{ backgroundColor: '#8757a3' }}
            >
              Add Discount
            </button>
          </div>

          <div className="space-y-3">
            {displayedDiscounts.map((discount) => (
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
                    <button onClick={() => handleDelete(discount.id)}>
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}