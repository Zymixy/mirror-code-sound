import { useState, useEffect, useRef } from "react";

interface VirusEffectProps {
  onComplete: () => void;
}

interface ErrorPopup {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  message: string;
}

const errorMessages = [
  "VIRUS DETECTED",
  "SYSTEM COMPROMISED", 
  "DATA CORRUPTED",
  "FIREWALL DISABLED",
  "PASSWORD STOLEN",
  "FILES ENCRYPTED",
  "WEBCAM ACTIVATED",
  "SENDING DATA...",
];

export function VirusEffect({ onComplete }: VirusEffectProps) {
  const [popups, setPopups] = useState<ErrorPopup[]>([]);
  const [screenShake, setScreenShake] = useState(0);
  const [blueScreen, setBlueScreen] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();

  // Play sound and start animation
  useEffect(() => {
    // Play audio
    audioRef.current = new Audio("https://www.myinstants.com/media/sounds/hello-your-computer-has-virus.mp3");
    audioRef.current.volume = 0.6;
    audioRef.current.play().catch(console.error);

    // Spawn error popups rapidly
    let popupCount = 0;
    const spawnInterval = setInterval(() => {
      if (popupCount < 20) {
        setPopups(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: Math.random() * (window.innerWidth - 300),
          y: Math.random() * (window.innerHeight - 150),
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
        }]);
        popupCount++;
      }
    }, 150);

    // Increase glitch over time
    const glitchInterval = setInterval(() => {
      setGlitchIntensity(prev => Math.min(prev + 0.1, 1));
    }, 200);

    // Screen shake
    const shakeInterval = setInterval(() => {
      setScreenShake(Math.random() * 10 - 5);
    }, 50);

    // Blue screen at 6 seconds
    setTimeout(() => {
      setBlueScreen(true);
      setShowFinalMessage(true);
    }, 6000);

    // End at 8 seconds
    setTimeout(() => {
      clearInterval(spawnInterval);
      clearInterval(glitchInterval);
      clearInterval(shakeInterval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      onComplete();
    }, 8000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(glitchInterval);
      clearInterval(shakeInterval);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onComplete]);

  // Bounce animation for popups
  useEffect(() => {
    const animate = () => {
      setPopups(prev => prev.map(popup => {
        let newX = popup.x + popup.vx;
        let newY = popup.y + popup.vy;
        let newVx = popup.vx;
        let newVy = popup.vy;

        if (newX <= 0 || newX >= window.innerWidth - 280) {
          newVx = -newVx * 0.9;
          newX = Math.max(0, Math.min(newX, window.innerWidth - 280));
        }
        if (newY <= 0 || newY >= window.innerHeight - 120) {
          newVy = -newVy * 0.9;
          newY = Math.max(0, Math.min(newY, window.innerHeight - 120));
        }

        return { ...popup, x: newX, y: newY, vx: newVx, vy: newVy };
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  if (blueScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0078d7] flex items-center justify-center p-8">
        <div className="text-white max-w-2xl">
          <div className="text-8xl mb-8">:(</div>
          <p className="text-2xl mb-4">Your PC ran into a problem and needs to restart.</p>
          <p className="text-lg mb-8 opacity-80">We're just collecting some error info, and then we'll restart for you.</p>
          <div className="flex items-center gap-4 mb-8">
            <div className="text-6xl font-bold animate-pulse">
              {showFinalMessage ? "99%" : "0%"}
            </div>
            <p className="text-lg opacity-80">complete</p>
          </div>
          <div className="flex items-center gap-4 text-sm opacity-70">
            <div className="w-24 h-24 border-4 border-white p-2">
              <div className="w-full h-full bg-white/20" />
            </div>
            <div>
              <p>For more information about this issue and possible fixes, visit</p>
              <p className="mt-1">https://www.definitely-not-a-virus.com</p>
              <p className="mt-4">If you call a support person, give them this info:</p>
              <p className="font-mono mt-1">Stop code: TOTALLY_NOT_A_VIRUS</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{
        transform: `translate(${screenShake}px, ${screenShake}px)`,
        filter: `hue-rotate(${glitchIntensity * 30}deg) saturate(${1 + glitchIntensity})`,
      }}
    >
      {/* Red warning overlay */}
      <div 
        className="absolute inset-0 bg-red-600 pointer-events-none transition-opacity duration-300"
        style={{ opacity: glitchIntensity * 0.3 }}
      />

      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Error popups */}
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute shadow-2xl select-none"
          style={{
            left: popup.x,
            top: popup.y,
            animation: 'popupAppear 0.2s ease-out',
          }}
        >
          <div className="w-[280px] bg-[#f0f0f0] border-2 border-[#dfdfdf] shadow-[2px_2px_0_#888]">
            {/* Title bar */}
            <div className="bg-gradient-to-r from-[#ff0000] to-[#cc0000] px-2 py-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">⚠</span>
                <span className="text-white text-xs font-bold">System Error</span>
              </div>
              <button className="text-white hover:bg-red-700 px-2 text-sm">✕</button>
            </div>
            {/* Content */}
            <div className="p-4 bg-[#f0f0f0]">
              <div className="flex items-start gap-3">
                <div className="text-4xl">🦠</div>
                <div>
                  <p className="text-sm font-bold text-red-600 mb-2">{popup.message}</p>
                  <p className="text-xs text-gray-700">Your computer has been infected. All your data is being sent to hackers.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="px-4 py-1 bg-[#e0e0e0] border border-[#999] text-xs hover:bg-[#d0d0d0]">
                  Panic
                </button>
                <button className="px-4 py-1 bg-[#e0e0e0] border border-[#999] text-xs hover:bg-[#d0d0d0]">
                  Cry
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Glitch bars */}
      {glitchIntensity > 0.3 && Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 bg-cyan-500/30 pointer-events-none"
          style={{
            top: `${Math.random() * 100}%`,
            height: `${2 + Math.random() * 10}px`,
            transform: `translateX(${(Math.random() - 0.5) * 20}px)`,
            opacity: glitchIntensity,
          }}
        />
      ))}

      {/* Central warning */}
      {glitchIntensity > 0.5 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="text-red-500 text-6xl font-black font-mono animate-pulse"
            style={{
              textShadow: '0 0 20px red, 0 0 40px red, 0 0 60px red',
              animation: 'glitchText 0.1s infinite',
            }}
          >
            ⚠ VIRUS DETECTED ⚠
          </div>
        </div>
      )}

      <style>{`
        @keyframes popupAppear {
          0% { transform: scale(0) rotate(10deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes glitchText {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(2px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }
      `}</style>
    </div>
  );
}