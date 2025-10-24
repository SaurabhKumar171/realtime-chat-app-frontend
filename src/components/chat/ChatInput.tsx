import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTypingNotifier } from "@/hooks/useTypingNotifier";

const ChatInput = ({
  onSend,
  className,
  onTyping,
}: {
  onSend: (text: string, type: string, sendTo?: string) => boolean | void;
  className?: string;
  sendTo?: string;
  onTyping: (isTyping: boolean) => boolean;
}) => {
  const [input, setInput] = useState<string>("");
  const { notifyTyping, stopTyping } = useTypingNotifier(
    onTyping || (() => {})
  );

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const ok = onSend(input, "message");
    if (ok) setInput("");

    stopTyping();
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);

    notifyTyping();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("border-t border-white/10 p-3 sm:p-4", className)}
    >
      <div className="relative flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => handleChange(e)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or /dm <user> <msg>..."
          className={cn(
            "flex-1 rounded-xl bg-white/5 text-white placeholder:text-white/50",
            "px-4 py-3 outline-none border border-white/10",
            "focus:border-white/20 focus:ring-2 focus:ring-white/10 transition"
          )}
        />
        <Button
          onClick={handleSend}
          className="rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-[0_10px_30px_-10px_rgba(99,102,241,0.6)] hover:opacity-90"
        >
          <Send className="size-4" />
          Send
        </Button>
      </div>
    </motion.div>
  );
};

export default ChatInput;
