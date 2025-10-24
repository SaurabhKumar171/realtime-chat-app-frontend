export type chatType = "message" | "dm" | "system" | "identity";

export type messageStatus = "PENDING" | "SENT" | "RECEIVED";

export type ChatMessage = {
  id: string;
  type?: chatType;
  from?: string | null;
  to?: string;
  text?: string;
  user_name?: string;
  ts: string; // epoch ms
  // status:  messageStatus;
};
