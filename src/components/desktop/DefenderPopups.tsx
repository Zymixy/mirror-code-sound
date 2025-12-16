import { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";
import { useVirusSound } from "@/hooks/useVirusSound";

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
  useVirusSound();

  useEffect(() => {
    let popupIndex = 0;
    const popupInterval = setInterval(() => {
      if (popupIndex < popupMessages.length) {
        const msg = popupMessages[popupIndex];
        setPopups(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: 15 + Math.random() * 35,
          y: 8 + Math.random() * 45,
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
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      {/* Windows Defender Popups - White/Light theme */}
      {popups.map((popup, index) => (
        <div
          key={popup.id}
          className="absolute pointer-events-auto"
          style={{
            left: `${popup.x + index * 1.5}%`,
            top: `${popup.y + index * 2}%`,
            animation: 'defenderSlide 0.2s ease-out',
            zIndex: 9998 + index,
          }}
        >
          <div className="w-[360px] bg-white border border-gray-300 rounded shadow-xl">
            {/* Windows-style header */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-gray-800 text-xs font-medium">Windows Security</span>
              </div>
              <X className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700 cursor-pointer" />
            </div>
            
            {/* Content */}
            <div className="p-3">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  popup.type === 'critical' ? 'bg-red-100' : popup.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  <Shield className={`w-4 h-4 ${
                    popup.type === 'critical' ? 'text-red-600' : popup.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    popup.type === 'critical' ? 'text-red-700' : 'text-gray-800'
                  }`}>{popup.message}</p>
                  {popup.type === 'scan' && (
                    <div className="mt-2">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-100"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">C:\Windows\System32\...</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-2 mt-3 justify-end">
                <button className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs rounded transition-colors">
                  Dismiss
                </button>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                  Take action
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Taskbar notification */}
      <div 
        className="fixed bottom-12 right-4 pointer-events-auto"
        style={{ animation: 'slideUp 0.2s ease-out 0.5s both' }}
      >
        <div className="bg-white border border-gray-300 rounded shadow-lg p-3 w-[280px]">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-yellow-600" />
            <span className="text-gray-800 text-xs font-medium">Windows Security</span>
          </div>
          <p className="text-gray-600 text-xs">Threats detected. Action recommended.</p>
        </div>
      </div>

      <style>{`
        @keyframes defenderSlide {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
