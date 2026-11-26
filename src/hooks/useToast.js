import { useState, useEffect, useCallback } from "react";

export function useToast(duration = 3000) {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(id);
  }, [toast, duration]);
  const notify = useCallback((message, kind = "success") => setToast({ message, kind, key: Date.now() }), []);
  return { toast, notify, dismiss: () => setToast(null) };
}
