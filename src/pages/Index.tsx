import { useState } from "react";
import { User, FolderOpen, Code, Terminal, Globe, Bug } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useWindowManager } from "@/hooks/useWindowManager";
import { Window } from "@/components/desktop/Window";
import { Taskbar } from "@/components/desktop/Taskbar";
import { StartMenu } from "@/components/desktop/StartMenu";
import { DesktopIcon } from "@/components/desktop/DesktopIcon";
import { BootScreen } from "@/components/desktop/BootScreen";
import { ShutdownDialog } from "@/components/desktop/ShutdownDialog";
import { ShutdownScreen } from "@/components/desktop/ShutdownScreen";
import { VirusEffect } from "@/components/desktop/VirusEffect";
import { AboutApp } from "@/components/apps/AboutApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { SkillsApp } from "@/components/apps/SkillsApp";
import { SettingsApp } from "@/components/apps/SettingsApp";
import { ContactApp } from "@/components/apps/ContactApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { BrowserApp } from "@/components/apps/BrowserApp";

interface AppConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  component: string;
}

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const apps: AppConfig[] = [
  { id: "about", name: "About Me", icon: User, component: "about" },
  { id: "projects", name: "Projects", icon: FolderOpen, component: "projects" },
  { id: "skills", name: "Skills", icon: Code, component: "skills" },
  { id: "contact", name: "Contact", icon: User, component: "contact" },
  { id: "terminal", name: "Terminal", icon: Terminal, component: "terminal" },
  { id: "browser", name: "Browser", icon: Globe, component: "browser" },
];

const desktopApps = apps.slice(0, 4);

const Index = () => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState("solid-black");
  const [isBooting, setIsBooting] = useState(true);
  const [showShutdown, setShowShutdown] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [showVirus, setShowVirus] = useState(false);

  const { windows, focusedWindow, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updatePosition, updateSize } = useWindowManager();

  const handleOpenApp = (app: AppConfig) => {
    openWindow(app.id, app.name, app.icon, app.component);
    setIsStartOpen(false);
  };

  const handleSearchClick = () => {
    const browserApp = apps.find(a => a.id === "browser");
    if (browserApp) handleOpenApp(browserApp);
  };

  const handleTaskbarWindowClick = (id: string) => {
    const win = windows.find((w) => w.id === id);
    if (win?.isMinimized) {
      const app = apps.find(a => a.id === win.id);
      if (app) openWindow(win.id, win.title, app.icon, win.component);
    } else if (focusedWindow === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const handleShutdownConfirm = () => {
    setShowShutdown(false);
    setIsShutdown(true);
  };

  const currentWallpaper = null;

  const renderAppContent = (component: string) => {
    switch (component) {
      case "about": return <AboutApp />;
      case "projects": return <ProjectsApp />;
      case "skills": return <SkillsApp />;
      case "settings": return <SettingsApp wallpaper={wallpaper} onWallpaperChange={setWallpaper} />;
      case "contact": return <ContactApp />;
      case "terminal": return <TerminalApp />;
      case "browser": return <BrowserApp />;
      default: return null;
    }
  };

  const windowsWithIcons = windows.map(win => ({ ...win, iconComponent: apps.find(a => a.id === win.id)?.icon }));

  if (isShutdown) return <ShutdownScreen />;
  if (showVirus) return <VirusEffect onComplete={() => setIsShutdown(true)} />;
  if (isBooting) return <BootScreen onComplete={() => setIsBooting(false)} />;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        {desktopApps.map((app) => (
          <DesktopIcon key={app.id} icon={app.id === "contact" ? DiscordIcon : app.icon} label={app.name} onDoubleClick={() => handleOpenApp(app)} />
        ))}
        <DesktopIcon icon={Bug} label="Not a Virus" onDoubleClick={() => setShowVirus(true)} />
      </div>

      {windows.map((win) => (
        <Window key={win.id} window={win} isFocused={focusedWindow === win.id} onClose={() => closeWindow(win.id)} onMinimize={() => minimizeWindow(win.id)} onMaximize={() => maximizeWindow(win.id)} onFocus={() => focusWindow(win.id)} onPositionChange={(pos) => updatePosition(win.id, pos)} onSizeChange={(size) => updateSize(win.id, size)}>
          {renderAppContent(win.component)}
        </Window>
      ))}

      {isStartOpen && <StartMenu apps={apps} onAppClick={handleOpenApp} onClose={() => setIsStartOpen(false)} onShutdown={() => { setIsStartOpen(false); setShowShutdown(true); }} />}
      {showShutdown && <ShutdownDialog onConfirm={handleShutdownConfirm} onCancel={() => setShowShutdown(false)} />}
      <Taskbar windows={windowsWithIcons} focusedWindow={focusedWindow} onStartClick={() => setIsStartOpen(!isStartOpen)} onWindowClick={handleTaskbarWindowClick} onSearchClick={handleSearchClick} isStartOpen={isStartOpen} />
    </div>
  );
};

export default Index;
