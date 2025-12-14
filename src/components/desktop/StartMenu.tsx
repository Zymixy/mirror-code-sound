import { useState } from "react";
import { Search, Power, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface App {
  id: string;
  name: string;
  icon: LucideIcon;
  component: string;
}

interface StartMenuProps {
  apps: App[];
  onAppClick: (app: App) => void;
  onClose: () => void;
  onShutdown: () => void;
}

export function StartMenu({ apps, onAppClick, onClose, onShutdown }: StartMenuProps) {
  const [search, setSearch] = useState("");

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedApps = apps.slice(0, 6);
  const recommendedApps = apps.slice(0, 4);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[998]" onClick={onClose} />

      {/* Menu - positioned at bottom left */}
      <div className="fixed bottom-14 left-2 w-[320px] bg-card/95 start-menu-blur rounded-lg window-shadow z-[999] animate-slide-up overflow-hidden">
        {/* Search */}
        <div className="p-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search apps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-10 pr-4 bg-secondary rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
          </div>
        </div>

        {/* Content */}
        {search ? (
          <div className="p-3 pt-1 max-h-[300px] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-3 gap-1">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => onAppClick(app)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <app.icon className="w-6 h-6 text-primary" />
                  <span className="text-xs text-center truncate w-full">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Pinned */}
            <div className="p-3 pt-1 max-h-[200px] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Pinned</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {pinnedApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => onAppClick(app)}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <app.icon className="w-6 h-6 text-primary" />
                    <span className="text-xs text-center truncate w-full">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended */}
            <div className="p-3 pt-0 max-h-[150px] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Recommended</span>
              </div>
              <div className="space-y-0.5">
                {recommendedApps.slice(0, 3).map((app) => (
                  <button
                    key={app.id}
                    onClick={() => onAppClick(app)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    <app.icon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm">{app.name}</div>
                      <div className="text-xs text-muted-foreground">Recently added</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-border/50">
          <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors">
            <User className="w-5 h-5 p-0.5 bg-primary text-primary-foreground rounded-full" />
            <span className="text-sm">Zymixy</span>
          </button>
          <button
            onClick={onShutdown}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
