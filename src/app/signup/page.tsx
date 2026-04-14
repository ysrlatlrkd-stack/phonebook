"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Password should be')) {
          throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
        }
        throw error;
      }

      if (data.user && data.session) {
        alert("회원가입 및 로그인이 완료되었습니다!");
        router.push("/");
      } else {
        alert("회원가입 신청이 완료되었습니다! 만약 로그인이 안 된다면 이메일 인증을 확인하거나 Supabase 설정에서 인증을 꺼주세요.");
        router.push("/login");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold italic tracking-tighter mb-2">Phonebook</h1>
          <p className="text-gray-500 text-sm font-semibold">친구들의 연락처를 안전하게 보관하세요.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
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
            {loading ? <Loader2 className="animate-spin" size={18} /> : "가입하기"}
          </button>
        </form>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <div className="border border-gray-200 dark:border-zinc-800 p-6 text-center text-sm">
          계정이 있으신가요?{" "}
          <Link href="/login" className="text-blue-500 font-bold">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
