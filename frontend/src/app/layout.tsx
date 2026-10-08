import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Fireflies.ai Clone — AI Meeting Notes Platform",
  description: "AI Meeting Notes & Transcription Platform replicating Fireflies.ai post-meeting workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased flex h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 flex flex-col">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
