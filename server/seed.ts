import { storage } from "./storage";

export async function seedDatabase() {
  const existingScores = await storage.getScores();
  if (existingScores.length === 0) {
    console.log("Seeding initial high scores...");
    await storage.createScore({ playerName: "SNAKE_KING", score: 1000, mode: "classic" });
    await storage.createScore({ playerName: "NEON_USER", score: 850, mode: "bomb" });
    await storage.createScore({ playerName: "RETRO_FAN", score: 500, mode: "classic" });
    await storage.createScore({ playerName: "BOMBERMAN", score: 1200, mode: "bomb" });
    await storage.createScore({ playerName: "NEWBIE", score: 100, mode: "classic" });
    console.log("Seeding complete.");
  }
}
