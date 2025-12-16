import { useState, useEffect } from "react";
import { X, Heart, Gift, Trophy, Flame, Star, AlertTriangle } from "lucide-react";

interface Ad {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const jokeAds: Ad[] = [
  {
    id: 1,
    title: "🔥 HOT SINGLES IN YOUR AREA 🔥",
    subtitle: "Sarah, 23, is only 0.3km away and wants to meet YOU!",
    buttonText: "Meet Her Now",
    icon: <Heart className="w-6 h-6" />,
    color: "text-pink-600",
    bgColor: "bg-gradient-to-r from-pink-100 to-red-100",
  },
  {
    id: 2,
    title: "CONGRATULATIONS!!!",
    subtitle: "You are the 1,000,000th visitor! Click to claim your iPhone 15 Pro Max!",
    buttonText: "CLAIM NOW",
    icon: <Gift className="w-6 h-6" />,
    color: "text-green-600",
    bgColor: "bg-gradient-to-r from-green-100 to-yellow-100",
  },
  {
    id: 3,
    title: "💰 MAKE $10,000/DAY FROM HOME 💰",
    subtitle: "This mom discovered ONE WEIRD TRICK and doctors HATE her!",
    buttonText: "Learn Secret",
    icon: <Star className="w-6 h-6" />,
    color: "text-yellow-600",
    bgColor: "bg-gradient-to-r from-yellow-100 to-orange-100",
  },
  {
    id: 4,
    title: "⚠️ YOUR PC IS INFECTED! ⚠️",
    subtitle: "We detected 47 viruses on your computer. Download our cleaner NOW!",
    buttonText: "Clean PC",
    icon: <AlertTriangle className="w-6 h-6" />,
    color: "text-red-600",
    bgColor: "bg-gradient-to-r from-red-100 to-orange-100",
  },
  {
    id: 5,
    title: "🎮 YOU WON A FREE PS5! 🎮",
    subtitle: "Complete a short survey to claim your prize (5 min)",
    buttonText: "Start Survey",
    icon: <Trophy className="w-6 h-6" />,
    color: "text-purple-600",
    bgColor: "bg-gradient-to-r from-purple-100 to-blue-100",
  },
  {
    id: 6,
    title: "🌶️ LONELY MILFS NEAR YOU 🌶️",
    subtitle: "Jennifer, 35, sent you a private message...",
    buttonText: "Read Message",
    icon: <Flame className="w-6 h-6" />,
    color: "text-red-500",
    bgColor: "bg-gradient-to-r from-red-100 to-pink-100",
  },
  {
    id: 7,
    title: "LOSE 30KG IN 30 DAYS!",
    subtitle: "Scientists discover new pill that melts fat while you sleep!",
    buttonText: "Order Now",
    icon: <Star className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-gradient-to-r from-blue-100 to-cyan-100",
  },
  {
    id: 8,
    title: "🎰 FREE CASINO BONUS $500 🎰",
    subtitle: "No deposit required! Start winning real money TODAY!",
    buttonText: "Play Free",
    icon: <Gift className="w-6 h-6" />,
    color: "text-amber-600",
    bgColor: "bg-gradient-to-r from-amber-100 to-yellow-100",
  },
];

export function AdsApp() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [closedAds, setClosedAds] = useState<number[]>([]);

  useEffect(() => {
    // Shuffle and pick random ads
    const shuffled = [...jokeAds].sort(() => Math.random() - 0.5);
    setAds(shuffled.slice(0, 6));
  }, []);

  const closeAd = (id: number) => {
    setClosedAds(prev => [...prev, id]);
  };

  const visibleAds = ads.filter(ad => !closedAds.includes(ad.id));

  return (
    <div className="h-full bg-gray-100 overflow-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Special Offers Just For You!</h1>
        <p className="text-sm text-gray-600 mb-4">* Totally real and not suspicious at all *</p>
        
        <div className="space-y-3">
          {visibleAds.map((ad) => (
            <div 
              key={ad.id} 
              className={`relative ${ad.bgColor} border-2 border-dashed border-gray-400 rounded-lg p-4 shadow-md animate-pulse hover:animate-none transition-all`}
            >
              <button 
                onClick={() => closeAd(ad.id)}
                className="absolute top-2 right-2 w-5 h-5 bg-gray-500 hover:bg-gray-700 rounded-full flex items-center justify-center text-white text-xs"
              >
                <X className="w-3 h-3" />
              </button>
              
              <div className="flex items-start gap-3">
                <div className={`${ad.color} flex-shrink-0`}>
                  {ad.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold ${ad.color} text-sm leading-tight`}>
                    {ad.title}
                  </h3>
                  <p className="text-gray-700 text-xs mt-1">{ad.subtitle}</p>
                  <button className="mt-2 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded animate-bounce hover:animate-none">
                    {ad.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleAds.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>You closed all the ads... for now 😈</p>
            <button 
              onClick={() => setClosedAds([])} 
              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
            >
              Show More Ads
            </button>
          </div>
        )}

        {/* Fake banner */}
        <div className="mt-6 bg-yellow-300 border-4 border-yellow-500 p-3 text-center animate-pulse">
          <p className="text-red-600 font-bold text-lg">⚡ CLICK HERE FOR FREE MONEY ⚡</p>
          <p className="text-xs text-gray-700">*Terms and conditions may apply. By clicking you agree to sell your soul.</p>
        </div>
      </div>
    </div>
  );
}
