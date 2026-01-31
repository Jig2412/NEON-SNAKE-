import { GameCanvas } from "@/components/GameCanvas";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Game() {
  const [match, params] = useRoute("/game/:mode");
  const mode = (params?.mode as "classic" | "bomb") || "classic";

  if (!match) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <div className="scanline"></div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        <Link href="/" className="inline-flex items-center text-white/50 hover:text-white mb-6 font-retro text-xs transition-colors hover:drop-shadow-[0_0_5px_white]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK TO MENU
        </Link>
        
        <GameCanvas mode={mode} />
      </motion.div>
    </div>
  );
}
