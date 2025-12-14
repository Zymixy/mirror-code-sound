import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Image, Volume2, VolumeX, Bell, BellOff, Palette, Zap, Shield, Info, Wifi, WifiOff, Battery, BatteryCharging } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const wallpapers = [
  { id: "solid-black", name: "Black", colors: "from-black to-black" },
  { id: "gradient-1", name: "Aurora", colors: "from-purple-900 via-blue-900 to-black" },
  { id: "gradient-2", name: "Sunset", colors: "from-orange-600 via-pink-600 to-purple-800" },
  { id: "gradient-3", name: "Ocean", colors: "from-cyan-800 via-blue-800 to-indigo-900" },
  { id: "gradient-4", name: "Forest", colors: "from-green-900 via-emerald-800 to-teal-900" },
  { id: "gradient-5", name: "Midnight", colors: "from-slate-900 via-gray-900 to-black" },
  { id: "gradient-6", name: "Candy", colors: "from-pink-500 via-purple-500 to-indigo-500" },
  { id: "gradient-7", name: "Neon", colors: "from-cyan-400 via-purple-500 to-pink-500" },
  { id: "gradient-8", name: "Fire", colors: "from-red-600 via-orange-500 to-yellow-500" },
];

const accentColors = [
  { id: "blue", name: "Blue", color: "bg-blue-500" },
  { id: "purple", name: "Purple", color: "bg-purple-500" },
  { id: "pink", name: "Pink", color: "bg-pink-500" },
  { id: "red", name: "Red", color: "bg-red-500" },
  { id: "orange", name: "Orange", color: "bg-orange-500" },
  { id: "green", name: "Green", color: "bg-green-500" },
  { id: "cyan", name: "Cyan", color: "bg-cyan-500" },
];

interface SettingsAppProps {
  wallpaper: string;
  onWallpaperChange: (id: string) => void;
}

export function SettingsApp({ wallpaper, onWallpaperChange }: SettingsAppProps) {
  const [isDark, setIsDark] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [batterySaver, setBatterySaver] = useState(false);
  const [accentColor, setAccentColor] = useState("blue");
  const [activeTab, setActiveTab] = useState("appearance");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "sound", label: "Sound", icon: Volume2 },
    { id: "system", label: "System", icon: Zap },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 border-r border-border/50 p-2 flex flex-col gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "appearance" && (
          <div className="space-y-6">
            {/* Theme */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Theme
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

            {/* Accent Color */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" /> Accent Color
              </h3>
              <div className="flex gap-2 flex-wrap">
                {accentColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setAccentColor(color.id)}
                    className={`w-8 h-8 rounded-full ${color.color} transition-transform ${
                      accentColor === color.id ? "ring-2 ring-offset-2 ring-offset-card ring-white scale-110" : "hover:scale-105"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Animations */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Enable Animations</span>
              </div>
              <Switch checked={animations} onCheckedChange={setAnimations} />
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
        )}

        {activeTab === "sound" && (
          <div className="space-y-6">
            {/* Volume */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />} 
                Volume
              </h3>
              <div className="flex items-center gap-4">
                <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-lg hover:bg-secondary/80 transition-colors">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                  disabled={isMuted}
                />
                <span className="text-sm w-10 text-right">{isMuted ? "0" : volume[0]}%</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                <span className="text-sm">Notification Sounds</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-6">
            {/* WiFi */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {wifi ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-sm">WiFi</span>
              </div>
              <Switch checked={wifi} onCheckedChange={setWifi} />
            </div>

            {/* Battery Saver */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {batterySaver ? <Battery className="w-4 h-4" /> : <BatteryCharging className="w-4 h-4" />}
                <span className="text-sm">Battery Saver</span>
              </div>
              <Switch checked={batterySaver} onCheckedChange={setBatterySaver} />
            </div>

            {/* Security */}
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Security Status</span>
              </div>
              <p className="text-xs text-muted-foreground">Your system is protected. All security features are enabled.</p>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🖥️</div>
              <h2 className="text-xl font-bold mb-2">Portfolio OS</h2>
              <p className="text-sm text-muted-foreground mb-4">Version 1.0.0</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Built with React + TypeScript</p>
                <p>Styled with Tailwind CSS</p>
                <p>© 2024 Your Name</p>
              </div>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">System Information</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Processor: Virtual CPU @ 3.4GHz</p>
                <p>Memory: 16 GB RAM</p>
                <p>Storage: 512 GB SSD</p>
                <p>Display: 1920 x 1080</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { wallpapers };