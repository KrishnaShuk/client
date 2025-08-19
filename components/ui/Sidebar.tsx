// client/components/ui/Sidebar.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import UserAuth from '@/components/ui/UserAuth';
import { motion, AnimatePresence } from 'framer-motion';

// Define the props the component will accept
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <div className="h-full bg-card flex flex-col p-2 relative">
      {/* Toggle button is now inside the sidebar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-3"
      >
        {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
      </Button>

      {/* AnimatePresence will handle the fading in/out of content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-2 mb-4 mt-12"> {/* mt-12 to make space for toggle button */}
              <Button variant="outline" className="w-full justify-start text-base font-normal">
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto">
              <h2 className="px-2 mb-2 text-sm font-semibold tracking-tight text-muted-foreground">
                Recents
              </h2>
              <div className="space-y-1 p-2">
                <Button variant="ghost" className="w-full justify-start font-normal">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Placeholder Chat 1
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* User Auth Section - always visible */}
      <UserAuth isOpen={isOpen} />
    </div>
  );
};

export default Sidebar;