import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

export function ChatHeader({
  isConnected,
  count,
  username,
  onToggleUsers,
  className,
}: {
  isConnected: boolean;
  count: number;
  username: string;
  onToggleUsers?: () => void;
  className?: string;
}) {
  const spring = useSpring(count, { stiffness: 200, damping: 20 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  useEffect(() => {
    spring.set(count);
  }, [count, spring]);

  return (
    <div
      className={cn(
        "sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-white/10",
        "bg-gradient-to-r from-transparent via-white/5 to-transparent",
        "px-4 sm:px-6 py-3 flex items-center justify-between",
        className
      )}
    >
      {isConnected && (
        <div className="flex items-center gap-3">
          <div
            className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_theme(colors.emerald.400)]"
            aria-hidden
          />
          <div className="text-sm text-muted-foreground">Connected</div>
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4 opacity-70" />
          <motion.span className="tabular-nums font-medium">
            {rounded}
          </motion.span>
        </div>
        <div className="text-sm">
          <span className="opacity-60">You:</span>{" "}
          <span className="font-semibold">{username}</span>
        </div>
        <div className="sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleUsers}
            className={cn("cursor-pointer text-black")}
          >
            <Users className="mr-2 size-4" />
            {count}
          </Button>
        </div>
      </div>
    </div>
  );
}
