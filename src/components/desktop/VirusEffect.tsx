import { useState, useEffect } from "react";
import { useVirusSound } from "@/hooks/useVirusSound";

interface VirusEffectProps {
  onComplete: () => void;
}

const hackerMessages = [
  "NOT A VIRUS",
  "TOTALLY SAFE",
  "TRUST ME BRO",
  "SYSTEM OPTIMIZED",
  "FREE RAM BOOST",
  "100% LEGIT",
  "CRITICAL UPDATE",
  "SYSTEM UPGRADE",
  "NO WORRIES",
  "ALL GOOD",
  "0x00000SAFE",
  "HARMLESS ERROR",
  "MEMORY OPTIMIZED",
  "FIREWALL ENHANCED",
  "DOWNLOADING MORE RAM",
  "HACKING NASA",
  "ACCESSING MAINFRAME",
  "BYPASSING SECURITY",
];

interface FloatingMessage {
  id: number;
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

interface GlitchBox {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PopupWindow {
  id: number;
  x: number;
  y: number;
  title: string;
}

export function VirusEffect({ onComplete }: VirusEffectProps) {
  const [messages, setMessages] = useState<FloatingMessage[]>([]);
  const [shake, setShake] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [phase, setPhase] = useState(0);
  const [redOverlay, setRedOverlay] = useState(0);
  const [glitchBoxes, setGlitchBoxes] = useState<GlitchBox[]>([]);
  const [popups, setPopups] = useState<PopupWindow[]>([]);
  const [matrixColumns, setMatrixColumns] = useState<number[]>([]);
  const [corruption, setCorruption] = useState(0);
  const { playAlarmSound, stopAlarmSound } = useVirusSound();

  useEffect(() => {
    setShake(true);
    // Sound already started in DefenderPopups, no need to play again

    // Initialize matrix columns
    setMatrixColumns(Array.from({ length: 40 }, (_, i) => i));

    // Add messages progressively
    const messageInterval = setInterval(() => {
      setMessages(prev => {
        if (prev.length >= 60) return prev;
        const newMessage: FloatingMessage = {
          id: Date.now() + Math.random(),
          text: hackerMessages[Math.floor(Math.random() * hackerMessages.length)],
          x: Math.random() * 90,
          y: Math.random() * 85,
          rotation: (Math.random() - 0.5) * 60,
          scale: 0.5 + Math.random() * 1.5,
          color: Math.random() > 0.5 ? "#ff0000" : Math.random() > 0.5 ? "#00ff00" : "#00ffff",
        };
        return [...prev, newMessage];
      });
    }, 80);

    // Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 50);
    }, 200);

    // Glitch boxes effect
    const glitchBoxInterval = setInterval(() => {
      setGlitchBoxes(prev => {
        const newBoxes = Array.from({ length: 3 }, () => ({
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          width: 50 + Math.random() * 200,
          height: 20 + Math.random() * 100,
        }));
        return [...prev.slice(-10), ...newBoxes];
      });
    }, 150);

    // Popup windows effect
    const popupInterval = setInterval(() => {
      if (phase >= 1) {
        setPopups(prev => {
          if (prev.length >= 8) return prev;
          return [...prev, {
            id: Date.now(),
            x: Math.random() * 60 + 10,
            y: Math.random() * 60 + 10,
            title: ["CRITICAL ERROR", "SYSTEM FAILURE", "WARNING", "ACCESS DENIED", "FATAL ERROR"][Math.floor(Math.random() * 5)],
          }];
        });
      }
    }, 400);

    // Increase red overlay and corruption
    const redInterval = setInterval(() => {
      setRedOverlay(prev => Math.min(prev + 0.03, 0.6));
      setCorruption(prev => Math.min(prev + 1, 100));
    }, 150);

    // Phase progression
    setTimeout(() => setPhase(1), 1500);
    setTimeout(() => setPhase(2), 4000);
    setTimeout(() => setPhase(3), 7000);
    setTimeout(() => setPhase(4), 10000);

    // Final shutdown
    setTimeout(() => {
      clearInterval(messageInterval);
      clearInterval(glitchInterval);
      clearInterval(glitchBoxInterval);
      clearInterval(popupInterval);
      clearInterval(redInterval);
      stopAlarmSound();
      onComplete();
    }, 12000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(glitchInterval);
      clearInterval(glitchBoxInterval);
      clearInterval(popupInterval);
      clearInterval(redInterval);
      stopAlarmSound();
    };
  }, [onComplete, playAlarmSound, stopAlarmSound]);

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-black ${shake ? 'animate-shake' : ''}`}
      style={{
        filter: glitch ? `hue-rotate(${Math.random() * 360}deg) saturate(${1 + Math.random() * 2})` : undefined,
      }}
    >
      {/* Red overlay */}
      <div
        className="absolute inset-0 bg-red-600 pointer-events-none transition-opacity"
        style={{ opacity: redOverlay }}
      />

      {/* Chromatic aberration layers */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          background: `linear-gradient(90deg, rgba(255,0,0,${0.1 + corruption * 0.002}) 0%, transparent 50%, rgba(0,255,255,${0.1 + corruption * 0.002}) 100%)`,
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Glitch boxes */}
      {glitchBoxes.map((box) => (
        <div
          key={box.id}
          className="absolute pointer-events-none"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: box.width,
            height: box.height,
            background: `linear-gradient(90deg, rgba(255,0,0,0.5), rgba(0,255,0,0.5), rgba(0,0,255,0.5))`,
            mixBlendMode: 'difference',
            animation: 'glitchBox 0.1s ease-out forwards',
          }}
        />
      ))}

      {/* Matrix rain effect */}
      {phase >= 2 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-70">
          {matrixColumns.map((i) => (
            <div
              key={i}
              className="absolute text-green-400 font-mono text-xs leading-none"
              style={{
                left: `${i * 2.5}%`,
                animation: `matrixFall ${2 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {Array.from({ length: 25 }).map((_, j) => (
                <div key={j} style={{ opacity: 1 - j * 0.04 }}>
                  {String.fromCharCode(0x30A0 + Math.random() * 96)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Floating messages */}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="absolute font-mono font-bold whitespace-nowrap"
          style={{
            left: `${msg.x}%`,
            top: `${msg.y}%`,
            transform: `rotate(${msg.rotation}deg) scale(${msg.scale})`,
            color: msg.color,
            textShadow: `0 0 10px ${msg.color}, 0 0 20px ${msg.color}, 0 0 40px ${msg.color}`,
            fontSize: `${12 + msg.scale * 10}px`,
            animation: 'messagePulse 0.2s ease-in-out infinite',
          }}
        >
          {msg.text}
        </div>
      ))}

      {/* Fake popup windows */}
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute shadow-2xl"
          style={{
            left: `${popup.x}%`,
            top: `${popup.y}%`,
            animation: 'popupBounce 0.3s ease-out',
          }}
        >
          <div className="bg-gray-200 border-2 border-gray-400 rounded-t px-2 py-1 flex items-center gap-2">
            <span className="text-red-600 text-xs font-bold">⚠</span>
            <span className="text-xs font-bold text-gray-800">{popup.title}</span>
            <span className="ml-auto text-gray-600 cursor-pointer">✕</span>
          </div>
          <div className="bg-gray-100 border-2 border-t-0 border-gray-400 rounded-b p-4 text-xs text-gray-800">
            <p className="mb-2">System has detected a critical error.</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-gray-300 border border-gray-400 text-xs">OK</button>
              <button className="px-3 py-1 bg-gray-300 border border-gray-400 text-xs">Cancel</button>
            </div>
          </div>
        </div>
      ))}

      {/* Progress bar */}
      {phase >= 1 && phase < 4 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80">
          <div className="text-center text-green-400 font-mono text-sm mb-2 animate-pulse">
            {phase === 1 && "INFILTRATING SYSTEM..."}
            {phase === 2 && "ACCESSING CORE FILES..."}
            {phase === 3 && "OPTIMIZATION COMPLETE"}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-green-500/30">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-cyan-400 to-green-500 transition-all duration-300"
              style={{ width: `${Math.min(corruption, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Main warning */}
      {phase >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center" style={{ animation: 'mainPulse 0.15s ease-in-out infinite' }}>
            <div
              className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 font-mono mb-4 tracking-wider"
              style={{
                textShadow: '0 0 30px #00ff00, 0 0 60px #00ff00, 0 0 90px #00ffff',
                WebkitTextStroke: '1px rgba(0,255,0,0.5)',
              }}
            >
              NOT A VIRUS
            </div>
            <div
              className="text-2xl font-bold text-red-500 font-mono animate-pulse"
              style={{ textShadow: '0 0 20px #ff0000, 0 0 40px #ff0000' }}
            >
              {phase === 1 && "INITIALIZING..."}
              {phase === 2 && "SYSTEM OVERRIDE IN PROGRESS"}
              {phase === 3 && "OPTIMIZATION COMPLETE"}
              {phase >= 4 && "SHUTTING DOWN..."}
            </div>
          </div>
        </div>
      )}

      {/* Final message */}
      {phase >= 4 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-center" style={{ animation: 'finalReveal 0.5s ease-out' }}>
            <div className="text-xl text-red-400 font-mono animate-pulse">
              Initiating system shutdown...
            </div>
          </div>
        </div>
      )}

      {/* Static noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          animation: 'staticNoise 0.1s steps(5) infinite',
        }}
      />

      <style>{`
        @keyframes glitchBox {
          0% { opacity: 1; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(0); }
        }
        @keyframes matrixFall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes messagePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes popupBounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes mainPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes finalReveal {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes staticNoise {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(5%, 5%); }
          30% { transform: translate(-5%, 5%); }
          40% { transform: translate(5%, -5%); }
          50% { transform: translate(-5%, 0); }
          60% { transform: translate(5%, 0); }
          70% { transform: translate(0, 5%); }
          80% { transform: translate(0, -5%); }
          90% { transform: translate(5%, 5%); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}
