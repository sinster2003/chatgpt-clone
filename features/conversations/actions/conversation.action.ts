"use server";

import { prisma } from "@/lib/db";
import { ConversationRecord } from "../utils/types";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/features/auth/utils/require-user";
import { assertOwnConversation } from "../utils/own-conversation";

/*
    **Conversation data mutation server actions**

    * UserId can be fetched as a server action but since it is a GET
    request following better practices, instead of server action use React / Tanstack
    query to fetch user record and pass userId as a param.

    * UserId is fetched as a server function, not a server action

    * listConversation is created server function
*/

export async function createConversation(title?: string)
  : Promise<ConversationRecord> {
    try {
      const { id: userId } = await requireUser();

      return await prisma.conversation.create({
      data: {
        userId,
        title: title?.trim() || "New Chat"
      }
    });
  }
  catch (error) {
    throw new Error("Failed to create conversation. Something went wrong.");
  }
}

export async function deleteConversation(conversationId: string)
  : Promise<{ id: string }> {
  try {
    const conversation = await assertOwnConversation(conversationId);

    await prisma.conversation.delete({
      where: {
        id: conversation.id
      }
    });

    revalidatePath("/"); // after deletion of conversation, cache may be stale -> refetch on next render

    return {
      id: conversation.id
    };
  }
  catch (error) {
    throw new Error("Failed to delete conversation. Something went wrong.");
  }
}

export async function updateConversation(conversationId: string,
  data: {
    title?: string,
    isArchived?: boolean,
    isPinned?: boolean
  }) : 
  Promise<ConversationRecord> {
  try {
    const conversation = await assertOwnConversation(conversationId);

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversation.id
      },
      data: {
        ...(data.title !== undefined ? { title: data.title.trim() || "New Chat" } : {}),
        ...(data.isPinned !== undefined ? { isPinned: data.isPinned } : {}),
        ...(data.isArchived !== undefined ? { isArchived: data.isArchived } : {}),
      }
    });

    revalidatePath("/");
    revalidatePath(`/c/${conversation.id}`);

    return updatedConversation;
  }
  catch (error) {
    throw new Error("Failed to delete conversation. Something went wrong.");
  }
}
