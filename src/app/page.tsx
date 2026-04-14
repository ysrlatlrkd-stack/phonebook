"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/crypto";
import ContactCard from "@/components/ContactCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("contacts")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "전체") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      const decryptedData = (data || []).map((item: any) => ({
        ...item,
        name: decrypt(item.name),
        phone: decrypt(item.phone),
      }));

      setContacts(decryptedData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (id: string) => {
    if (!confirm("이 연락처를 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("contacts")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      
      // Refresh list
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold italic tracking-tight mb-6">Phonebook</h1>
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : contacts.length > 0 ? (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              id={contact.id}
              name={contact.name}
              phone={contact.phone}
              category={contact.category}
              memo={contact.memo}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-sm">연락처가 없습니다.</p>
            <p className="text-xs mt-1">새 연락처를 추가해 보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
