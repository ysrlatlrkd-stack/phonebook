"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/crypto";
import ContactCard from "@/components/ContactCard";
import SearchBar from "@/components/SearchBar";
import { Loader2 } from "lucide-react";
import { Contact } from "@/lib/types";

export default function SearchPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setContacts([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // NOTE: Because data is encrypted, we ideally need a blind index.
      // For this prototype, we'll fetch all and filter in memory, 
      // or use a specific search implementation if the scale allows.
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .is("deleted_at", null);

      if (error) throw error;

      const decryptedData = (data || []).map((item: Contact) => ({
        ...item,
        name: decrypt(item.name),
        phone: decrypt(item.phone),
      }));

      // Filter by query (Name or Phone partial match)
      const filtered = decryptedData.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.phone.includes(query)
      );

      setContacts(filtered);
    } catch (error) {
      console.error("Error searching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-6">
        <h1 className="text-xl font-bold mb-4">탐색</h1>
        <SearchBar onSearch={handleSearch} placeholder="이름 또는 전화번호로 검색" />
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-blue-500" size={24} />
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
              avatar_url={contact.avatar_url}
            />
          ))
        ) : searched ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xs">연락처를 검색해 보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
