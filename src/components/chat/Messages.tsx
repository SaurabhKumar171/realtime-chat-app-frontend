import { type ChatMessage } from "@/types/chat/chatTypes.types";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingUsers } from "./TypingUsers";

export function Messages({
  messages,
  me,
  usersTyping,
}: {
  messages: ChatMessage[];
  me: string;
  usersTyping: string[];
}) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Smooth scroll to bottom on new messages
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 thin-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <MessageBubble key={m.id} m={m} me={me} />
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Typing indicator always at the bottom */}
      <TypingUsers users={usersTyping} className="p-2" />
    </div>
  );
}
