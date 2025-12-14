import { useState, useCallback } from "react";
import type { LucideIcon } from "lucide-react";

export interface WindowState {
  id: string;
  title: string;
  icon: LucideIcon;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  component: string;
}

let zIndexCounter = 100;

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedWindow, setFocusedWindow] = useState<string | null>(null);

  const openWindow = useCallback((id: string, title: string, icon: LucideIcon, component: string) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) {
        if (existing.isMinimized) {
          return prev.map((w) =>
            w.id === id ? { ...w, isMinimized: false, zIndex: ++zIndexCounter } : w
          );
        }
        return prev.map((w) =>
          w.id === id ? { ...w, zIndex: ++zIndexCounter } : w
        );
      }

      const newWindow: WindowState = {
        id,
        title,
        icon,
        isMinimized: false,
        isMaximized: false,
        position: { x: 100 + prev.length * 30, y: 80 + prev.length * 30 },
        size: { width: 800, height: 500 },
        zIndex: ++zIndexCounter,
        component,
      };
      return [...prev, newWindow];
    });
    setFocusedWindow(id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setFocusedWindow(null);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: ++zIndexCounter } : w))
    );
    setFocusedWindow(id);
  }, []);

  const updatePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  }, []);

  const updateSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
  }, []);

  return {
    windows,
    focusedWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
    updateSize,
  };
}
