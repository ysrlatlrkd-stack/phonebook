"use client";

import { User, ShieldCheck, Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 border-2 border-gray-200 dark:border-gray-800">
          <User size={48} className="text-gray-400" />
        </div>
        <h1 className="text-xl font-bold">내 프로필</h1>
        <p className="text-sm text-gray-500">{user?.email || "사용자"}</p>
      </header>

      <div className="space-y-4">
        <div className="ig-card p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
          <ShieldCheck className="text-green-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold">보안 설정</p>
            <p className="text-xs text-gray-500">데이터 암호화 및 RLS 활성화됨</p>
          </div>
        </div>

        <div className="ig-card p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
          <Settings className="text-gray-600 dark:text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold">설정</p>
            <p className="text-xs text-gray-500">알림 및 앱 기본 설정</p>
          </div>
        </div>

        <div 
          onClick={handleLogout}
          className="ig-card p-4 flex items-center gap-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer mt-8"
        >
          <LogOut size={20} />
          <p className="text-sm font-semibold">로그아웃</p>
        </div>
      </div>
      
      <footer className="mt-12 text-center">
        <p className="text-[10px] text-gray-400">Version 1.0.0 - Secure Phonebook</p>
      </footer>
    </div>
  );
}
