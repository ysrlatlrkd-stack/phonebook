import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

interface ContactCardProps {
  id: string;
  name: string;
  phone: string;
  category?: string;
  memo?: string;
  avatar_url?: string;
  onDelete?: (id: string) => void;
}

export default function ContactCard({ id, name, phone, category, memo, avatar_url, onDelete }: ContactCardProps) {
  // Get first letter of name for avatar fallback
  const initial = name.charAt(0);

  return (
    <div className="ig-card p-4 flex items-center justify-between">
      <Link href={`/add?id=${id}`} className="flex items-center gap-3 flex-1">
        <div className="avatar">
          {avatar_url ? (
            <img 
              src={avatar_url} 
              alt={name} 
              className="w-full h-full object-cover rounded-full border-2 border-white dark:border-black"
            />
          ) : (
            <div className="avatar-inner">
              {initial}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{name}</h3>
            {category && (
              <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">
                {category}
              </span>
            )}
          </div>
          <p className="text-xs text-blue-500 font-medium">{phone}</p>
          {memo && <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{memo}</p>}
        </div>
      </Link>
      <button 
        onClick={(e) => {
          e.preventDefault();
          onDelete?.(id);
        }}
        className="text-gray-400 hover:text-red-500 transition-colors p-2"
      >
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
}
