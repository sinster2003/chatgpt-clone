import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createConversation, deleteConversation, updateConversation } from "../actions/conversation.action";
import { listConversations } from "../utils/list-conversations";
import { queryKeys } from "../utils/query-keys";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useConversations() {
	return useQuery({
		queryKey: queryKeys.conversations.all,
		queryFn: () => listConversations()
	});
}

export function useCreateConversation() {
	const queryClient = useQueryClient();
	const router = useRouter();

	/* use mutation - tanstack that takes in a mutation function and performs 
	data mutations and manages the lifecycle. */

	return useMutation({
		mutationFn: (title?: string) => {
			return createConversation(title);
		},
		onSuccess: (conversation) => {
			// invalidate the cache on successful data mutation of create conversation
			void queryClient.invalidateQueries({
				queryKey: queryKeys.conversations.all
			});

			// redirect into the new conversation page
			router.push(`/c/${conversation.id}`)
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create a conversation. Please try later.");
		}
	});
}

export function useDeleteConversation(activeConversationId: string) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: (conversationId: string) => {
			return deleteConversation(conversationId);
		},
		onSuccess: (conversation) => {
			// invalidate cache of conversations once conversation is deleted
			void queryClient.invalidateQueries({
				queryKey: queryKeys.conversations.all
			});

			// delete messages cache for the deleted conversation
			void queryClient.removeQueries({
				queryKey: queryKeys.messages.byConversation(conversation.id)
			});

			// navigate only if the deleted conversation matches with active conversation
			if(activeConversationId === conversation.id) {
				router.push("/");
			}

			toast.success("Conversation deleted successfully.");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete the conversation. Please try later.");
		}
	});
}

export function useUpdateConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			...data
		}: {
			id: string,
			title?: string,
			isArchived?: boolean,
			isPinned?: boolean
		}) => updateConversation(id, data),
		onSuccess: (conversation) => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.conversations.all
			});

			void queryClient.invalidateQueries({
				queryKey: queryKeys.conversations.detail(conversation.id)
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update the conversation.");
		}
	});
}