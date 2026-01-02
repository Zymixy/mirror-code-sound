import { useState, useEffect, useCallback, memo } from "react";
import { Search } from "lucide-react";
import { WindowState } from "@/hooks/useWindowManager";
import type { LucideIcon } from "lucide-react";

interface TaskbarProps {
  windows: (WindowState & { iconComponent?: LucideIcon })[];
  focusedWindow: string | null;
  onStartClick: () => void;
  onWindowClick: (id: string) => void;
  onSearch: (query: string) => void;
  isStartOpen: boolean;
}

export const Taskbar = memo(function Taskbar({
  windows,
  focusedWindow,
  onStartClick,
  onWindowClick,
  onSearch,
  isStartOpen,
}: TaskbarProps) {
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
    }
  }, [searchQuery, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearchSubmit();
  }, [handleSearchSubmit]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-card/90 taskbar-blur border-t border-border/50 flex items-center justify-center px-2 z-[1000]">
      <button
        onClick={onStartClick}
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
          isStartOpen ? "bg-secondary" : "hover:bg-secondary/80"
        }`}
      >
        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
        </svg>
      </button>

      <div className="ml-1 h-10 px-3 flex items-center gap-2 rounded-full bg-secondary/50 border border-border/50 max-w-xs">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="bg-transparent outline-none text-sm w-24 sm:w-32"
        />
      </div>

      <div className="flex items-center gap-1 mx-2">
        {windows.map((win) => {
          const IconComponent = win.iconComponent;
          const isActive = focusedWindow === win.id && !win.isMinimized;
          return (
            <button
              key={win.id}
              onClick={() => onWindowClick(win.id)}
              className={`relative h-10 px-3 flex items-center gap-2 rounded-md transition-colors ${
                isActive ? "bg-secondary" : "hover:bg-secondary/80"
              } ${win.isMinimized ? "opacity-60" : ""}`}
            >
              {IconComponent && <IconComponent className="w-5 h-5 text-primary" />}
              <span className="text-sm hidden md:block max-w-[100px] truncate">{win.title}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

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
});
