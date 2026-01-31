import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { NeonButton } from "@/components/NeonButton";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur border-destructive/50 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-destructive">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-display tracking-wider">404 ERROR</h1>
          </div>

          <p className="mt-4 text-muted-foreground font-mono">
            Did you take a wrong turn? This level does not exist.
          </p>

          <div className="mt-8">
            <Link href="/">
              <NeonButton variant="secondary" className="w-full">
                RETURN TO BASE
              </NeonButton>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
