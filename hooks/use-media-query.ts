// client/hooks/use-media-query.ts
'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook to check if a media query matches.
 * @param query The media query string (e.g., '(min-width: 768px)')
 * @returns boolean `true` if the query matches, `false` otherwise.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Ensure this code only runs on the client
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    
    // Update state whenever the media query match status changes
    const listener = () => {
      setMatches(media.matches);
    };

    // Set the initial state
    listener();
    
    // Add event listener for changes
    media.addEventListener('change', listener);

    // Cleanup function to remove the event listener
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}