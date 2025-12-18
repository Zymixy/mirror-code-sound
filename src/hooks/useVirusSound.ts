import { useEffect, useRef } from "react";

export function useVirusSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  const playAlarmSound = () => {
    // Create audio context
    audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;

    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.25;
    masterGain.connect(ctx.destination);

    // Distortion for more chaos
    const distortion = ctx.createWaveShaper();
    const makeDistortionCurve = (amount: number) => {
      const samples = 44100;
      const curve = new Float32Array(samples);
      for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1;
        curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
      }
      return curve;
    };
    distortion.curve = makeDistortionCurve(50);
    distortion.connect(masterGain);

    // Create chaotic glitch sounds
    const createGlitchOsc = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = ['square', 'sawtooth', 'triangle'][Math.floor(Math.random() * 3)] as OscillatorType;
      osc.frequency.value = 100 + Math.random() * 2000;
      gain.gain.value = 0.1 + Math.random() * 0.2;
      
      osc.connect(gain);
      gain.connect(distortion);
      
      osc.start();
      oscillatorsRef.current.push(osc);
      
      // Random frequency jumps
      const freqInterval = setInterval(() => {
        if (osc.frequency) {
          osc.frequency.value = 50 + Math.random() * 3000;
        }
      }, 50 + Math.random() * 100);
      intervalsRef.current.push(freqInterval);
      
      return osc;
    };

    // Create multiple glitch oscillators
    for (let i = 0; i < 4; i++) {
      setTimeout(() => createGlitchOsc(), i * 200);
    }

    // Add noise generator
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.08;
    noise.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    // Bitcrusher-like effect with rapid frequency modulation
    const bitcrushOsc = ctx.createOscillator();
    const bitcrushGain = ctx.createGain();
    bitcrushOsc.type = 'square';
    bitcrushGain.gain.value = 0.15;
    bitcrushOsc.connect(bitcrushGain);
    bitcrushGain.connect(distortion);
    
    // Crazy frequency automation
    const automate = () => {
      const now = ctx.currentTime;
      for (let i = 0; i < 100; i++) {
        const time = now + i * 0.1;
        bitcrushOsc.frequency.setValueAtTime(Math.random() * 1500 + 100, time);
      }
    };
    automate();
    bitcrushOsc.start();
    oscillatorsRef.current.push(bitcrushOsc);

    // Add stuttering bass
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sawtooth';
    bassOsc.frequency.value = 80;
    bassGain.gain.value = 0;
    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start();
    oscillatorsRef.current.push(bassOsc);
    
    // Stutter effect
    const stutterInterval = setInterval(() => {
      bassGain.gain.value = Math.random() > 0.5 ? 0.2 : 0;
      bassOsc.frequency.value = [40, 60, 80, 100][Math.floor(Math.random() * 4)];
    }, 100);
    intervalsRef.current.push(stutterInterval);
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
    
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];
    
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
