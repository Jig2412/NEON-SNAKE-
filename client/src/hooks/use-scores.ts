import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Score } from "@shared/routes";
import { insertScoreSchema } from "@shared/schema";
import { z } from "zod";

export function useScores() {
  return useQuery({
    queryKey: [api.scores.list.path],
    queryFn: async () => {
      const res = await fetch(api.scores.list.path);
      if (!res.ok) throw new Error("Failed to fetch scores");
      return api.scores.list.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertScoreSchema>) => {
      const validated = insertScoreSchema.parse(data);
      const res = await fetch(api.scores.create.path, {
        method: api.scores.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        throw new Error("Failed to submit score");
      }
      return api.scores.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scores.list.path] });
    },
  });
}
