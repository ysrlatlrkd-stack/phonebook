"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { encrypt, decrypt } from "@/lib/crypto";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const categories = ["가족", "친구", "직장동료", "지인", "친척"];

function AddContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "지인",
    memo: "",
  });

  useEffect(() => {
    if (editId) {
      const fetchContact = async () => {
        try {
          const { data, error } = await supabase
            .from("contacts")
            .select("*")
            .eq("id", editId)
            .single();

          if (error) throw error;
          if (data) {
            setFormData({
              name: decrypt(data.name),
              phone: decrypt(data.phone),
              category: data.category || "지인",
              memo: data.memo || "",
            });
          }
        } catch (error) {
          console.error("Error fetching contact for edit:", error);
        } finally {
          setFetching(false);
        }
      };
      fetchContact();
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const encryptedName = encrypt(formData.name);
      const encryptedPhone = encrypt(formData.phone);

      let error;
      if (editId) {
        const { error: updateError } = await supabase
          .from("contacts")
          .update({
            name: encryptedName,
            phone: encryptedPhone,
            category: formData.category,
            memo: formData.memo,
          })
          .eq("id", editId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("contacts")
          .insert([
            {
              name: encryptedName,
              phone: encryptedPhone,
              category: formData.category,
              memo: formData.memo,
            },
          ]);
        error = insertError;
      }

      if (error) throw error;

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error saving contact:", error);
      alert("연락처 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{editId ? "연락처 수정" : "새 연락처"}</h1>
        <div className="w-10"></div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">이름</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="이름을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">전화번호</label>
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="010-0000-0000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">구분</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                  formData.category === cat
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-transparent text-gray-500 border-gray-200 dark:border-gray-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">메모</label>
          <textarea
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="w-full p-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="추가 정보를 입력하세요"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "저장 중..." : (
            <>
              <Save size={20} />
              연락처 저장
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function AddContactPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    }>
      <AddContactForm />
    </Suspense>
  );
}
