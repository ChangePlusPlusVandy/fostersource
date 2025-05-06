import { useState, useRef, useEffect } from "react";
import React from "react";
import { ChevronDown, X } from "lucide-react";

interface CustomSelectBarProps {
  options: string[] | number[];
  defaultLabel?: string;
  width?: number; // in pixels
  onChange?: (value: string | number | null) => void;
}

export const CustomSelectBar: React.FC<CustomSelectBarProps> = ({
  options,
  defaultLabel = "Select",
  width = 160,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string | number) => {
    setSelected(value);
    setIsOpen(false);
    onChange?.(value);
  };

  const handleClear = () => {
    setSelected(null);
    onChange?.(null);
  };

  return (
    <div
      className="relative inline-block"
      style={{ width: `${width}px` }}
      ref={dropdownRef}
    >
      <div
        className="flex items-center justify-between rounded-lg border px-4 py-2.5 font-medium cursor-pointer"
        style={{ borderColor: "#6C6C6C", color: "#6C6C6C" }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="truncate">
          {selected || defaultLabel}
        </span>
        <div className="flex items-center gap-1">
          {selected && (
            <X
              className="w-4 h-4 text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // don't toggle dropdown
                handleClear();
              }}
            />
          )}
          <ChevronDown size={18} />
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 mt-1 w-full rounded-lg border bg-white shadow-md z-10"
          style={{ borderColor: "#6C6C6C" }}
        >
          {options.map((opt, idx) => (
            <button
              key={idx}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
