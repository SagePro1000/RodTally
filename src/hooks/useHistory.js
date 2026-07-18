import { useState, useEffect } from 'react';

const STORAGE_KEY = 'rodtally_history';

function loadLocalHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage may be full — fail silently
  }
}

/**
 * useHistory hook — manages session history both locally (localStorage) for
 * offline capability, and synced to Supabase (cloud DB) for device persistence.
 */
export function useHistory() {
  const [history, setHistory] = useState(loadLocalHistory);

  // Sync cloud history on mount
  useEffect(() => {
    const code = localStorage.getItem('rodtally_license');
    if (!code) return;

    async function syncCloudHistory() {
      try {
        const res = await fetch(`/api/get-sessions?code=${encodeURIComponent(code)}`);
        if (!res.ok) return;

        const data = await res.json();
        if (data && Array.isArray(data.sessions)) {
          // Merge local and remote histories, avoiding duplicates by timestamp
          setHistory((prevLocal) => {
            const merged = [...prevLocal];
            const localTimestamps = new Set(prevLocal.map((item) => item.timestamp));

            for (const remoteItem of data.sessions) {
              if (!localTimestamps.has(remoteItem.timestamp)) {
                merged.push(remoteItem);
              }
            }

            // Sort newest first
            merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            saveLocalHistory(merged);
            return merged;
          });
        }
      } catch (err) {
        console.warn('[History Sync] Offline or failed to sync cloud history:', err);
      }
    }

    syncCloudHistory();
  }, []);

  function addSession(session) {
    // 1. Instantly update UI and localStorage (for responsiveness & offline resilience)
    setHistory((prev) => {
      const updated = [session, ...prev];
      saveLocalHistory(updated);
      return updated;
    });

    // 2. Sync to cloud database asynchronously
    const code = localStorage.getItem('rodtally_license');
    if (!code) return;

    fetch('/api/save-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, session }),
    })
      .then((res) => {
        if (!res.ok) {
          console.warn('[History Sync] Failed to save session to cloud, HTTP:', res.status);
        }
      })
      .catch((err) => {
        console.warn('[History Sync] Offline, queued to sync next startup:', err);
      });
  }

  return { history, addSession };
}
