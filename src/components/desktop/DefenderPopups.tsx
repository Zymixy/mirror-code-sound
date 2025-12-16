import { useState, useEffect } from "react";
import { Shield, AlertTriangle, X } from "lucide-react";

interface DefenderPopup {
  id: number;
  x: number;
  y: number;
  type: "warning" | "critical" | "scan";
  message: string;
}

interface DefenderPopupsProps {
  onComplete: () => void;
}

const popupMessages = [
  { type: "warning" as const, message: "Windows Defender has detected suspicious activity" },
  { type: "critical" as const, message: "CRITICAL: Malware detected in system32" },
  { type: "scan" as const, message: "Scanning files... Threat found!" },
  { type: "warning" as const, message: "Firewall breach detected" },
  { type: "critical" as const, message: "URGENT: System files compromised" },
  { type: "scan" as const, message: "Trojan.Win32.Generic detected" },
  { type: "warning" as const, message: "Unauthorized access attempt blocked" },
  { type: "critical" as const, message: "ALERT: Ransomware signature found" },
];

export function DefenderPopups({ onComplete }: DefenderPopupsProps) {
  const [popups, setPopups] = useState<DefenderPopup[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Add popups progressively
    let popupIndex = 0;
    const popupInterval = setInterval(() => {
      if (popupIndex < popupMessages.length) {
        const msg = popupMessages[popupIndex];
        setPopups(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: 20 + Math.random() * 40,
          y: 10 + Math.random() * 50,
          type: msg.type,
          message: msg.message,
        }]);
        popupIndex++;
      }
    }, 400);

    // Update scan progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 2, 100));
    }, 50);

    // Transition to main virus effect
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
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      {/* Subtle red pulse on edges */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px rgba(255,0,0,0.2)',
          animation: 'edgePulse 1s ease-in-out infinite',
        }}
      />

      {/* Windows Defender Popups */}
      {popups.map((popup, index) => (
        <div
          key={popup.id}
          className="absolute pointer-events-auto shadow-2xl"
          style={{
            left: `${popup.x + index * 2}%`,
            top: `${popup.y + index * 3}%`,
            animation: 'defenderPopIn 0.3s ease-out',
            zIndex: 9998 + index,
          }}
        >
          <div className="w-[380px] bg-[#1a1a2e] border border-red-500/50 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 flex items-center gap-3">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm flex-1">Windows Defender</span>
              <X className="w-4 h-4 text-white/70 hover:text-white cursor-pointer" />
            </div>
            
            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-10 h-10 ${popup.type === 'critical' ? 'text-red-500' : 'text-yellow-500'} flex-shrink-0`} />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm mb-2">{popup.message}</p>
                  {popup.type === 'scan' && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 transition-all duration-100"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Scanning: C:\Windows\System32\...</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-2 mt-4 justify-end">
                <button className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors">
                  Ignore
                </button>
                <button className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded transition-colors">
                  Remove Threat
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Taskbar notification popup */}
      <div 
        className="fixed bottom-12 right-4 pointer-events-auto"
        style={{ animation: 'slideInRight 0.3s ease-out 0.5s both' }}
      >
        <div className="bg-[#1f1f1f] border border-gray-700 rounded-lg p-3 w-[300px] shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="text-white text-xs font-medium">Windows Security</span>
          </div>
          <p className="text-gray-300 text-xs">Multiple threats detected. Immediate action required.</p>
        </div>
      </div>

      <style>{`
        @keyframes defenderPopIn {
          0% { 
            opacity: 0; 
            transform: scale(0.8) translateY(-20px); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        @keyframes edgePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes slideInRight {
          0% { 
            opacity: 0; 
            transform: translateX(100%); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
      `}</style>
    </div>
  );
}
