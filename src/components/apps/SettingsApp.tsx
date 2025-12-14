import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Image } from "lucide-react";

const wallpapers = [
  { id: "solid-black", name: "Black", colors: "from-black to-black" },
  { id: "gradient-1", name: "Aurora", colors: "from-purple-900 via-blue-900 to-black" },
  { id: "gradient-2", name: "Sunset", colors: "from-orange-600 via-pink-600 to-purple-800" },
  { id: "gradient-3", name: "Ocean", colors: "from-cyan-800 via-blue-800 to-indigo-900" },
  { id: "gradient-4", name: "Forest", colors: "from-green-900 via-emerald-800 to-teal-900" },
  { id: "gradient-5", name: "Midnight", colors: "from-slate-900 via-gray-900 to-black" },
  { id: "gradient-6", name: "Candy", colors: "from-pink-500 via-purple-500 to-indigo-500" },
];

interface SettingsAppProps {
  wallpaper: string;
  onWallpaperChange: (id: string) => void;
}

export function SettingsApp({ wallpaper, onWallpaperChange }: SettingsAppProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="p-4">
      {/* Theme */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Monitor className="w-4 h-4" /> Appearance
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDark(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              !isDark ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Sun className="w-4 h-4" /> Light
          </button>
          <button
            onClick={() => setIsDark(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDark ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Moon className="w-4 h-4" /> Dark
          </button>
        </div>
      </div>

      {/* Wallpaper */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Image className="w-4 h-4" /> Wallpaper
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {wallpapers.map((wp) => (
            <button
              key={wp.id}
              onClick={() => onWallpaperChange(wp.id)}
              className={`aspect-video rounded-lg bg-gradient-to-br ${wp.colors} transition-all ${
                wallpaper === wp.id ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : "hover:opacity-80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { wallpapers };
