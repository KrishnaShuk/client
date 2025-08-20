// client/lib/store.ts
import { create } from 'zustand';
import { ChatRoom, Message } from './api';
import { useApi } from '@/hooks/use-api';

export interface AppState {
  chatRooms: ChatRoom[];
  activeChatRoomId: string | null;
  messages: Message[];
  uploadStatus: 'idle' | 'uploading' | 'processing' | 'failed' | 'success';
  isLoadingChatRooms: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;

  actions: {
    fetchChatRooms: (api: ReturnType<typeof useApi>) => Promise<void>;
    setActiveChatRoomId: (id: string | null, api: ReturnType<typeof useApi>) => Promise<void>;
    uploadAndTrackDocument: (file: File, api: ReturnType<typeof useApi>) => Promise<void>;
    postMessage: (chatRoomId: string, message: string, api: ReturnType<typeof useApi>) => Promise<void>;
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  chatRooms: [],
  activeChatRoomId: null,
  messages: [],
  uploadStatus: 'idle',
  isLoadingChatRooms: true,
  isLoadingMessages: false,
  isSendingMessage: false,

  actions: {
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

    setActiveChatRoomId: async (id, api) => {
      if (get().activeChatRoomId === id) return;
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
        set({ isLoadingMessages: false });
      }
    },
    
    postMessage: async (chatRoomId, message, api) => {
       const userMessage: Message = { _id: `temp_${Date.now()}`, chatRoomId, role: 'user', content: message, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
       set((state) => ({ messages: [...state.messages, userMessage], isSendingMessage: true }));
       try {
         const aiResponse = await api.postMessage(chatRoomId, message);
         set((state) => ({ messages: [...state.messages.filter(m => m._id !== userMessage._id), userMessage, aiResponse] }));
       } catch (error) {
         console.error("Failed to post message in store:", error);
       } finally {
         set({ isSendingMessage: false });
       }
    },

    // --- REWRITTEN ACTION ---
    uploadAndTrackDocument: async (file, api) => {
      set({ uploadStatus: 'uploading' });

      const tempId = `temp_${Date.now()}`;
      const placeholderRoom = {
        _id: tempId,
        title: file.name,
        status: 'PROCESSING',
      } as unknown as ChatRoom;

      set(state => ({
        chatRooms: [placeholderRoom, ...state.chatRooms],
      }));

      try {
        const { documentId } = await api.uploadPdf(file);
        if (!documentId) throw new Error("Upload failed, no document ID returned.");

        set({ uploadStatus: 'processing' });

        const pollStatus = async () => {
          try {
            const { status } = await api.getDocumentStatus(documentId);

            if (status === 'COMPLETED') {
              await get().actions.fetchChatRooms(api);
              set({ uploadStatus: 'success' });
              setTimeout(() => set({ uploadStatus: 'idle' }), 3000);
            } else if (status === 'FAILED') {
              set(state => ({
                chatRooms: state.chatRooms.filter(room => room._id !== tempId),
                uploadStatus: 'failed',
              }));
              setTimeout(() => set({ uploadStatus: 'idle' }), 3000);
            } else {
              setTimeout(pollStatus, 2000); // Poll again
            }
          } catch (pollError) {
             console.error("Polling failed:", pollError);
             set(state => ({
                chatRooms: state.chatRooms.filter(room => room._id !== tempId),
                uploadStatus: 'failed',
              }));
             setTimeout(() => set({ uploadStatus: 'idle' }), 3000);
          }
        };

        setTimeout(pollStatus, 2000);

      } catch (uploadError) {
        console.error("Upload failed in store:", uploadError);
        set(state => ({
          chatRooms: state.chatRooms.filter(room => room._id !== tempId),
          uploadStatus: 'failed',
        }));
        setTimeout(() => set({ uploadStatus: 'idle' }), 3000);
      }
    },
  },
}));

// --- EXPORT CUSTOM HOOKS (Unchanged) ---
export const useChatRooms = () => useAppStore((state) => state.chatRooms);
export const useActiveChatRoomId = () => useAppStore((state) => state.activeChatRoomId);
// ... etc. (rest of the hooks are the same)
export const useMessages = () => useAppStore((state) => state.messages);
export const useUploadStatus = () => useAppStore((state) => state.uploadStatus);
export const useIsLoadingChatRooms = () => useAppStore((state) => state.isLoadingChatRooms);
export const useIsLoadingMessages = () => useAppStore((state) => state.isLoadingMessages);
export const useIsSendingMessage = () => useAppStore((state) => state.isSendingMessage);
export const useAppActions = () => useAppStore((state) => state.actions);