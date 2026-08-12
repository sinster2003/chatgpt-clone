"use server";

import { requireUser } from "@/features/auth/utils/require-user";
import { assertOwnConversation } from "@/features/conversations/utils/own-conversation";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createMessage(conversationId: string, content: string) {
  try {
    const conversation = await assertOwnConversation(conversationId);

    const trimmedContent = content?.trim();

    if (!trimmedContent) {
      throw new Error("Message cannot be empty.");
    }

    const createdMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        status: "COMPLETE",
        content: trimmedContent,
        updatedAt: new Date()
      }
    });

    const isRenameNeeded = conversation.title === "New Chat" || conversation.title === "";

    await prisma.conversation.update({
      where: {
        id: conversation.id
      },
      data: {
        lastMessageAt: new Date(),
        ...(isRenameNeeded ? {
          title: trimmedContent.length > 40 ? `${trimmedContent.slice(0, 40)}...` : trimmedContent
        } : {})
      }
    });

    revalidatePath("/"); // need to revalidate because conversation title is updated
    revalidatePath(`/c/${conversation.id}`);

    return createdMessage;
  }
  catch (error) {
    throw new Error("Failed to create message.");
  }
}

export async function updateMessage(messageId: string, content: string) {
  try {
    const user = await requireUser();

    const isExistingMessage = await prisma.message.findUnique({
      where: {
        id: messageId
      },
      include: {
        conversation: true
      }
    });

    if (!isExistingMessage || isExistingMessage.conversation.userId !== user.id) {
      throw new Error("Message not found.");
    }

    const trimmedContent = content?.trim();

    if (!trimmedContent) {
      throw new Error("Message cannot be empty.");
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: isExistingMessage.id
      },
      data: {
        content: trimmedContent,
        updatedAt: new Date()
      }
    });

    revalidatePath(`/c/${updatedMessage.conversationId}`);

    return updatedMessage;
  }
  catch (error) {
    throw new Error("Failed to update message");
  }
}

export async function deleteMessage(messageId: string) {
  try {
    const user = await requireUser();

    const isExistingMessage = await prisma.message.findUnique({
      where: {
        id: messageId
      },
      include: {
        conversation: true
      }
    });

    /*
        If message does not exist or conversation does not belong to authenticated user
    */
    if (!isExistingMessage || isExistingMessage.conversation.userId !== user.id) {
      throw new Error("Message not found");
    }

    await prisma.message.delete({
      where: {
        id: isExistingMessage.id,
      }
    });

    revalidatePath(`/c/${isExistingMessage.conversationId}`);

    return {
      id: messageId,
      conversationId: isExistingMessage.conversationId
    }
  }
  catch (error) {
    throw new Error("Failed to delete message");
  }
}