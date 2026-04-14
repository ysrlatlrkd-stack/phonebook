"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "홈", path: "/" },
  { icon: Search, label: "검색", path: "/search" },
  { icon: PlusSquare, label: "추가", path: "/add" },
  { icon: User, label: "프로필", path: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path || (item.path !== "/" && pathname?.startsWith(item.path));
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          </Link>
        );
      })}
    </nav>
  );
}
