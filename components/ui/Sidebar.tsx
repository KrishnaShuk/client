// client/components/ui/Sidebar.tsx
'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import UserAuth from '@/components/ui/UserAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have this utility

interface SidebarProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  className?: string;
}

const Sidebar = ({ isOpen, onToggle, className }: SidebarProps) => {
  const handleToggle = useCallback(() => {
    onToggle(!isOpen);
  }, [isOpen, onToggle]);

  const handleNewChat = useCallback(() => {
    // Add new chat logic here
    console.log('Creating new chat...');
  }, []);

  return (
    <aside 
      className={cn("h-full flex flex-col p-2 relative", className)}
      aria-label="Navigation sidebar"
    >
      {/* Toggle Button */}
      <div className="flex justify-start mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          className="hover:bg-accent transition-colors"
        >
          {isOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Expandable Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="sidebar-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col h-full min-h-0"
            >
              {/* New Chat Button */}
              <Button 
                variant="default" 
                className="w-full justify-start text-sm font-medium mb-4 h-9"
                onClick={handleNewChat}
                aria-label="Create new chat"
              >
                <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">New Chat</span>
              </Button>

              {/* Chat History */}
              <div className="flex-1 overflow-hidden">
                <h2 className="px-2 mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Recent Chats
                </h2>
                <nav className="space-y-1 overflow-y-auto max-h-full" role="navigation">
                  {/* Placeholder for chat items - replace with actual data */}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start font-normal text-sm h-9 px-2"
                    aria-label="Open chat: Placeholder Chat 1"
                  >
                    <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate text-left">Placeholder Chat 1</span>
                  </Button>
                  {/* Add more chat items here */}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Authentication - Always visible */}
      <div className="mt-auto pt-2">
        <UserAuth isOpen={isOpen} />
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
