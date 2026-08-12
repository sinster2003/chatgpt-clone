import { assertOwnConversation } from "@/features/conversations/utils/own-conversation";
import { prisma } from "@/lib/db";
import { MessageRecord } from "./types";

export async function listMessages(conversationId: string): Promise<MessageRecord[]> {
  try {
    const conversation = await assertOwnConversation(conversationId);

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id
      },
      orderBy: {
        createdAt: "asc"
      },
      select: {
        id: true,
        conversationId: true,
        role: true,
        status: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return messages;
  }
  catch (error) {
    throw new Error("Failed to retrieve messages.");
  }
}