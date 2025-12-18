import { useEffect, useRef } from "react";

export function useVirusSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAlarmSound = () => {
    // Use the myinstants audio file
    audioRef.current = new Audio("https://www.myinstants.com/media/sounds/hello-your-computer-has-virus.mp3");
    audioRef.current.volume = 0.5;
    audioRef.current.loop = true;
    audioRef.current.play().catch(console.error);
    
    // Auto-stop after 8 seconds
    setTimeout(() => {
      stopAlarmSound();
    }, 8000);
  };

  const stopAlarmSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAlarmSound();
  }, []);

  return { playAlarmSound, stopAlarmSound };
}
