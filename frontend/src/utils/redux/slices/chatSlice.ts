import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, MessageContext } from "@/types/Message";
import { Chat, ChatDetailStatus, ChatStatus } from "@/types/Chat";

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chat: null as Chat | null,
        chat_messages: [] as MessageContext[],
        chat_status: 'not_loading' as ChatStatus,
        chat_detail: 'closed' as ChatDetailStatus,
        chat_scroll_to_message: null as number | null
    },
    reducers: {
        setChat: (state, action: PayloadAction<Chat | null>) => {
            state.chat = action.payload
        },
        setChatMessages: (state, action: PayloadAction<MessageContext[] | []>) => {
            state.chat_messages = action.payload
        },
        setChatStatus: (state, action: PayloadAction<ChatStatus>) => {
            state.chat_status = action.payload
        },
        setChatDetailStatus: (state, action: PayloadAction<ChatDetailStatus>) => {
            state.chat_detail = action.payload
        },
        setChatScrollToMessage: (state, action: PayloadAction<number | null>) => {
            state.chat_scroll_to_message = action.payload
        },
        setChatAddMessage: (state, action: PayloadAction<Message>) => {
            if (state.chat_messages.some(item => item.date == action.payload.created_at.slice(0, -6))) {
                state.chat_messages = state.chat_messages.map(item => {
                    if (item.date == action.payload.created_at.slice(0, -6)) {
                        return { ...item, messages: [...item.messages, action.payload] }
                    }
                    return item
                })
            } else {
                state.chat_messages = state.chat_messages.concat([{ date: action.payload.created_at.slice(0, -6), messages: [action.payload] }])
            }
        },
        setAllChatMessagesAsRead: (state, action: PayloadAction<string>) => {
            state.chat_messages = state.chat_messages.map((item) => {
                item.messages.map((message) => message.viewed_at = action.payload)
                return item
            })
        },
        setDeleteChatMessages: (state, action: PayloadAction<{ user_id?: number, message_id?: number } | null>) => {
            const chatMessagesNew = state.chat_messages.map(
                (messageContext) => {
                    messageContext.messages.map((message) => {
                        if (action.payload?.user_id == message.from_user) message.deleted = true
                        if (action.payload?.message_id == message.id) message.deleted = true
                    });
                    return messageContext
                }
            )

            state.chat_messages = chatMessagesNew
        }
    }
})

export const {
    setChat,
    setChatMessages,
    setChatStatus,
    setChatDetailStatus,
    setChatScrollToMessage,
    setChatAddMessage,
    setAllChatMessagesAsRead,
    setDeleteChatMessages
} = chatSlice.actions

export default chatSlice.reducer;