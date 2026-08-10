"use server";

import { prisma } from "@/lib/db";
import { ConversationRecord } from "../utils/types";
import { revalidatePath } from "next/cache";

/*
    **Conversation data mutation server actions**

    * UserId can be fetched as a server action but since it is a GET
    request following better practices, instead of server action use React / Tanstack
    query to fetch user record and pass userId as a param.
*/

export async function createConversation(userId: string, title: string)
  : Promise<ConversationRecord> {
  try {
    return await prisma.conversation.create({
      data: {
        userId,
        title: title.trim() || "New Chat"
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
    await prisma.conversation.delete({
      where: {
        id: conversationId
      }
    });

    revalidatePath("/"); // after deletion of conversation, cache may be stale -> refetch on next render

    return {
      id: conversationId
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
    const conversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        ...(data.title !== undefined ? { title: data.title.trim() || "New Chat" } : {}),
        ...(data.isPinned !== undefined ? { isPinned: data.isPinned } : {}),
        ...(data.isArchived !== undefined ? { isArchived: data.isArchived } : {}),
      }
    });

    revalidatePath("/");
    revalidatePath(`/c/${conversationId}`);

    return conversation;
  }
  catch (error) {
    throw new Error("Failed to delete conversation. Something went wrong.");
  }
}
