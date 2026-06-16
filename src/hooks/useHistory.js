import { useState } from 'react';

const STORAGE_KEY = 'rodtally_history';
const MAX_ENTRIES = 10;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState(loadHistory);

  function addSession(session) {
    setHistory(prev => {
      const updated = [session, ...prev].slice(0, MAX_ENTRIES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage may be full — fail silently
      }
      return updated;
    });
  }

  return { history, addSession };
}
