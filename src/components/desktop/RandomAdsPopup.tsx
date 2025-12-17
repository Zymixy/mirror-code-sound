import { useState, useEffect, useRef } from "react";

interface Ad {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
}

const jokeAds: Ad[] = [
  { id: 1, title: "HOT SINGLES IN YOUR AREA", subtitle: "Sarah, 23, is only 0.3km away and wants to meet YOU!", buttonText: "Meet Her Now" },
  { id: 2, title: "CONGRATULATIONS!!!", subtitle: "You are the 1,000,000th visitor! Click to claim your iPhone 15!", buttonText: "CLAIM NOW" },
  { id: 3, title: "MAKE $10,000/DAY FROM HOME", subtitle: "This mom discovered ONE WEIRD TRICK!", buttonText: "Learn Secret" },
  { id: 4, title: "YOUR PC IS INFECTED!", subtitle: "We detected 47 viruses on your computer!", buttonText: "Clean PC" },
  { id: 5, title: "YOU WON A FREE PS5!", subtitle: "Complete a short survey to claim your prize", buttonText: "Start Survey" },
  { id: 6, title: "LONELY MILFS NEAR YOU", subtitle: "Jennifer, 35, sent you a private message...", buttonText: "Read Message" },
  { id: 7, title: "LOSE 30KG IN 30 DAYS!", subtitle: "New pill melts fat while you sleep!", buttonText: "Order Now" },
  { id: 8, title: "FREE CASINO BONUS $500", subtitle: "No deposit required! Win real money!", buttonText: "Play Free" },
  { id: 9, title: "SEXY SINGLES WAITING", subtitle: "Maria, 28, wants to chat with you NOW", buttonText: "Chat Now" },
  { id: 10, title: "DOWNLOAD MORE RAM", subtitle: "Speed up your PC 500% with this trick!", buttonText: "Download" },
];

interface PopupAd {
  id: number;
  ad: Ad;
  x: number;
  y: number;
}

// Sound URL for "You've got mail"
const MAIL_SOUND_URL = "https://www.myinstants.com/media/sounds/yougotmail.mp3";

const playMailSound = () => {
  const audio = new Audio(MAIL_SOUND_URL);
  audio.volume = 0.3;
  audio.play().catch((e) => console.log("Audio play error:", e));
};

export function RandomAdsPopup() {
  const [popups, setPopups] = useState<PopupAd[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const getRandomInterval = () => {
    return 15000 + Math.random() * 10000; // 15-25 seconds
  };

  const addRandomAd = () => {
    const randomAd = jokeAds[Math.floor(Math.random() * jokeAds.length)];
    const newPopup: PopupAd = {
      id: Date.now(),
      ad: randomAd,
      x: 50 + Math.random() * (window.innerWidth - 300),
      y: 50 + Math.random() * (window.innerHeight - 200),
    };
    setPopups(prev => [...prev.slice(-4), newPopup]);
    playMailSound();
  };

  useEffect(() => {
    // Initial popup after 5 seconds
    const initialTimer = setTimeout(() => {
      addRandomAd();
    }, 5000);

    // Schedule next popup with random interval
    let timeoutId: NodeJS.Timeout;
    
    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        addRandomAd();
        scheduleNext();
      }, getRandomInterval());
    };
    
    scheduleNext();

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (dragging === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPopups(prev => prev.map(p => 
        p.id === dragging 
          ? { ...p, x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y }
          : p
      ));
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const closePopup = (id: number) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  const handleMouseDown = (e: React.MouseEvent, popup: PopupAd) => {
    e.preventDefault();
    dragOffset.current = {
      x: e.clientX - popup.x,
      y: e.clientY - popup.y,
    };
    setDragging(popup.id);
  };

  return (
    <>
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="fixed z-[200] pointer-events-auto select-none"
          style={{
            left: popup.x,
            top: popup.y,
            animation: dragging === popup.id ? 'none' : 'adPopIn 0.3s ease-out',
          }}
        >
          <div className="w-[240px] bg-[#c0c0c0] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-r-[#404040] border-b-[#404040] shadow-[2px_2px_0_#000]">
            {/* Win95 title bar */}
            <div 
              className="flex items-center justify-between px-1 py-0.5 bg-[#000080] cursor-move"
              onMouseDown={(e) => handleMouseDown(e, popup)}
            >
              <span className="text-[#fff] text-[10px] font-bold truncate">Advertisement</span>
              <button
                onClick={() => closePopup(popup.id)}
                className="w-4 h-4 bg-[#c0c0c0] border border-t-[#dfdfdf] border-l-[#dfdfdf] border-r-[#404040] border-b-[#404040] text-[10px] font-bold flex items-center justify-center hover:bg-[#d0d0d0] active:border-t-[#404040] active:border-l-[#404040] active:border-r-[#dfdfdf] active:border-b-[#dfdfdf]"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="p-2 bg-[#c0c0c0]">
              <p className="text-[10px] font-bold text-[#800000] mb-1 leading-tight">
                {popup.ad.title}
              </p>
              <p className="text-[9px] text-[#000] mb-2 leading-tight">{popup.ad.subtitle}</p>
              <button className="w-full py-1 bg-[#c0c0c0] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-r-[#404040] border-b-[#404040] text-[9px] font-bold text-[#000080] hover:bg-[#d0d0d0] active:border-t-[#404040] active:border-l-[#404040] active:border-r-[#dfdfdf] active:border-b-[#dfdfdf]">
                &gt;&gt; {popup.ad.buttonText} &lt;&lt;
              </button>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes adPopIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
