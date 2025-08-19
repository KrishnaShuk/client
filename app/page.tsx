// client/app/page.tsx
'use client';

import { useState } from 'react';
import Sidebar from "@/components/ui/Sidebar";
import { motion } from 'framer-motion';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Container with Width Animation */}
      <motion.div
        animate={{ width: isSidebarOpen ? "20%" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full"
      >
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 h-full p-6">
        <h1 className="text-2xl font-semibold">Main Content</h1>
        <p className="text-muted-foreground">The current opened file name will appear here.</p>
      </div>
    </main>
  );
}