import { useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import Login from "@/components/chat/Login";
import ChatLayout from "@/components/chat/ChatLayout";

/**
 * Chat Component
 * Handles user login, message sending, and real-time chat display via WebSocket.
 */
const Chat = () => {
  const [userName, setUserName] = useState<string | null>(() => {
    const saved = localStorage.getItem("chat.username");
    return saved || null;
  });

  const {
    isConnected,
    userCount,
    messages,
    sendMessage,
    users,
    sendTyping,
    typingUsers,
  } = useWebSocket({
    // url: "ws://localhost:3000",
    url: "wss://realtime-chat-app-server-cm42.onrender.com",
    userName,
  });

  // Login screen
  if (!userName) return <Login onSubmit={setUserName} />;

  return (
    <ChatLayout
      isConnected={isConnected}
      userName={userName}
      userCount={userCount}
      messages={messages}
      onSend={sendMessage}
      users={users}
      onTyping={sendTyping}
      usersTyping={typingUsers}
    />
  );
};

export default Chat;
