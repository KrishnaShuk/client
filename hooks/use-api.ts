// client/hooks/use-api.ts
'use client';

import { useAuth } from '@clerk/nextjs';
import { useState, useEffect, useMemo } from 'react';
import * as api from '@/lib/api'; // Import all functions from our api service

// Keep the existing useMediaQuery hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// --- NEW: The useApi Hook ---
export const useApi = () => {
  const { getToken } = useAuth();

  // useMemo ensures that our apiService object is stable and doesn't get
  // recreated on every render, which is good for performance.
  const apiService = useMemo(() => {
    // A wrapper function that gets a fresh token and calls the original api function
    const callWithToken = async <T extends any[], R>(
      func: (token: string, ...args: T) => Promise<R>,
      ...args: T
    ): Promise<R> => {
      const token = await getToken();
      if (!token) {
        throw new Error('User is not authenticated.');
      }
      return func(token, ...args);
    };

    // Return an object that mirrors our api.ts but with the token logic built-in
    return {
      getChatRooms: () => callWithToken(api.getChatRooms),
      uploadPdf: (file: File) => callWithToken(api.uploadPdf, file),
      getMessages: (chatRoomId: string) => callWithToken(api.getMessages, chatRoomId),
      postMessage: (chatRoomId: string, message: string) => callWithToken(api.postMessage, chatRoomId, message),
    };
  }, [getToken]);

  return apiService;
};