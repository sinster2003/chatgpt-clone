import { MessageRole, MessageStatus } from "@/lib/generated/prisma/enums";

export interface MessageRecord {
  id: string;
  conversationId: string;
  role: MessageRole;
  status: MessageStatus;
  content: string;
  parts?: string;
  metadata?: string;
  createdAt: Date;
  updatedAt: Date;
}