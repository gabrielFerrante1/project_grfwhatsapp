import { socket } from '@/components/Layouts/Layout';
import { Message } from '@/types/Message';
import { useAuth } from '@/utils/auth';
import { setAllChatMessagesAsRead, setChatAddMessage, setChatScrollToMessage, setDeleteChatMessages } from '@/utils/redux/slices/chatSlice';
import { RootState } from '@/utils/redux/store';
import { ProgressBar } from 'primereact/progressbar';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ChatBody.module.scss';
import { MessageItem } from './MessageItem';

export const ChatBody = () => {
    const messagesRef = useRef<HTMLDivElement>(null)

    const chat = useSelector((state: RootState) => state.chat)

    const dispatch = useDispatch()

    const { user } = useAuth()

    // Scroll automatic to bottom on change chat_status
    useEffect(() => {
        if (chat.chat_messages.length >= 1) {
            setTimeout(() => {
                messagesRef.current?.scrollIntoView(false)
            }, 0)
        }
    }, [chat.chat_status])


    useEffect(() => {
        socket.on(`update_messages_in_chat_${chat.chat?.id}`, async (data: { message: Message }) => {
            dispatch(setChatAddMessage(data.message))

            if (data.message.to_user == user?.id) {
                socket.emit("userViewedMessages", { chat_id: chat.chat?.id, from_user_id: data.message.from_user, to_user_id: data.message.to_user })
            }

            setTimeout(() => {
                messagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }, 0)
        })

        socket.on(`update_as_view_messages_in_chat_${chat.chat?.id}`, (data: { from_user_id: number, date: string }) => {
            dispatch(setAllChatMessagesAsRead(data.date))
        })

        socket.on(`delete_messages_in_chat_${chat.chat?.id}`, (data: { user_id?: number } | null) => {
            dispatch(setDeleteChatMessages(data))
        })

        return () => {
            socket.off(`update_messages_in_chat_${chat.chat?.id}`)
            socket.off(`delete_messages_in_chat_${chat.chat?.id}`)
        }
    }, [chat.chat])


    useEffect(() => {
        if (chat.chat_scroll_to_message) {
            const element = document.querySelector(`#message-${chat.chat_scroll_to_message}`)

            if (!element) return;

            element.scrollIntoView({ behavior: 'smooth', block: "center" })

            element.classList.add(styles.focusedMessage)

            setTimeout(() => {
                element.classList.remove(styles.focusedMessage)
            }, 1800);

            dispatch(setChatScrollToMessage(null))
        }
    }, [chat.chat_scroll_to_message])

    return (
        <div className={styles.container}>
            <div className={styles.bodyContainerMessages} ref={messagesRef} >
                {chat.chat_status == 'loaded' &&
                    chat.chat_messages.map((messageContext, key) => (
                        <MessageItem
                            data={messageContext}
                            key={key}
                        />
                    ))
                }
            </div>
        </div>
    )
}