import { requireUser } from "@/features/auth/utils/require-user";
import { prisma } from "@/lib/db";

/*
  List conversations of a particular user -> server function (controller)
*/

export async function listConversations() {
  try {
    const { id: userId } = await requireUser();

    const conversations = await prisma.conversation.findMany({
      where: {
        userId,
        isArchived: false
      },
      orderBy: [
        { isPinned: "desc" },
        { lastMessageAt: "desc" }
      ],
      select: {
        id: true,
        userId: true,
        title: true,
        isPinned: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
        lastMessageAt: true,
      }
    });

    return conversations;
  }
  catch (error) {
    throw new Error("Failed to retrieve conversations.");
  }
}