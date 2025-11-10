export type UseWebSocketOptions = {
  url: string;
  userName: string | null;
  onOpen?: () => void;
  onClose?: () => void;
};

export type IncomingEvent =
  | { type: "message"; id?: string; from: string; text: string; ts?: number }
  | {
      type: "dm";
      id?: string;
      from: string;
      to: string;
      text: string;
      ts?: number;
    }
  | { type: "system"; id?: string; text: string; ts?: number }
  | { type: "users"; userList: string[] }
  | { type: "userCount"; count: number }
  | { type: "typing"; typing_users: string[] }
  | { type: "history"; storedMessages: string[] }
  // Some backends emit shape-only events; keep this flexible
  | Record<string, any>;
