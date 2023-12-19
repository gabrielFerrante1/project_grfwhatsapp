export type Message = {
    id: number;
    body: string | null;
    deleted: boolean;
    from_user: number;
    to_user: number;
    attachments: MessageAttachments;
    viewed_at: string | null;
    created_at: string;
}

export type MessageAttachments = {
    audio: { src: string } | null
}

export type MessageContext = {
    date: string;
    messages: Message[]
}

export type ApiGetChatMessages = {
    data: MessageContext[]
}

export type ApiPostNewMessage = {
    message: Message
}