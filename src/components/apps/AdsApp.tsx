import { useState, useEffect } from "react";

interface Ad {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
}

const jokeAds: Ad[] = [
  {
    id: 1,
    title: "HOT SINGLES IN YOUR AREA",
    subtitle: "Sarah, 23, is only 0.3km away and wants to meet YOU!",
    buttonText: "Meet Her Now",
  },
  {
    id: 2,
    title: "CONGRATULATIONS!!!",
    subtitle: "You are the 1,000,000th visitor! Click to claim your iPhone 15 Pro Max!",
    buttonText: "CLAIM NOW",
  },
  {
    id: 3,
    title: "MAKE $10,000/DAY FROM HOME",
    subtitle: "This mom discovered ONE WEIRD TRICK and doctors HATE her!",
    buttonText: "Learn Secret",
  },
  {
    id: 4,
    title: "YOUR PC IS INFECTED!",
    subtitle: "We detected 47 viruses on your computer. Download our cleaner NOW!",
    buttonText: "Clean PC",
  },
  {
    id: 5,
    title: "YOU WON A FREE PS5!",
    subtitle: "Complete a short survey to claim your prize (5 min)",
    buttonText: "Start Survey",
  },
  {
    id: 6,
    title: "LONELY MILFS NEAR YOU",
    subtitle: "Jennifer, 35, sent you a private message...",
    buttonText: "Read Message",
  },
  {
    id: 7,
    title: "LOSE 30KG IN 30 DAYS!",
    subtitle: "Scientists discover new pill that melts fat while you sleep!",
    buttonText: "Order Now",
  },
  {
    id: 8,
    title: "FREE CASINO BONUS $500",
    subtitle: "No deposit required! Start winning real money TODAY!",
    buttonText: "Play Free",
  },
];

interface PopupAd {
  id: number;
  ad: Ad;
  position: number;
}

export function AdsApp() {
  const [popupAds, setPopupAds] = useState<PopupAd[]>([]);

  useEffect(() => {
    const shuffled = [...jokeAds].sort(() => Math.random() - 0.5);
    const initial = shuffled.slice(0, 4).map((ad, index) => ({
      id: Date.now() + index,
      ad,
      position: index,
    }));
    setPopupAds(initial);
  }, []);

  const closePopup = (id: number) => {
    setPopupAds(prev => prev.filter(p => p.id !== id));
  };

  const showMoreAds = () => {
    const shuffled = [...jokeAds].sort(() => Math.random() - 0.5);
    const newAds = shuffled.slice(0, 4).map((ad, index) => ({
      id: Date.now() + index,
      ad,
      position: index,
    }));
    setPopupAds(newAds);
  };

  return (
    <div className="h-full bg-[#c0c0c0] overflow-auto p-2">
      <div className="text-center mb-4">
        <h1 className="text-sm font-bold text-[#000080]">Special Offers!</h1>
        <p className="text-xs text-[#333]">* Totally real and not suspicious *</p>
      </div>

      {/* Popup-style ads stacked from bottom right */}
      <div className="fixed bottom-12 right-4 z-[100] flex flex-col-reverse gap-2 pointer-events-auto">
        {popupAds.map((popup) => (
          <div
            key={popup.id}
            className="w-[280px] bg-[#ffffcc] border-2 border-[#808080] shadow-[2px_2px_0_#000]"
            style={{ animation: 'popIn 0.2s ease-out' }}
          >
            {/* Old-style title bar */}
            <div className="flex items-center justify-between px-1 py-0.5 bg-gradient-to-r from-[#000080] to-[#1084d0]">
              <span className="text-white text-[10px] font-bold truncate">Advertisement</span>
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
        ))}
      </div>

      {popupAds.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[#333] text-xs mb-2">You closed all the ads...</p>
          <button
            onClick={showMoreAds}
            className="px-3 py-1 bg-[#c0c0c0] border-2 border-[#fff] border-r-[#404040] border-b-[#404040] text-xs font-bold hover:bg-[#d0d0d0]"
          >
            Show More Ads
          </button>
        </div>
      )}

      {/* Old-style banner */}
      <div className="mt-4 bg-[#ffff00] border-2 border-[#000] p-2 text-center">
        <p className="text-[#ff0000] font-bold text-sm blink">CLICK HERE FOR FREE MONEY</p>
        <p className="text-[8px] text-[#333]">*Terms apply. You agree to sell your soul.</p>
      </div>

      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
