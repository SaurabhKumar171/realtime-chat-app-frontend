import { type ChatMessage } from "@/types/chat/chatTypes.types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ m, me }: { m: ChatMessage; me: string }) {
  if (m.type === "system") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs italic text-muted-foreground/80 text-center py-1"
      >
        {m.text}
      </motion.div>
    );
  }

  const isMe = m.from === me;
  const isDm = m.type === "dm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-3 py-2 shadow-lg backdrop-blur",
          "border border-white/10",
          isDm
            ? "bg-gradient-to-br from-fuchsia-500/15 to-cyan-500/15 text-white shadow-[0_0_20px_rgba(217,70,239,0.15)]"
            : isMe
            ? "bg-white/10 text-white"
            : "bg-white/5 text-white/95"
        )}
      >
        <div className="text-[10px] uppercase tracking-wide text-white/60 flex items-center gap-2 mb-1">
          <span className="tabular-nums opacity-70">[{formatTime(m.ts)}]</span>
          <span className={cn("font-semibold", isMe && "text-white")}>
            {m.from ?? ""}
          </span>
          {isDm && (
            <span className="rounded bg-white/10 px-1 py-0.5 text-[9px]">
              DM
            </span>
          )}
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {m.text}
        </div>
      </div>
    </motion.div>
  );
}
