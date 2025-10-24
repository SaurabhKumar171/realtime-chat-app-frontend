import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TypingUsersProps {
  users: string[]; // array of usernames currently typing
  className?: string;
}

export const TypingUsers: React.FC<TypingUsersProps> = ({
  users,
  className,
}) => {
  if (!users || users.length === 0) return null;

  const text =
    users.length === 1
      ? `${users[0]} is typing...`
      : `${users.join(", ")} are typing...`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        className={`text-sm text-gray-400 italic ${className}`}
      >
        {text}
      </motion.div>
    </AnimatePresence>
  );
};
