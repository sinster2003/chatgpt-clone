export interface ConversationRecord {
  id: string;
  userId: string;
  title: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
}