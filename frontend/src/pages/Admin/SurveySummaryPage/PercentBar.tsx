import React from "react";

interface PercentBarProps {
  percentage: number, 
  total: number
}

export default function PercentBar({ percentage, total }: PercentBarProps) {
  return (
    <div className="flex mb-2 space-x-1">
      <div className="w-9/12 bg-gray-200 rounded-full h-2.5 mt-1">
        <div
          className="bg-purple-600 h-2.5 rounded-full"
          style={{ backgroundColor: '#8757a3', width: `${percentage}%` }}
        ></div>
        
      </div>
      <div className="text-xs" style={{ color: '#8757a3' }}>{percentage}% ({total})</div>
    </div>
  );
};
