import { Message } from "./Message";

export type Chat = {
    id: number;
    type: "group" | "message";
    from_user_id: number;
    to_user_id: number;
    avatar: string;
    title: string; 
    unseen_count: number;
    viewed_at: string | null;
    last_message: Message | null;
}

export type ChatStatus = 'not_loading' | 'loading' | 'loaded'

export type ChatDetailStatus = 'closed' | 'contact_info' | 'search_messages'

export type ApiGetChats = {
    chats: Chat[]
}
