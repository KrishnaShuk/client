// client/lib/store.ts
import { create } from 'zustand';
import { ChatRoom, Message } from './api';
import { useApi } from '@/hooks/use-api'; // We need this to make API calls from our actions

// Define the shape of our application's state
export interface AppState {
  chatRooms: ChatRoom[];
  activeChatRoomId: string | null;
  messages: Message[];
  uploadStatus: 'idle' | 'uploading' | 'processing' | 'failed' | 'success';
  isLoadingChatRooms: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean; // To track when the AI is replying

  // Define the actions (functions) that can modify the state
  actions: {
    fetchChatRooms: (api: ReturnType<typeof useApi>) => Promise<void>;
    setActiveChatRoomId: (id: string | null, api: ReturnType<typeof useApi>) => void;
    uploadAndTrackDocument: (file: File, api: ReturnType<typeof useApi>) => Promise<void>;
    postMessage: (chatRoomId: string, message: string, api: ReturnType<typeof useApi>) => Promise<void>;
  };
}

// Create the store
const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  chatRooms: [],
  activeChatRoomId: null,
  messages: [],
  uploadStatus: 'idle',
  isLoadingChatRooms: true,
  isLoadingMessages: false,
  isSendingMessage: false,

  // Actions implementation
  actions: {
    // Fetches all chat rooms
    fetchChatRooms: async (api) => {
      set({ isLoadingChatRooms: true });
      try {
        const rooms = await api.getChatRooms();
        set({ chatRooms: rooms, isLoadingChatRooms: false });
      } catch (error) {
        console.error("Failed to fetch chat rooms in store:", error);
        set({ isLoadingChatRooms: false });
      }
    },

    // Sets the active chat and fetches its messages
    setActiveChatRoomId: async (id, api) => {
      if (get().activeChatRoomId === id) return; // Don't re-fetch if already active
      
      set({ activeChatRoomId: id, messages: [], isLoadingMessages: true });
      if (id) {
        try {
          const fetchedMessages = await api.getMessages(id);
          set({ messages: fetchedMessages });
        } catch (error) {
          console.error("Failed to fetch messages in store:", error);
        } finally {
          set({ isLoadingMessages: false });
        }
      } else {
        set({ isLoadingMessages: false }); // No messages to load if ID is null
      }
    },
    
    // Posts a new message and updates the state with the AI response
    postMessage: async (chatRoomId, message, api) => {
       const userMessage: Message = { _id: `temp_user_${Date.now()}`, chatRoomId, role: 'user', content: message, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
       set((state) => ({ messages: [...state.messages, userMessage], isSendingMessage: true }));

       try {
         const aiResponse = await api.postMessage(chatRoomId, message);
         // Replace temp message with real one and add AI response
         set((state) => ({
           messages: [...state.messages.filter(m => m._id !== userMessage._id), userMessage, aiResponse],
         }));
       } catch (error) {
         console.error("Failed to post message in store:", error);
         const errorMessage: Message = { _id: `err_${Date.now()}`, chatRoomId, role: 'assistant', content: "Sorry, an error occurred. Please try again.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
         set((state) => ({ messages: [...state.messages.filter(m => m._id !== userMessage._id), userMessage, errorMessage] }));
       } finally {
         set({ isSendingMessage: false });
       }
    },

    // Handles the file upload and tracking (to be implemented)
    uploadAndTrackDocument: async (file, api) => {
      // We will build this logic in the next step
      console.log("Uploading file:", file.name);
    },
  },
}));

// Export hooks for easy access to state and actions
export const useChatRooms = () => useAppStore((state) => state.chatRooms);
export const useActiveChatRoomId = () => useAppStore((state) => state.activeChatRoomId);
export const useMessages = () => useAppStore((state) => state.messages);
export const useIsLoadingChatRooms = () => useAppStore((state) => state.isLoadingChatRooms);
export const useIsLoadingMessages = () => useAppStore((state) => state.isLoadingMessages);
export const useIsSendingMessage = () => useAppStore((state) => state.isSendingMessage);
export const useAppActions = () => useAppStore((state) => state.actions);

export default useAppStore;