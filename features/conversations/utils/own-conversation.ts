import { requireUser } from "@/features/auth/utils/require-user";
import { prisma } from "@/lib/db"

export async function assertOwnConversation(conversationId: string) {
  try {
    const { id } = await requireUser();

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: id,
      }
    });

    if(!conversation) {
      throw new Error("Conversation not found.");
    }

    return conversation;
  }
  catch (error) {
    throw new Error("Failed to retrieve conversation.");
  }
}