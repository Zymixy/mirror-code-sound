import { useState, useEffect } from "react";

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

export function RandomAdsPopup() {
  const [popups, setPopups] = useState<PopupAd[]>([]);

  useEffect(() => {
    // Show first ad after 5 seconds
    const initialTimer = setTimeout(() => {
      addRandomAd();
    }, 5000);

    // Then show ads every 15 seconds
    const interval = setInterval(() => {
      addRandomAd();
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const addRandomAd = () => {
    const randomAd = jokeAds[Math.floor(Math.random() * jokeAds.length)];
    const newPopup: PopupAd = {
      id: Date.now(),
      ad: randomAd,
      x: 10 + Math.random() * 60,
      y: 10 + Math.random() * 50,
    };
    setPopups(prev => [...prev.slice(-4), newPopup]); // Keep max 5 popups
  };

  const closePopup = (id: number) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="fixed z-[200] pointer-events-auto"
          style={{
            left: `${popup.x}%`,
            top: `${popup.y}%`,
            animation: 'adPopIn 0.3s ease-out',
          }}
        >
          <div className="w-[260px] bg-[#ffffcc] border-2 border-[#808080] shadow-[3px_3px_0_#000]">
            {/* Win95 title bar */}
            <div className="flex items-center justify-between px-1 py-0.5 bg-gradient-to-r from-[#000080] to-[#1084d0]">
              <span className="text-white text-[10px] font-bold">Advertisement</span>
              <button
                onClick={() => closePopup(popup.id)}
                className="w-4 h-4 bg-[#c0c0c0] border border-[#fff] border-r-[#404040] border-b-[#404040] text-[10px] font-bold flex items-center justify-center hover:bg-[#d0d0d0]"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="p-2">
              <p className="text-[11px] font-bold text-[#cc0000] mb-1 leading-tight">
                {popup.ad.title}
              </p>
              <p className="text-[9px] text-[#333] mb-2 leading-tight">{popup.ad.subtitle}</p>
              <button className="w-full py-1 bg-[#c0c0c0] border-2 border-[#fff] border-r-[#404040] border-b-[#404040] text-[10px] font-bold text-[#000080] hover:bg-[#d0d0d0] active:border-[#404040] active:border-r-[#fff] active:border-b-[#fff]">
                {popup.ad.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes adPopIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
