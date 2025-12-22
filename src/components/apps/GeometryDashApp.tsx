import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface Obstacle {
  x: number;
  type: "spike" | "block";
  passed: boolean;
}

export function GeometryDashApp() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "dead">("menu");
  const [playerY, setPlayerY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [groundOffset, setGroundOffset] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const GRAVITY = 0.8;
  const JUMP_FORCE = -14;
  const GROUND_Y = 0;
  const GAME_SPEED = 6;
  const PLAYER_SIZE = 40;
  const OBSTACLE_WIDTH = 40;

  const playSound = useCallback((type: "jump" | "death" | "score") => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === "jump") {
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === "death") {
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === "score") {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05);
    }
  }, [soundEnabled]);

  const jump = useCallback(() => {
    if (gameState === "playing" && playerY <= 5) {
      setVelocity(JUMP_FORCE);
      playSound("jump");
    }
  }, [gameState, playerY, playSound]);

  const startGame = useCallback(() => {
    setGameState("playing");
    setPlayerY(0);
    setVelocity(0);
    setObstacles([]);
    setScore(0);
    setRotation(0);
    setGroundOffset(0);
  }, []);

  const die = useCallback(() => {
    setGameState("dead");
    playSound("death");
    if (score > highScore) {
      setHighScore(score);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [score, highScore, playSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (gameState === "menu" || gameState === "dead") {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, jump, startGame]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      setVelocity((v) => v + GRAVITY);
      setPlayerY((y) => {
        const newY = y + velocity;
        if (newY <= GROUND_Y) {
          setVelocity(0);
          return GROUND_Y;
        }
        return newY;
      });

      setRotation((r) => {
        if (playerY > 5) {
          return r + 8;
        }
        return Math.round(r / 90) * 90;
      });

      setGroundOffset((o) => (o + GAME_SPEED) % 40);

      setObstacles((obs) => {
        let newObs = obs
          .map((o) => ({ ...o, x: o.x - GAME_SPEED }))
          .filter((o) => o.x > -OBSTACLE_WIDTH);

        // Check for passed obstacles
        newObs = newObs.map((o) => {
          if (!o.passed && o.x + OBSTACLE_WIDTH < 80) {
            playSound("score");
            setScore((s) => s + 1);
            return { ...o, passed: true };
          }
          return o;
        });

        // Add new obstacles
        if (newObs.length === 0 || newObs[newObs.length - 1].x < 400) {
          const lastX = newObs.length > 0 ? newObs[newObs.length - 1].x : 500;
          const gap = 200 + Math.random() * 150;
          newObs.push({
            x: lastX + gap,
            type: Math.random() > 0.3 ? "spike" : "block",
            passed: false,
          });
        }

        return newObs;
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, velocity, playerY, playSound]);

  // Collision detection
  useEffect(() => {
    if (gameState !== "playing") return;

    const playerLeft = 80;
    const playerRight = playerLeft + PLAYER_SIZE;
    const playerBottom = playerY;
    const playerTop = playerY + PLAYER_SIZE;

    for (const obs of obstacles) {
      const obsLeft = obs.x;
      const obsRight = obs.x + OBSTACLE_WIDTH;
      const obsTop = obs.type === "spike" ? 35 : OBSTACLE_WIDTH;

      if (playerRight > obsLeft + 10 && playerLeft < obsRight - 10) {
        if (obs.type === "spike") {
          if (playerBottom < obsTop - 5) {
            die();
            return;
          }
        } else {
          if (playerBottom < obsTop) {
            die();
            return;
          }
        }
      }
    }
  }, [gameState, playerY, obstacles, die]);

  const handleClick = () => {
    if (gameState === "menu" || gameState === "dead") {
      startGame();
    } else {
      jump();
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex flex-col overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/30">
        <div className="flex items-center gap-4">
          <span className="text-cyan-400 font-bold text-lg">SCORE: {score}</span>
          <span className="text-yellow-400 font-bold text-sm">BEST: {highScore}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-white hover:bg-white/10"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>

      {/* Game Area */}
      <div
        ref={gameRef}
        onClick={handleClick}
        className="flex-1 relative cursor-pointer overflow-hidden"
      >
        {/* Stars background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.7,
              }}
            />
          ))}
        </div>

        {/* Ground with pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#2d2d44] to-[#1a1a2e] border-t-4 border-cyan-500/50">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 38px, #00ffff33 38px, #00ffff33 40px)`,
              transform: `translateX(-${groundOffset}px)`,
            }}
          />
        </div>

        {/* Player */}
        <div
          className="absolute w-10 h-10 transition-none"
          style={{
            left: "80px",
            bottom: `${64 + playerY}px`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded-sm shadow-lg shadow-cyan-500/50 border-2 border-cyan-300">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-80" />
          </div>
        </div>

        {/* Obstacles */}
        {obstacles.map((obs, i) => (
          <div
            key={i}
            className="absolute transition-none"
            style={{
              left: `${obs.x}px`,
              bottom: "64px",
            }}
          >
            {obs.type === "spike" ? (
              <div className="relative">
                <div
                  className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-red-500"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(255, 0, 0, 0.5))",
                  }}
                />
              </div>
            ) : (
              <div
                className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-sm border-2 border-orange-400"
                style={{
                  boxShadow: "0 0 15px rgba(255, 100, 0, 0.5)",
                }}
              />
            )}
          </div>
        ))}

        {/* Menu/Death overlay */}
        {gameState !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
              {gameState === "menu" ? "GEOMETRY DASH" : "GAME OVER"}
            </h1>
            {gameState === "dead" && (
              <p className="text-xl text-cyan-300 mb-4">Score: {score}</p>
            )}
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-3 text-lg"
            >
              {gameState === "menu" ? (
                <>
                  <Play className="w-5 h-5 mr-2" /> PLAY
                </>
              ) : (
                <>
                  <RotateCcw className="w-5 h-5 mr-2" /> RETRY
                </>
              )}
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              Press SPACE or click to jump
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
