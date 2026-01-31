import { NeonButton } from "@/components/NeonButton";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Gamepad2, Bomb, Trophy } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showScores, setShowScores] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center gap-12 md:gap-24">
        
        {/* Left Side: Title & Menu */}
        <div className="flex flex-col items-center md:items-start space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <h1 className="text-6xl md:text-8xl font-black font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,0,153,0.8)]">
              NEON
              <br />
              <span className="text-primary drop-shadow-[0_0_25px_rgba(255,0,153,1)]">SNAKE</span>
            </h1>
            <p className="mt-4 text-cyan-400 font-retro text-xs md:text-sm tracking-widest animate-pulse">
              INSERT COIN TO START
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <NeonButton 
              variant="primary" 
              onClick={() => setLocation("/game/classic")}
              className="w-full flex items-center justify-center gap-3"
            >
              <Gamepad2 className="w-5 h-5" />
              PLAY CLASSIC
            </NeonButton>
            
            <NeonButton 
              variant="destructive" 
              onClick={() => setLocation("/game/bomb")}
              className="w-full flex items-center justify-center gap-3"
            >
              <Bomb className="w-5 h-5" />
              BOMB MODE
            </NeonButton>
            
            <Dialog open={showScores} onOpenChange={setShowScores}>
              <DialogTrigger asChild>
                <NeonButton variant="accent" className="w-full flex items-center justify-center gap-3">
                  <Trophy className="w-5 h-5" />
                  HIGH SCORES
                </NeonButton>
              </DialogTrigger>
              <DialogContent className="bg-transparent border-none shadow-none max-w-md p-0">
                <ScoreBoard />
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Right Side: Decorative Graphic / Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="hidden md:block relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-[100px] opacity-30 animate-pulse"></div>
          <div className="w-80 h-80 border-4 border-white/10 rounded-xl bg-black/40 backdrop-blur relative overflow-hidden grid grid-cols-10 grid-rows-10 gap-0.5 p-2 shadow-2xl rotate-3 transform hover:rotate-0 transition-transform duration-500">
             {/* Decorative Grid items simulating a game state */}
             {[...Array(100)].map((_, i) => {
               const x = i % 10;
               const y = Math.floor(i / 10);
               // Mock snake shape
               const isSnake = (y === 5 && x > 2 && x < 8);
               const isHead = (y === 5 && x === 7);
               const isFood = (y === 2 && x === 8);
               const isBomb = (y === 7 && x === 3);
               
               return (
                 <div 
                   key={i} 
                   className={`
                     rounded-sm transition-all duration-1000
                     ${isHead ? "bg-white shadow-[0_0_10px_white]" : 
                       isSnake ? "bg-primary shadow-[0_0_5px_var(--primary)]" :
                       isFood ? "bg-secondary shadow-[0_0_10px_var(--secondary)] animate-pulse" :
                       isBomb ? "bg-destructive shadow-[0_0_10px_var(--destructive)]" :
                       "bg-white/5"}
                   `}
                 />
               );
             })}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center w-full">
        <p className="text-white/20 font-mono text-xs">
          USE ARROW KEYS OR WASD • AVOID WALLS • EAT DOTS
        </p>
      </footer>
    </div>
  );
}
