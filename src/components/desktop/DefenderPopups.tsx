import { useState, useEffect, useRef } from "react";
import { useVirusSound } from "@/hooks/useVirusSound";

interface DefenderPopup {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "warning" | "critical" | "scan";
  message: string;
}

interface DefenderPopupsProps {
  onComplete: () => void;
}

const popupMessages = [
  { type: "warning" as const, message: "Windows Defender has detected suspicious activity" },
  { type: "critical" as const, message: "Threat detected: Trojan.Win32.Generic" },
  { type: "scan" as const, message: "Scanning system files..." },
  { type: "warning" as const, message: "Firewall: Unauthorized connection blocked" },
  { type: "critical" as const, message: "Critical: System files may be compromised" },
  { type: "scan" as const, message: "Found: Malware.Ransom.Stop" },
  { type: "warning" as const, message: "Security alert: Suspicious process detected" },
  { type: "critical" as const, message: "Action required: Remove threats now" },
];

export function DefenderPopups({ onComplete }: DefenderPopupsProps) {
  const [popups, setPopups] = useState<DefenderPopup[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const animationRef = useRef<number>();
  useVirusSound();

  // Bounce animation
  useEffect(() => {
    const animate = () => {
      setPopups(prev => prev.map(popup => {
        let newX = popup.x + popup.vx;
        let newY = popup.y + popup.vy;
        let newVx = popup.vx;
        let newVy = popup.vy;

        // Bounce off walls
        if (newX <= 0 || newX >= window.innerWidth - 340) {
          newVx = -newVx;
          newX = Math.max(0, Math.min(newX, window.innerWidth - 340));
        }
        if (newY <= 0 || newY >= window.innerHeight - 150) {
          newVy = -newVy;
          newY = Math.max(0, Math.min(newY, window.innerHeight - 150));
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

  useEffect(() => {
    let popupIndex = 0;
    const popupInterval = setInterval(() => {
      if (popupIndex < popupMessages.length) {
        const msg = popupMessages[popupIndex];
        const speed = 2 + Math.random() * 3;
        const angle = Math.random() * Math.PI * 2;
        setPopups(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: 50 + Math.random() * (window.innerWidth - 400),
          y: 50 + Math.random() * (window.innerHeight - 200),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          type: msg.type,
          message: msg.message,
        }]);
        popupIndex++;
      }
    }, 400);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 2, 100));
    }, 50);

    setTimeout(() => {
      clearInterval(popupInterval);
      clearInterval(progressInterval);
      onComplete();
    }, 4000);

    return () => {
      clearInterval(popupInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      {/* Windows Defender Popups - Bouncing */}
      {popups.map((popup, index) => (
        <div
          key={popup.id}
          className="absolute pointer-events-auto"
          style={{
            left: popup.x,
            top: popup.y,
            zIndex: 9998 + index,
          }}
        >
          <div className="w-[340px] bg-[#f3f3f3] border border-[#d4d4d4] shadow-md">
            {/* Windows-style header */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#e8e8e8] border-b border-[#ccc]">
              <span className="text-[#333] text-xs font-normal">Windows Security</span>
              <span className="text-[#666] text-xs cursor-pointer hover:text-[#333]">✕</span>
            </div>
            
            {/* Content */}
            <div className="p-3">
              <div className="flex items-start gap-2">
                <div className={`w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0 text-xs ${
                  popup.type === 'critical' ? 'bg-[#d32f2f] text-white' : popup.type === 'warning' ? 'bg-[#f9a825] text-[#333]' : 'bg-[#1976d2] text-white'
                }`}>
                  {popup.type === 'critical' ? '!' : popup.type === 'warning' ? '⚠' : '↻'}
                </div>
                <div className="flex-1">
                  <p className={`text-xs ${
                    popup.type === 'critical' ? 'text-[#c62828]' : 'text-[#333]'
                  }`}>{popup.message}</p>
                  {popup.type === 'scan' && (
                    <div className="mt-2">
                      <div className="h-1 bg-[#ddd] overflow-hidden">
                        <div 
                          className="h-full bg-[#1976d2] transition-all duration-100"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#666] mt-1">C:\Windows\System32\...</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-2 mt-2 justify-end">
                <button className="px-2 py-0.5 bg-[#e0e0e0] hover:bg-[#d0d0d0] border border-[#999] text-[#333] text-[10px]">
                  Dismiss
                </button>
                <button className="px-2 py-0.5 bg-[#0078d4] hover:bg-[#106ebe] text-white text-[10px] border border-[#0078d4]">
                  Take action
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
