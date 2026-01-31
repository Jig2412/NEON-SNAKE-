import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  ...props 
}, ref) => {
  
  const colors = {
    primary: "text-[#ff0099] border-[#ff0099] hover:bg-[#ff0099] hover:text-white shadow-[0_0_10px_#ff0099]",
    secondary: "text-[#00ffff] border-[#00ffff] hover:bg-[#00ffff] hover:text-black shadow-[0_0_10px_#00ffff]",
    accent: "text-[#bd00ff] border-[#bd00ff] hover:bg-[#bd00ff] hover:text-white shadow-[0_0_10px_#bd00ff]",
    destructive: "text-[#ff3333] border-[#ff3333] hover:bg-[#ff3333] hover:text-white shadow-[0_0_10px_#ff3333]"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-xl"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative uppercase tracking-widest font-bold border-2 transition-all duration-200 rounded-sm font-display",
        colors[variant],
        sizes[size],
        "hover:shadow-[0_0_20px_currentColor] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-white",
        className
      )}
      {...props}
    >
      <span className="relative z-10 drop-shadow-md">{children}</span>
    </motion.button>
  );
});

NeonButton.displayName = "NeonButton";
