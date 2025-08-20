'use client';

import { useState, useCallback } from 'react';
import Sidebar from "@/components/ui/Sidebar";
import { motion } from 'framer-motion';
import FileUpload from '@/components/ui/FileUpload';

// Constants for better maintainability
const SIDEBAR_WIDTH = {
  open: 256, // 16rem
  closed: 72  // 4.5rem
};

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = useCallback((isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  }, []);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Animated Sidebar Container */}
      <motion.div
        animate={{ 
          width: isSidebarOpen ? SIDEBAR_WIDTH.open : SIDEBAR_WIDTH.closed 
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.4, 0.0, 0.2, 1] // Custom easing for smoother animation
        }}
        className="h-full bg-card border-r border-border flex-shrink-0"
      >
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={handleSidebarToggle}
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {/* This is where the FileUpload or ChatView will go */}
          <FileUpload /> {/* <-- 2. RENDER THE COMPONENT */}
        </div>
      </div>
    </main>
  );
}
