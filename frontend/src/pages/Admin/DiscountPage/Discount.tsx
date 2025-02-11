import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Users, Layers } from 'lucide-react';

interface Discount {
  id: number;
  code: string;
  amount: number;
  date: string;
  time: string;
  timeZone: string;
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

const timeZones = [
  '(PST)',
  '(MST)',
  '(CST)',
  '(EST)',
  '(AKT)',
  '(HAT)',
];

const times = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = i % 24;
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${displayHour}:${minutes} ${period}`;
});

interface AddDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newDiscount: { code: string; amount: number; date: string; time: string; timeZone: string }) => void;
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [newDiscount, setNewDiscount] = useState({ code: '', amount: 0, date: '', time: '', timeZone: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd(newDiscount);
    setNewDiscount({ code: '', amount: 0, date: '', time: '', timeZone: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Discount</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newDiscount.code}
            onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
            className="border rounded-lg px-4 py-2 mb-4 w-full"
            placeholder="Discount Code"
            required
          />
          <input
            type="number"
            value={newDiscount.amount}
            onChange={(e) => setNewDiscount({ ...newDiscount, amount: parseFloat(e.target.value) })}
            className="border rounded-lg px-4 py-2 mb-4 w-full"
            placeholder="Amount"
            required
          />
          <input
            type="date"
            value={newDiscount.date}
            onChange={(e) => setNewDiscount({ ...newDiscount, date: e.target.value })}
            className="border rounded-lg px-4 py-2 mb-4 w-full"
            required
          />
          <select
            value={newDiscount.time}
            onChange={(e) => setNewDiscount({ ...newDiscount, time: e.target.value })}
            className="border rounded-lg px-4 py-2 mb-4 w-full"
            required
          >
            <option value="">Select Time</option>
            {times.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <select
            value={newDiscount.timeZone}
            onChange={(e) => setNewDiscount({ ...newDiscount, timeZone: e.target.value })}
            className="border rounded-lg px-4 py-2 mb-4 w-full"
            required
          >
            <option value="">Select Time Zone</option>
            {timeZones.map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-[#8757a3] text-white px-4 py-2 rounded-lg">Add Discount</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function DiscountsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [discounts, setDiscounts] = useState<Discount[]>([
    ...Array(8).fill(null).map((_, i) => ({
      id: i + 1,
      code: 'newmexico',
      amount: 25.00,
      date: '09/01/2023',
      time: '12:00 AM',
      timeZone: '(PST)',
      selected: false
    }))
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const itemHeight = 100; 
      const windowHeight = window.innerHeight;
      const headerHeight = 100;
      const footerHeight = 50;

      const availableHeight = windowHeight - headerHeight - footerHeight;
      const newItemsPerPage = Math.floor(availableHeight / itemHeight);
      setItemsPerPage(newItemsPerPage > 0 ? newItemsPerPage : 1);
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);

  const selectedCount = discounts.filter(d => d.selected).length;

  const toggleSelection = (id: number) => {
    setDiscounts(discounts.map(d => 
      d.id === id ? { ...d, selected: !d.selected } : d
    ));
  };

  const handleDelete = (id: number) => {
    setDiscounts(discounts.filter(d => d.id !== id));
  };

  const handleAddDiscount = (newDiscount: { code: string; amount: number; date: string; time: string; timeZone: string }) => {
    const newId = discounts.length ? Math.max(...discounts.map(d => d.id)) + 1 : 1;
    setDiscounts([...discounts, { id: newId, ...newDiscount, selected: false }]);
  };

  const totalPages = Math.ceil(discounts.length / itemsPerPage);
  const displayedDiscounts = discounts
    .filter(discount => discount.code.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={() => setIsModalOpen(true)}
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
                  <span className="text-gray-500">{discount.date} {discount.time} {discount.timeZone}</span>
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

      <AddDiscountModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddDiscount} 
      />
    </div>
  );
}