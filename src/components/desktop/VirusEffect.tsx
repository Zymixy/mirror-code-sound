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

export function VirusEffect({ onComplete }: VirusEffectProps) {
  const [messages, setMessages] = useState<FloatingMessage[]>([]);
  const [shake, setShake] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [phase, setPhase] = useState(0);
  const [redOverlay, setRedOverlay] = useState(0);
  const { playAlarmSound, stopAlarmSound } = useVirusSound();

  useEffect(() => {
    // Start shaking immediately
    setShake(true);
    
    // Play alarm sound when virus activates
    playAlarmSound();

    // Add messages progressively
    const messageInterval = setInterval(() => {
      setMessages(prev => {
        if (prev.length >= 50) return prev;
        const newMessage: FloatingMessage = {
          id: Date.now() + Math.random(),
          text: hackerMessages[Math.floor(Math.random() * hackerMessages.length)],
          x: Math.random() * 90,
          y: Math.random() * 85,
          rotation: (Math.random() - 0.5) * 60,
          scale: 0.5 + Math.random() * 1.5,
          color: Math.random() > 0.5 ? "#ff0000" : Math.random() > 0.5 ? "#00ff00" : "#ffffff",
        };
        return [...prev, newMessage];
      });
    }, 100);

    // Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 300);

    // Increase red overlay over time
    const redInterval = setInterval(() => {
      setRedOverlay(prev => Math.min(prev + 0.05, 0.7));
    }, 200);

    // Phase progression - extended duration
    setTimeout(() => setPhase(1), 2000);
    setTimeout(() => setPhase(2), 5000);
    setTimeout(() => setPhase(3), 8000);

    // Final shutdown - extended to 12 seconds total
    setTimeout(() => {
      clearInterval(messageInterval);
      clearInterval(glitchInterval);
      clearInterval(redInterval);
      stopAlarmSound();
      onComplete();
    }, 12000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(glitchInterval);
      clearInterval(redInterval);
      stopAlarmSound();
    };
  }, [onComplete, playAlarmSound, stopAlarmSound]);

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-black ${shake ? 'animate-shake' : ''}`}
      style={{
        filter: glitch ? `hue-rotate(${Math.random() * 360}deg)` : undefined,
      }}
    >
      {/* Red overlay */}
      <div
        className="absolute inset-0 bg-red-600 pointer-events-none transition-opacity"
        style={{ opacity: redOverlay }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Floating messages */}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="absolute font-mono font-bold animate-pulse whitespace-nowrap"
          style={{
            left: `${msg.x}%`,
            top: `${msg.y}%`,
            transform: `rotate(${msg.rotation}deg) scale(${msg.scale})`,
            color: msg.color,
            textShadow: `0 0 10px ${msg.color}, 0 0 20px ${msg.color}`,
            fontSize: `${12 + msg.scale * 10}px`,
            animation: 'pulse 0.3s ease-in-out infinite',
          }}
        >
          {msg.text}
        </div>
      ))}

      {/* Main warning - no skull */}
      {phase >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-center animate-pulse"
            style={{
              animation: 'pulse 0.2s ease-in-out infinite',
            }}
          >
            <div
              className="text-6xl font-bold text-green-500 font-mono mb-4"
              style={{
                textShadow: '0 0 30px #00ff00, 0 0 60px #00ff00',
                animation: 'glitch 0.3s infinite',
              }}
            >
              NOT A VIRUS
            </div>
            <div
              className="text-2xl font-bold text-red-500 font-mono"
              style={{
                textShadow: '0 0 20px #ff0000, 0 0 40px #ff0000',
              }}
            >
              SYSTEM OPTIMIZING...
            </div>
          </div>
        </div>
      )}

      {/* Binary rain effect */}
      {phase >= 2 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-green-500 font-mono text-xs opacity-70"
              style={{
                left: `${i * 5}%`,
                animation: `fall ${1 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {Array.from({ length: 30 }).map(() => Math.round(Math.random())).join('\n')}
            </div>
          ))}
        </div>
      )}

      {/* Final message */}
      {phase >= 3 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <div
              className="text-6xl font-bold text-green-500 font-mono mb-4 animate-pulse"
              style={{
                textShadow: '0 0 30px #00ff00, 0 0 60px #00ff00, 0 0 90px #00ff00',
              }}
            >
              JUST KIDDING
            </div>
            <div className="text-xl text-red-500 font-mono">
              Initiating system shutdown...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
