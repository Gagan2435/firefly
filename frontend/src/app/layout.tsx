import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Fireflies.ai — AI Meeting Notes Platform",
  description: "Replicate the exact Fireflies.ai meeting experience: interactive transcripts, AI summaries, and automated post-meeting workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased flex flex-col h-screen overflow-hidden bg-[#0E0E12] text-gray-100 select-none">
        <AnnouncementBanner />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-[#0E0E12] flex flex-col">
            {children}
          </main>
        </div>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#1A1A20',
              color: '#F3F4F6',
              border: '1px solid #282834',
              fontSize: '12px',
              borderRadius: '12px'
            }
          }}
        />
      </body>
    </html>
  );
}
