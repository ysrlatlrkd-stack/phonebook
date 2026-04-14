"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Specific handling for common errors
        if (error.message.includes('Email not confirmed')) {
          throw new Error('이메일 인증이 완료되지 않았습니다. 메일함을 확인하거나 Supabase 설정에서 이메일 인증을 꺼주세요.');
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('이메일 또는 비밀번호가 틀렸습니다.');
        }
        throw error;
      }

      if (data.session) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold italic tracking-tighter mb-8">Phonebook</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            required
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-sm text-sm focus:border-gray-400 outline-none"
          />
          <input
            required
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-sm text-sm focus:border-gray-400 outline-none"
          />
          
          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "로그인"}
          </button>
        </form>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <div className="text-center text-xs text-gray-500 py-4">또는</div>

        <div className="border border-gray-200 dark:border-zinc-800 p-6 text-center text-sm">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-blue-500 font-bold">
            가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}
