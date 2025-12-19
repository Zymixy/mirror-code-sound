import { useState, useEffect, useRef } from "react";

interface VirusEffectProps {
  onComplete: () => void;
}

interface SystemWindow {
  id: number;
  name: string;
  x: number;
  y: number;
}

interface ChaosIcon {
  id: number;
  x: number;
  y: number;
  visible: boolean;
  duplicate: boolean;
}

export function VirusEffect({ onComplete }: VirusEffectProps) {
  const [phase, setPhase] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(false);
  const [systemWindows, setSystemWindows] = useState<SystemWindow[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [chaosIcons, setChaosIcons] = useState<ChaosIcon[]>([]);
  const [showBigMessage, setShowBigMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play sound
    audioRef.current = new Audio("https://www.myinstants.com/media/sounds/hello-your-computer-has-virus.mp3");
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(() => {});

    // Initialize chaos icons
    const icons: ChaosIcon[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 20 + (i % 4) * 80,
      y: 50 + Math.floor(i / 4) * 100,
      visible: true,
      duplicate: false,
    }));
    setChaosIcons(icons);

    // Timeline:
    // 0-1s: Freeze
    // 1-4s: Terminal text
    // 4-6s: Cursor blinking
    // 6-9s: System windows + icon chaos
    // 9-12s: Glitches + big message
    // 12-14s: Fade to black
    // 14-17s: Final message

    const timeline = [
      { time: 0, action: () => setPhase(1) },
      { time: 1000, action: () => {
        setPhase(2);
        typeTerminalText();
      }},
      { time: 4000, action: () => {
        setPhase(3);
        setShowCursor(true);
      }},
      { time: 6000, action: () => {
        setPhase(4);
        setShowCursor(false);
        spawnSystemWindows();
        startIconChaos();
      }},
      { time: 9000, action: () => {
        setPhase(5);
        setGlitchActive(true);
        setShowBigMessage(true);
      }},
      { time: 12000, action: () => {
        setPhase(6);
        setGlitchActive(false);
        setShowBigMessage(false);
        setFadeOut(true);
      }},
      { time: 14000, action: () => {
        setPhase(7);
        setShowFinalMessage(true);
      }},
      { time: 17000, action: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        onComplete();
      }},
    ];

    const timeouts = timeline.map(({ time, action }) => 
      setTimeout(action, time)
    );

    return () => {
      timeouts.forEach(clearTimeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onComplete]);

  const typeTerminalText = () => {
    const lines = [
      "> loading process...",
      "> checking system files",
      "> warning: unexpected behavior detected"
    ];
    
    lines.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
      }, index * 800);
    });
  };

  const spawnSystemWindows = () => {
    const windowNames = [
      "error_001.log",
      "unknown_task.tmp", 
      "background_process.exe",
    ];

    windowNames.forEach((name, index) => {
      setTimeout(() => {
        setSystemWindows(prev => [...prev, {
          id: index,
          name,
          x: 150 + index * 50,
          y: 100 + index * 40
        }]);
      }, index * 400);
    });
  };

  const startIconChaos = () => {
    // Randomize icons over time
    const chaosInterval = setInterval(() => {
      setChaosIcons(prev => prev.map(icon => ({
        ...icon,
        x: icon.x + (Math.random() - 0.5) * 30,
        y: icon.y + (Math.random() - 0.5) * 30,
        visible: Math.random() > 0.2,
        duplicate: Math.random() > 0.7,
      })));
    }, 500);

    setTimeout(() => clearInterval(chaosInterval), 6000);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden bg-black"
      style={{ cursor: phase >= 1 ? "none" : "default" }}
    >
      {/* Phase 2-3: Terminal with text */}
      {phase >= 2 && phase < 5 && (
        <div className="absolute inset-0 bg-black flex flex-col p-8 font-mono">
          <div className="text-green-500 text-lg space-y-2">
            {terminalLines.map((line, i) => (
              <div key={i} className="animate-fade-in">{line}</div>
            ))}
          </div>
          
          {/* Blinking cursor */}
          {showCursor && (
            <div className="mt-4 text-green-500 text-lg">
              <span className="animate-pulse">█</span>
            </div>
          )}
        </div>
      )}

      {/* Phase 4: System windows + chaos */}
      {phase >= 4 && phase < 6 && (
        <div className="absolute inset-0 bg-[#008080]">
          {/* Chaos desktop icons */}
          {chaosIcons.map((icon) => (
            <div key={icon.id}>
              {icon.visible && (
                <div
                  className="absolute transition-all duration-500 flex flex-col items-center"
                  style={{ left: icon.x, top: icon.y }}
                >
                  <div className="w-10 h-10 bg-yellow-100 border border-gray-500 flex items-center justify-center">
                    📁
                  </div>
                  <span className="text-white text-xs mt-1 text-shadow">Folder</span>
                </div>
              )}
              {icon.duplicate && (
                <div
                  className="absolute transition-all duration-500 flex flex-col items-center"
                  style={{ left: icon.x + 20, top: icon.y + 15 }}
                >
                  <div className="w-10 h-10 bg-yellow-100 border border-gray-500 flex items-center justify-center">
                    📁
                  </div>
                  <span className="text-white text-xs mt-1">Copy</span>
                </div>
              )}
            </div>
          ))}

          {/* System windows */}
          {systemWindows.map((win, index) => (
            <div
              key={win.id}
              className="absolute bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-700 border-b-gray-700 shadow-lg"
              style={{
                left: win.x,
                top: win.y,
                width: 300,
                zIndex: 100 + index,
                animation: "windowAppear 0.3s ease-out"
              }}
            >
              <div className="bg-[#000080] text-white px-2 py-1 text-sm flex justify-between items-center">
                <span className="font-bold">{win.name}</span>
                <div className="flex gap-1">
                  <button className="w-4 h-4 bg-[#c0c0c0] text-black text-xs leading-none">_</button>
                  <button className="w-4 h-4 bg-[#c0c0c0] text-black text-xs leading-none">□</button>
                  <button className="w-4 h-4 bg-[#c0c0c0] text-black text-xs leading-none">×</button>
                </div>
              </div>
              <div className="p-3 bg-white text-black text-xs font-mono h-28 overflow-hidden">
                <div className="text-red-600 font-bold">ERROR: Unknown process</div>
                <div className="mt-1">Address: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
                <div className="mt-1">Status: CORRUPTED</div>
                <div className="mt-2 text-gray-500">───────────────────</div>
                <div className="text-orange-600">Memory access violation</div>
              </div>
            </div>
          ))}

          {/* Frozen clock */}
          <div className="absolute bottom-2 right-2 bg-[#c0c0c0] px-3 py-1 border-2 border-t-white border-l-white border-r-gray-700 border-b-gray-700">
            <span className="font-mono text-sm text-red-600 font-bold">12:00</span>
          </div>
        </div>
      )}

      {/* Phase 5: Glitches + big message */}
      {phase >= 5 && phase < 6 && (
        <div className="absolute inset-0 bg-black">
          {/* Glitch lines */}
          {glitchActive && Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="absolute h-1 bg-green-500"
              style={{
                top: `${10 + i * 9}%`,
                left: 0,
                right: 0,
                opacity: 0.4 + Math.random() * 0.4,
                transform: `translateX(${(Math.random() - 0.5) * 40}px)`,
                animation: `glitchLine ${0.05 + Math.random() * 0.1}s infinite`
              }}
            />
          ))}

          {/* Flickering overlay */}
          <div 
            className="absolute inset-0 bg-white pointer-events-none"
            style={{ 
              opacity: 0.05,
              animation: "flicker 0.15s infinite"
            }}
          />

          {/* Big center message */}
          {showBigMessage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="text-green-500 text-3xl md:text-5xl lg:text-6xl font-mono font-bold tracking-widest text-center px-4"
                style={{
                  textShadow: "0 0 10px #00ff00, 0 0 20px #00ff00",
                  animation: "textGlitch 0.5s infinite"
                }}
              >
                PROCESS STILL RUNNING
              </div>
            </div>
          )}
        </div>
      )}

      {/* Phase 6: Fade to black */}
      {phase >= 6 && !showFinalMessage && (
        <div 
          className="absolute inset-0 bg-black"
          style={{
            animation: "fadeIn 2s ease-out forwards"
          }}
        />
      )}

      {/* Phase 7: Final message */}
      {showFinalMessage && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div 
            className="text-white text-xl md:text-3xl lg:text-4xl font-mono tracking-wide"
            style={{ animation: "fadeIn 1s ease-out" }}
          >
            SYSTEM STATUS: UNKNOWN
          </div>
        </div>
      )}

      <style>{`
        @keyframes windowAppear {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes glitchLine {
          0%, 100% { transform: translateX(0); opacity: 0.5; }
          25% { transform: translateX(-10px); opacity: 0.8; }
          50% { transform: translateX(15px); opacity: 0.3; }
          75% { transform: translateX(-5px); opacity: 0.7; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
        @keyframes textGlitch {
          0%, 100% { transform: translate(0); }
          10% { transform: translate(-2px, 1px); }
          30% { transform: translate(2px, -2px); }
          50% { transform: translate(-1px, 2px); }
          70% { transform: translate(3px, 1px); }
          90% { transform: translate(-2px, -1px); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .text-shadow {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }
      `}</style>
    </div>
  );
}
