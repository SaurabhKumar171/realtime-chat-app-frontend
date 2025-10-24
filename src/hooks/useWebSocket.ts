import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { chatTypes } from "@/constants/chat/chatTypes.constant";
import { getDateTime } from "@/utils/date.utils";
import {
  type UseWebSocketOptions,
  type IncomingEvent,
} from "@/types/websockets/webSockets.types";
import { type ChatMessage } from "@/types/chat/chatTypes.types";
import { setLocalStorage } from "@/utils/localStorage.utils";

/**
 * Custom hook for managing WebSocket communication.
 * Handles connection lifecycle, reconnection logic, and typed message exchange.
 */
export const useWebSocket = ({
  url = "ws://localhost:3000",
  userName,
  onOpen,
  onClose,
}: UseWebSocketOptions) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const reconnectionAttempts = useRef(0);
  const manualClose = useRef(false);

  /** Helper to safely send JSON-encoded payloads */
  const sendRaw = useCallback((payload: unknown) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(payload));
    return true;
  }, []);

  /** Add a new message to local state */
  const addLocalMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      const payload: Record<string, unknown> = {
        type: chatTypes.TYPING,
        username: userName,
        action: isTyping ? "start" : "stop",
      };

      sendRaw(payload);
      return true;
    },
    [sendRaw, userName]
  );

  /** Send a message to the server */
  const sendMessage = useCallback(
    (input: string, type: string, sendTo?: string) => {
      const text = input.trim();
      if (!text) return;

      const payload: Record<string, unknown> = {
        type,
        message: text,
        timeStamp: getDateTime(),
        ...(sendTo ? { sendTo } : {}),
      };

      sendRaw(payload);
      return true;

      // Optionally, echo the message locally
      // const localMessage: ChatMessage = {
      //   id: uuidv4(),
      //   type,
      //   from: userName,
      //   to: sendTo,
      //   text,
      //   ts: getDateTime(),
      // };
      // addLocalMessage(localMessage);
    },
    [sendRaw, addLocalMessage, userName]
  );

  /** Initialize and manage WebSocket connection */
  const connect = useCallback(() => {
    if (!userName) return;
    manualClose.current = false;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      reconnectionAttempts.current = 0;
      onOpen?.();
      // Identify the client to the server
      const ok = sendRaw({ type: "identify", user_name: userName });
      if (ok) setLocalStorage("chat.username", userName);
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      onClose?.(event);
      if (manualClose.current) return;

      // Exponential backoff up to 5s
      const delay = Math.min(
        5000,
        300 * Math.pow(2, reconnectionAttempts.current++)
      );
      console.info(`🔁 Reconnecting in ${delay}ms...`);
      setTimeout(connect, delay);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onmessage = (event) => {
      try {
        const data: IncomingEvent = JSON.parse(event.data);

        // console.log("data. -> ", data);

        if (!data || typeof data !== "object" || !data.type) return;

        switch (data.type) {
          case "users":
            setUsers((data as any).userList || []);
            break;
          /** Broadcast / group message */
          case chatTypes.GROUP_CHAT:
          case "message": {
            const msg: ChatMessage = {
              id: (data as any).id ?? uuidv4(),
              type: data.type,
              from: (data as any).sender ?? "Unknown",
              text: (data as any).text ?? (data as any).message ?? "",
              ts: (data as any).ts ?? getDateTime(),
            };
            addLocalMessage(msg);
            break;
          }

          /** Direct message */
          case chatTypes.DIRECT_MESSAGE:
          case "dm": {
            const msg: ChatMessage = {
              id: (data as any).id ?? uuidv4(),
              type: data.type,
              from: (data as any).sender ?? "Unknown",
              to: (data as any).recipient,
              text: (data as any).text ?? "",
              ts: (data as any).ts ?? getDateTime(),
            };
            addLocalMessage(msg);
            break;
          }

          /** User count or system info */
          case "user_count": {
            setUserCount((data as any).count ?? 0);
            break;
          }

          case "system": {
            const msg: ChatMessage = {
              id: uuidv4(),
              type: "system",
              from: "System",
              text: (data as any).text ?? "System message",
              ts: getDateTime(),
            };
            addLocalMessage(msg);
            break;
          }

          case chatTypes.TYPING: {
            // console.log("In typing -> ", data?.typing_users);
            setTypingUsers(data?.typing_users);
            break;
          }

          // case "identity": {
          //   const msg: ChatMessage = {
          //     id: uuidv4(),
          //     type: "identity",
          //     user_name: "System",
          //     ts: getDateTime(),
          //   };
          //   if (msg.user_name) setLocalStorage("chat.username", msg.user_name);
          //   break;
          // }

          default:
            console.warn("⚠️ Unrecognized event type:", data.type);
        }
      } catch (error) {
        console.error("Error parsing server message:", error);
      }
    };
  }, [url, userName, onOpen, onClose, sendRaw, addLocalMessage]);

  /** Manage connection lifecycle */
  useEffect(() => {
    if (userName) connect();

    return () => {
      manualClose.current = true;
      wsRef.current?.close();
    };
  }, [connect, userName]);

  /** Return stable API for component use */
  return useMemo(
    () => ({
      isConnected,
      userCount,
      messages,
      sendMessage,
      users,
      sendTyping,
      typingUsers,
    }),
    [
      isConnected,
      userCount,
      messages,
      sendMessage,
      users,
      sendTyping,
      typingUsers,
    ]
  );
};
