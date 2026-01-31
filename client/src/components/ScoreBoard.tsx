import { useScores } from "@/hooks/use-scores";
import { motion } from "framer-motion";
import { Trophy, Bomb, Gamepad2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function ScoreBoard() {
  const { data: scores, isLoading } = useScores();

  // Helper to sort and filter
  const getTopScores = (mode: string) => {
    if (!scores) return [];
    return scores
      .filter((s) => s.mode === mode)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const classicScores = getTopScores("classic");
  const bombScores = getTopScores("bomb");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-6 justify-center">
        <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />
        <h2 className="text-2xl font-display font-bold text-center text-white tracking-wider text-glow">
          LEADERBOARD
        </h2>
      </div>

      <Tabs defaultValue="classic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/50 mb-4">
          <TabsTrigger value="classic" className="font-display data-[state=active]:text-primary data-[state=active]:bg-primary/10">CLASSIC</TabsTrigger>
          <TabsTrigger value="bomb" className="font-display data-[state=active]:text-destructive data-[state=active]:bg-destructive/10">BOMB MODE</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classic">
          <ScoreList scores={classicScores} loading={isLoading} icon={<Gamepad2 className="w-4 h-4 text-primary" />} color="text-primary" />
        </TabsContent>
        
        <TabsContent value="bomb">
          <ScoreList scores={bombScores} loading={isLoading} icon={<Bomb className="w-4 h-4 text-destructive" />} color="text-destructive" />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function ScoreList({ scores, loading, icon, color }: { scores: any[], loading: boolean, icon: React.ReactNode, color: string }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full bg-white/5" />
        ))}
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground font-retro text-xs">
        NO SCORES RECORDED YET.
        <br />
        BE THE FIRST!
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-2">
        {scores.map((score, index) => (
          <motion.div
            key={score.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:border-white/20 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className={`font-retro text-xs w-6 text-center ${index < 3 ? "text-yellow-400" : "text-muted-foreground"}`}>
                {index + 1}.
              </span>
              <span className="font-bold text-white tracking-wide group-hover:text-glow transition-all">
                {score.playerName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {icon}
              <span className={`font-mono text-lg font-bold ${color}`}>
                {score.score.toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
