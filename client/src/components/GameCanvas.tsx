import { useEffect, useRef, useState, useCallback } from "react";
import { useSubmitScore } from "@/hooks/use-scores";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "./NeonButton";
import { Input } from "@/components/ui/input";
import { Play, RotateCcw, Home, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

// Game Constants
const GRID_SIZE = 20;
const TILE_COUNT = 30; // 30x30 grid
const GAME_SPEED_CLASSIC = 100;
const GAME_SPEED_BOMB = 80;
const CANVAS_SIZE = GRID_SIZE * TILE_COUNT;

type Point = { x: number; y: number };
type GameMode = "classic" | "bomb";

export function GameCanvas({ mode = "classic" }: { mode: GameMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "paused">("playing");
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [, setLocation] = useLocation();
  
  // Game Logic Refs (to avoid re-renders)
  const snake = useRef<Point[]>([{ x: 10, y: 10 }]);
  const food = useRef<Point>({ x: 15, y: 15 });
  const bombs = useRef<Point[]>([]);
  const velocity = useRef<Point>({ x: 0, y: 0 });
  const lastTime = useRef<number>(0);
  const bombTimer = useRef<number>(0);
  const gameLoopRef = useRef<number>(0);
  
  const submitScoreMutation = useSubmitScore();

  // Initialize Game
  const initGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    velocity.current = { x: 0, y: -1 }; // Start moving up
    bombs.current = [];
    setScore(0);
    setGameState("playing");
    placeFood();
    lastTime.current = 0;
    bombTimer.current = 0;
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame, mode]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (velocity.current.y === 1) break;
          velocity.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (velocity.current.y === -1) break;
          velocity.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (velocity.current.x === 1) break;
          velocity.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (velocity.current.x === -1) break;
          velocity.current = { x: 1, y: 0 };
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Place Food Randomly
  const placeFood = () => {
    food.current = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT),
    };
  };

  // Place Bomb Randomly (ensure not on snake or food)
  const placeBomb = () => {
    let newBomb;
    let safe = false;
    while (!safe) {
      newBomb = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT),
      };
      // Check collision with snake head (simple check)
      const collision = snake.current.some(s => s.x === newBomb?.x && s.y === newBomb?.y);
      if (!collision && (newBomb.x !== food.current.x || newBomb.y !== food.current.y)) {
        safe = true;
      }
    }
    if (newBomb) bombs.current.push(newBomb);
  };

  // Game Loop
  const update = useCallback((time: number) => {
    if (gameState !== "playing") return;

    const deltaTime = time - lastTime.current;
    const speed = mode === "classic" ? GAME_SPEED_CLASSIC : GAME_SPEED_BOMB;
    
    // Smooth movement logic would go here for interpolation, 
    // but for grid-based snake, fixed steps are often preferred for precision.
    // We update logic every 'speed' ms.

    if (deltaTime > speed) {
      lastTime.current = time;

      // Move Snake
      const head = { ...snake.current[0] };
      head.x += velocity.current.x;
      head.y += velocity.current.y;

      // Wall Collision
      if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        setGameState("gameover");
        return;
      }

      // Self Collision
      if (snake.current.some(s => s.x === head.x && s.y === head.y)) {
        setGameState("gameover");
        return;
      }

      // Bomb Collision
      if (mode === "bomb") {
        if (bombs.current.some(b => b.x === head.x && b.y === head.y)) {
          setGameState("gameover");
          return;
        }

        // Add bombs periodically
        bombTimer.current += deltaTime;
        if (bombTimer.current > 3500) { // Every 3.5s approx
          placeBomb();
          bombTimer.current = 0;
        }
      }

      // Move Logic
      snake.current.unshift(head);

      // Food Collision
      if (head.x === food.current.x && head.y === food.current.y) {
        setScore(prev => prev + (mode === "bomb" ? 15 : 10));
        placeFood();
        // Don't pop tail -> grow
      } else {
        snake.current.pop();
      }
    }

    draw();
    gameLoopRef.current = requestAnimationFrame(update);
  }, [gameState, mode]);

  // Drawing
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear Screen
    ctx.fillStyle = "#09090b"; // Background color
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Grid (subtle)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= TILE_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
      ctx.stroke();
    }

    // Draw Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffff";
    ctx.fillStyle = "#00ffff";
    ctx.beginPath();
    ctx.arc(
      food.current.x * GRID_SIZE + GRID_SIZE / 2,
      food.current.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Bombs
    if (mode === "bomb") {
      ctx.shadowColor = "#ff3333";
      ctx.fillStyle = "#ff3333";
      bombs.current.forEach(bomb => {
        ctx.beginPath();
        ctx.arc(
          bomb.x * GRID_SIZE + GRID_SIZE / 2,
          bomb.y * GRID_SIZE + GRID_SIZE / 2,
          GRID_SIZE / 2 - 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        // Pulsing core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(
          bomb.x * GRID_SIZE + GRID_SIZE / 2,
          bomb.y * GRID_SIZE + GRID_SIZE / 2,
          GRID_SIZE / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.fillStyle = "#ff3333"; // Reset
      });
    }

    // Draw Snake
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff0099";
    snake.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#ffffff" : "#ff0099"; // White head
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });
    
    // Reset shadow
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [update]);

  const handleSubmitScore = async () => {
    if (!playerName.trim()) return;
    try {
      await submitScoreMutation.mutateAsync({
        playerName,
        score,
        mode
      });
      setLocation("/"); // Go back to home after submit
    } catch (e) {
      console.error(e);
    }
  };

  const handleMove = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameState !== "playing") return;
    
    switch (dir) {
      case 'UP':
        if (velocity.current.y === 1) break;
        velocity.current = { x: 0, y: -1 };
        break;
      case 'DOWN':
        if (velocity.current.y === -1) break;
        velocity.current = { x: 0, y: 1 };
        break;
      case 'LEFT':
        if (velocity.current.x === 1) break;
        velocity.current = { x: -1, y: 0 };
        break;
      case 'RIGHT':
        if (velocity.current.x === -1) break;
        velocity.current = { x: 1, y: 0 };
        break;
    }
  };

  const touchStart = useRef<Point | null>(null);

  // Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStart.current.x;
    const diffY = touch.clientY - touchStart.current.y;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);
    
    if (Math.max(absX, absY) > 30) { // Threshold
      if (absX > absY) {
        handleMove(diffX > 0 ? 'RIGHT' : 'LEFT');
      } else {
        handleMove(diffY > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStart.current = null;
  };

  return (
    <div 
      className="relative flex flex-col items-center touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* HUD */}
      <div className="w-full max-w-[600px] flex justify-between items-center mb-4 px-4 py-2 bg-black/40 border border-white/10 rounded-full backdrop-blur">
        <div className="font-retro text-xs text-muted-foreground uppercase tracking-wider">
          MODE: <span className={mode === "bomb" ? "text-destructive" : "text-primary"}>{mode}</span>
        </div>
        <div className="font-display font-bold text-2xl text-white text-glow">
          {score.toString().padStart(6, '0')}
        </div>
      </div>

      {/* Canvas Container with Neon Border */}
      <div className="relative p-1 rounded-lg bg-gradient-to-br from-primary via-purple-500 to-secondary animate-gradient-xy shadow-[0_0_30px_rgba(255,0,153,0.3)] w-full max-w-[600px] aspect-square">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-background rounded shadow-inner block w-full h-full"
        />

        {/* Overlay for Game Over */}
        <AnimatePresence>
          {gameState === "gameover" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded"
            >
              <h2 className="text-4xl font-display font-bold text-destructive mb-2 text-glow">GAME OVER</h2>
              <p className="text-white font-retro text-sm mb-6">FINAL SCORE: {score}</p>
              
              <div className="w-64 space-y-4">
                <Input
                  placeholder="ENTER INITIALS"
                  maxLength={3}
                  className="bg-black/50 border-primary text-center font-retro text-lg uppercase tracking-[0.5em]"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                  autoFocus
                />
                
                <NeonButton 
                  onClick={handleSubmitScore} 
                  className="w-full"
                  disabled={submitScoreMutation.isPending || !playerName}
                >
                  {submitScoreMutation.isPending ? "SAVING..." : "SAVE SCORE"}
                </NeonButton>
                
                <div className="flex gap-2">
                  <NeonButton variant="secondary" size="sm" onClick={initGame} className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    RETRY
                  </NeonButton>
                  <NeonButton variant="accent" size="sm" onClick={() => setLocation("/")} className="flex-1">
                    <Home className="w-4 h-4 mr-2" />
                    EXIT
                  </NeonButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Controls Hint */}
      <div className="mt-6 text-white/40 font-retro text-[10px] text-center hidden md:block">
        USE ARROW KEYS OR WASD TO MOVE
      </div>

      {/* Mobile Controls */}
      <div className="mt-8 grid grid-cols-3 gap-2 md:hidden touch-none select-none">
        <div />
        <NeonButton 
          size="sm" 
          className="w-16 h-16 p-0 flex items-center justify-center rounded-full active:scale-90"
          onPointerDown={(e) => { e.preventDefault(); handleMove('UP'); }}
        >
          <ChevronUp className="w-8 h-8" />
        </NeonButton>
        <div />
        
        <NeonButton 
          size="sm" 
          className="w-16 h-16 p-0 flex items-center justify-center rounded-full active:scale-90"
          onPointerDown={(e) => { e.preventDefault(); handleMove('LEFT'); }}
        >
          <ChevronLeft className="w-8 h-8" />
        </NeonButton>
        
        <NeonButton 
          size="sm" 
          className="w-16 h-16 p-0 flex items-center justify-center rounded-full active:scale-90"
          onPointerDown={(e) => { e.preventDefault(); handleMove('DOWN'); }}
        >
          <ChevronDown className="w-8 h-8" />
        </NeonButton>
        
        <NeonButton 
          size="sm" 
          className="w-16 h-16 p-0 flex items-center justify-center rounded-full active:scale-90"
          onPointerDown={(e) => { e.preventDefault(); handleMove('RIGHT'); }}
        >
          <ChevronRight className="w-8 h-8" />
        </NeonButton>
      </div>
    </div>
  );
}
