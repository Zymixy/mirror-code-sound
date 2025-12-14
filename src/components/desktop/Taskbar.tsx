import { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { WindowState } from "@/hooks/useWindowManager";
import type { LucideIcon } from "lucide-react";

interface TaskbarProps {
  windows: (WindowState & { iconComponent?: LucideIcon })[];
  focusedWindow: string | null;
  onStartClick: () => void;
  onWindowClick: (id: string) => void;
  onSearchClick: () => void;
  isStartOpen: boolean;
}

export function Taskbar({
  windows,
  focusedWindow,
  onStartClick,
  onWindowClick,
  onSearchClick,
  isStartOpen,
}: TaskbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-card/90 taskbar-blur border-t border-border/50 flex items-center justify-center px-2 z-[1000]">
      {/* Start button */}
      <button
        onClick={onStartClick}
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
          isStartOpen ? "bg-secondary" : "hover:bg-secondary/80"
        }`}
      >
        <Sparkles className="w-5 h-5 text-primary" />
      </button>

      {/* Search */}
      <button
        onClick={onSearchClick}
        className="ml-1 h-10 px-4 flex items-center gap-2 rounded-md hover:bg-secondary/80 transition-colors"
      >
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground hidden sm:block">Search</span>
      </button>

      {/* Open windows */}
      <div className="flex items-center gap-1 mx-2">
        {windows.map((win) => {
          const IconComponent = win.iconComponent;
          return (
            <button
              key={win.id}
              onClick={() => onWindowClick(win.id)}
              className={`h-10 px-3 flex items-center gap-2 rounded-md transition-all ${
                focusedWindow === win.id && !win.isMinimized
                  ? "bg-secondary"
                  : "hover:bg-secondary/80"
              } ${win.isMinimized ? "opacity-60" : ""}`}
            >
              {IconComponent && <IconComponent className="w-5 h-5 text-primary" />}
              <span className="text-sm hidden md:block max-w-[100px] truncate">{win.title}</span>
              {focusedWindow === win.id && !win.isMinimized && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* System tray */}
      <div className="ml-auto flex items-center gap-2 px-3">
        <div className="text-right">
          <div className="text-xs">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="text-xs text-muted-foreground">
            {time.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}
