import { ApiGetChats } from "@/types/Chat";
import { useApi } from "./api";
import { ApiGetChatMessages, ApiPostNewMessage } from "@/types/Message";
import { ApiGetContactInfo } from "@/types/Contact";

export const useRequests = () => {
    const getChats = async () => {
        const response = await useApi<ApiGetChats>({ endpoint: 'chats' })
        return response;
    }

    const newChat = async (data: object) => {
        const response = await useApi({ endpoint: 'chats/', method: 'POST', data })
        return response;
    }

    const getChatMessages = async (chat_id: number) => {
        const response = await useApi<ApiGetChatMessages>({ endpoint: `chats/${chat_id}/messages` })
        return response;
    }

    const addChatMessage = async (chat_id: number, data: object) => {
        const response = await useApi<ApiPostNewMessage>({ endpoint: `chats/${chat_id}/messages`, method: 'POST', data, headers: { "Content-Type": "multipart/form-data" } })
        return response;
    }

    const getContactInfo = async (user_id: number) => {
        const response = await useApi<ApiGetContactInfo>({ endpoint: `contacts/users/${user_id}` })
        return response
    }

    const blockUser = async (user_id: number) => {
        const response = await useApi({ endpoint: `contacts/users/${user_id}/blockeds`, method: 'POST' })
        return response
    }

    const unblockUser = async (user_id: number) => {
        const response = await useApi({ endpoint: `contacts/users/${user_id}/blockeds`, method: 'DELETE' })
        return response
    }

    const deleteMyChatMessages = async (chat_id: number) => {
        const response = await useApi({ endpoint: `chats/${chat_id}/messages`, method: 'DELETE' })
        return response
    }

    const deleteChatMessage = async (chat_id: number, message_id: number) => {
        const response = await useApi({ endpoint: `chats/${chat_id}/messages/${message_id}`, method: 'DELETE' })
        return response
    }

    return {
        getChats,
        newChat,
        getChatMessages,
        addChatMessage,
        getContactInfo,
        blockUser,
        unblockUser,
        deleteMyChatMessages,
        deleteChatMessage
    };
}