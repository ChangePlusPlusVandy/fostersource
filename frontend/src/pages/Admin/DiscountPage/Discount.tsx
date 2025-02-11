import React, { useState } from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';

interface Discount {
  id: number;
  code: string;
  amount: number;
  date: string;
  selected: boolean;
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([
    ...Array(8).fill(null).map((_, i) => ({
      id: i + 1,
      code: 'newmexico',
      amount: 25.00,
      date: '09/01/2023 - 1:00AM (CDT)',
      selected: i === 0
    }))
  ]);

  const selectedCount = discounts.filter(d => d.selected).length;

  const toggleSelection = (id: number) => {
    setDiscounts(discounts.map(d => 
      d.id === id ? { ...d, selected: !d.selected } : d
    ));
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="max-w-screen-2xl mx-auto px-8 py-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Discounts</h1>
            <button className="border rounded p-1">
              <svg className="w-4 h-4" viewBox="0 0 16 16">
                <path d="M3 3h10v10H3z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M13 3v10M3 3v10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
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
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full text-white"
                      style={{ 
                        backgroundColor: '#8757a3'
                      }}
                    >%</span>
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

          <div className="flex justify-end gap-2 mt-6">
            <button className="p-2 border rounded-lg">&lt;</button>
            <button 
              className="p-2 text-white rounded-lg"
              style={{ backgroundColor: '#8757a3' }}
            >1</button>
            <button className="p-2 border rounded-lg">2</button>
            <button className="p-2 border rounded-lg">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}