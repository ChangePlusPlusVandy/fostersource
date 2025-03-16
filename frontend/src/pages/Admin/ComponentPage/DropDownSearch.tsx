import { Search } from "lucide-react";
import React, { useState } from "react";

interface SearchDropdownProps {
	options: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>; 
}

export default function SearchDropdown({ options, selected, setSelected }: SearchDropdownProps) {
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setSearch(value);
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowDropdown(value.length > 0);
  };

  const handleSelect = (option: string) => {
    setSelected(options => [...options, option]); 
    setSearch(option);
    setShowDropdown(false);
  };

  return (
    <div className="mb-6">
      <div className="relative w-full">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
          placeholder="Search courses..."
          className="w-full border p-2 rounded"
        />
        {showDropdown && (
          <ul 
            
            className="absolute w-full bg-white border rounded max-h-40 overflow-auto"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelect(option)}
                  className="p-2 cursor-pointer hover:text-white"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9C75B4")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  style={{}}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
        <div className="absolute right-0 top-0 bottom-0 flex items-center rounded-r-lg overflow-hidden">
          <div className="h-full px-4 flex items-center bg-[#9c74b4]">
            <Search className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
    
  );
};
