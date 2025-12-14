import { useEffect, useRef } from "react";

export function useVirusSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const playAlarmSound = () => {
    // Create audio context
    audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;

    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(ctx.destination);

    // Function to create an oscillator
    const createOscillator = (frequency: number, type: OscillatorType, delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.value = frequency;
      
      // Pulsing effect
      gain.gain.value = 0;
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      // Start after delay
      osc.start(ctx.currentTime + delay);
      
      // Pulsing automation
      const pulseRate = 0.15;
      for (let i = 0; i < 50; i++) {
        const time = ctx.currentTime + delay + i * pulseRate;
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.setValueAtTime(0.1, time + pulseRate * 0.5);
      }
      
      oscillatorsRef.current.push(osc);
      return osc;
    };

    // Create alarm frequencies (classic alarm pattern)
    createOscillator(800, 'square', 0);
    createOscillator(600, 'square', 0.15);
    
    // Add a siren effect
    const sirenOsc = ctx.createOscillator();
    const sirenGain = ctx.createGain();
    sirenOsc.type = 'sawtooth';
    sirenGain.gain.value = 0.15;
    sirenOsc.connect(sirenGain);
    sirenGain.connect(masterGain);
    
    // Siren frequency sweep
    sirenOsc.frequency.setValueAtTime(400, ctx.currentTime);
    for (let i = 0; i < 20; i++) {
      const time = ctx.currentTime + i * 0.5;
      sirenOsc.frequency.linearRampToValueAtTime(800, time + 0.25);
      sirenOsc.frequency.linearRampToValueAtTime(400, time + 0.5);
    }
    
    sirenOsc.start();
    oscillatorsRef.current.push(sirenOsc);

    // Add glitchy beeps
    for (let i = 0; i < 30; i++) {
      const freq = 200 + Math.random() * 1000;
      const delay = Math.random() * 5;
      const glitchOsc = ctx.createOscillator();
      const glitchGain = ctx.createGain();
      
      glitchOsc.type = 'square';
      glitchOsc.frequency.value = freq;
      glitchGain.gain.value = 0.05;
      
      glitchOsc.connect(glitchGain);
      glitchGain.connect(masterGain);
      
      glitchOsc.start(ctx.currentTime + delay);
      glitchOsc.stop(ctx.currentTime + delay + 0.05 + Math.random() * 0.1);
    }
  };

  const stopAlarmSound = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator may have already stopped
      }
    });
    oscillatorsRef.current = [];
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAlarmSound();
    };
  }, []);

  return { playAlarmSound, stopAlarmSound };
}
