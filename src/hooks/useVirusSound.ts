import { useEffect, useRef } from "react";

export function useVirusSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodesRef = useRef<AudioBufferSourceNode[]>([]);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const playAlarmSound = () => {
    audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;

    // Master gain for overall volume control
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.2;
    masterGain.connect(ctx.destination);

    // Low pass filter for a darker sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    filter.connect(masterGain);

    // Continuous alarm tone - alternating between two frequencies
    const alarmOsc = ctx.createOscillator();
    const alarmGain = ctx.createGain();
    alarmOsc.type = 'square';
    alarmGain.gain.value = 0.15;
    alarmOsc.connect(alarmGain);
    alarmGain.connect(filter);
    
    // Alternate between frequencies for classic alarm effect
    const now = ctx.currentTime;
    for (let i = 0; i < 60; i++) {
      const t = now + i * 0.25;
      alarmOsc.frequency.setValueAtTime(440, t);
      alarmOsc.frequency.setValueAtTime(520, t + 0.125);
    }
    alarmOsc.start();
    oscillatorsRef.current.push(alarmOsc);

    // Deep bass drone
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sawtooth';
    bassOsc.frequency.value = 55;
    bassGain.gain.value = 0.1;
    bassOsc.connect(bassGain);
    bassGain.connect(filter);
    bassOsc.start();
    oscillatorsRef.current.push(bassOsc);

    // White noise layer (constant)
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 15, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05;
    noiseSource.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start();
    sourceNodesRef.current.push(noiseSource);

    // Glitch beeps - sporadic but controlled
    const createGlitchBeep = (delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 200 + Math.random() * 800;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(filter);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.05);
    };

    // Spread glitch beeps throughout the 15 second duration
    for (let i = 0; i < 40; i++) {
      createGlitchBeep(Math.random() * 14);
    }

    // High pitched warning tone (intermittent)
    const warnOsc = ctx.createOscillator();
    const warnGain = ctx.createGain();
    warnOsc.type = 'sine';
    warnOsc.frequency.value = 1200;
    warnGain.gain.value = 0;
    warnOsc.connect(warnGain);
    warnGain.connect(filter);
    
    // Pulse the warning tone
    for (let i = 0; i < 30; i++) {
      const t = now + i * 0.5;
      warnGain.gain.setValueAtTime(0.06, t);
      warnGain.gain.setValueAtTime(0, t + 0.1);
    }
    warnOsc.start();
    oscillatorsRef.current.push(warnOsc);
  };

  const stopAlarmSound = () => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    oscillatorsRef.current = [];

    sourceNodesRef.current.forEach(src => {
      try { src.stop(); } catch (e) {}
    });
    sourceNodesRef.current = [];
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAlarmSound();
  }, []);

  return { playAlarmSound, stopAlarmSound };
}
