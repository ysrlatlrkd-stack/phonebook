"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "검색..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms debouncing

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-0 placeholder-gray-500"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
