import { useRef } from "react";

export const useTypingNotifier = (
  onTyping: (isTyping: boolean) => void,
  delay = 1500
) => {
  const typingTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);

  const notifyTyping = () => {
    // if started typing and not already marked true -> the mark true(means started typing)
    if (!isTypingRef.current) {
      onTyping(true);
      isTypingRef.current = true;
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    //set a new timeout
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
      isTypingRef.current = false;
    }, delay); // 1500ms debounce
  };
  const stopTyping = () => {
    if (!isTypingRef.current) {
      onTyping(false);
      isTypingRef.current = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  return { notifyTyping, stopTyping };
};
