import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { listMessages } from "../utils/list-messages";
import { queryKeys } from "@/features/conversations/utils/query-keys";
import { createMessage, deleteMessage, updateMessage } from "../actions/message.actions";
import { toast } from "sonner";

export function useMessages(conversationId: string | undefined) {
  useQuery({
    queryKey: queryKeys.messages.byConversation(conversationId ?? "none"),
    queryFn: () => listMessages(conversationId!),
    enabled: Boolean(conversationId)
  });
}

export function useCreateMessage(conversationId: string) {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: (content: string) => createMessage(conversationId, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages.byConversation(conversationId)
      });

      // invalidate conversation cache as creation of message can update conversation title
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create message.");
    }
  });
}

export function useUpdateMessage(conversationId: string) {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string, content: string }) => updateMessage(id, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages.byConversation(conversationId)
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update message.");
    }
  });
}

export function useDeleteMessage(conversationId: string) {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages.byConversation(conversationId)
      });

      toast.success("Message deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete message.");
    }
  });
}