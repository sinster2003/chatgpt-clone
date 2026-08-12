export const queryKeys = {
    conversations: {
        all: ["conversations"] as const, // cache collection of conversations
        detail: (id: string) => ["conversations", id] as const // cache particular conversation
    },
    messages: {
        byConversation: (conversationId: string) => {
            return ["messages", conversationId] as const // cache all messages belonging to a conversation
        }
    }
}