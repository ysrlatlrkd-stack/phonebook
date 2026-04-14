"use client";

const categories = ["전체", "가족", "친구", "직장동료", "지인", "친척"];

interface CategoryFilterProps {
  selected?: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selected = "전체", onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
            selected === cat
              ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
              : "bg-transparent text-gray-500 border-gray-200 dark:border-gray-800"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
