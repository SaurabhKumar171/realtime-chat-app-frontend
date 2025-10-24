import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./ChatHeader";
import { UserList } from "./UserList";
import { Messages } from "./Messages";
import ChatInput from "./ChatInput";
import { type ChatMessage } from "@/types/chat/chatTypes.types";

type ChatLayoutTypes = {
  isConnected: boolean;
  userName: string;
  userCount: number;
  messages: ChatMessage[];
  onSend: (
    input: string,
    type: string,
    sendTo?: string | undefined
  ) => boolean | void;
  input?: string;
  type?: string;
  sendTo?: string;
  users: string[];
  onTyping: (isTyping: boolean) => boolean;
  usersTyping: string[];
};

const ChatLayout = ({
  isConnected,
  userName,
  userCount,
  messages,
  onSend,
  users,
  onTyping,
  usersTyping,
}: ChatLayoutTypes) => {
  const [showUsers, setShowUsers] = useState(true);

  return (
    <div
      className={cn(
        "min-h-screen text-white",
        "bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.20),transparent_60%),radial-gradient(800px_400px_at_80%_10%,rgba(34,211,238,0.18),transparent_60%),linear-gradient(to_bottom_right,#0B1220,#0B0F1A)]"
      )}
    >
      <div className="mx-auto h-svh md:h-screen flex flex-col">
        <ChatHeader
          isConnected={isConnected}
          count={userCount}
          username={userName}
          onToggleUsers={() => setShowUsers((prev) => !prev)}
          className={cn(
            "bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.20),transparent_60%),radial-gradient(800px_400px_at_80%_10%,rgba(34,211,238,0.18),transparent_60%),linear-gradient(to_bottom_right,#0B1220,#0B0F1A)]"
          )}
        />
        <div className="flex-1 flex min-h-0">
          <UserList users={users} me={userName} showUsers={showUsers} />
          <main className="flex-1 flex flex-col min-w-0">
            <Messages
              messages={messages}
              me={userName}
              usersTyping={usersTyping}
            />
            <ChatInput onSend={onSend} onTyping={onTyping} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
