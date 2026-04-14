import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "Phonebook - Instagram Style",
  description: "Secure Phonebook Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthProvider>
          <main className="container">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
