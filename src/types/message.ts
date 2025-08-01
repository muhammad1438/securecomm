export interface Message {
  id: string;
  type: MessageType;
  content: string | Uint8Array;
  sender: string;
  recipient: string;
  timestamp: number;
  encrypted: boolean;
  signature?: string;
  route?: string[];
  status: MessageStatus;
  channel?: string; // Added channel property
}

export type MessageType = "text" | "voice" | "file" | "system" | "emergency";
export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";
