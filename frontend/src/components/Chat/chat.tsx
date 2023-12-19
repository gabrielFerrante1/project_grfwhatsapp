import { setChatDetailStatus, setChatMessages, setChatStatus } from '@/utils/redux/slices/chatSlice';
import { RootState } from '@/utils/redux/store';
import { useRequests } from '@/utils/requests';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatBody } from './Body';
import styles from './Chat.module.scss';
import { ChatFooter } from './Footer';
import { ChatHeader } from './Header';

const Chat = () => {
    const chat = useSelector((state: RootState) => state.chat)

    const { getChatMessages } = useRequests()
    const dispatch = useDispatch()

    const handleGetChatMessages = async () => {
        if (!chat.chat) return;

        dispatch(setChatStatus('loading'))
        const response = await getChatMessages(chat.chat.id)
        if (!response.error_detail) {
            dispatch(setChatMessages(response.data.data))
        }
        dispatch(setChatStatus('loaded'))
    }

    useEffect(() => {
        handleGetChatMessages()
    }, [chat.chat?.id])

    useEffect(() => {
        // Change automatic close chat detail on change chat info
        if (chat.chat_detail != 'closed') {
            dispatch(setChatDetailStatus('closed'))
        }
    }, [chat.chat])

    return (
        <div className={styles.container}>
            <div className={styles.containerHeader}>
                <ChatHeader />
            </div>
            <div className={styles.containerBody}>
                <ChatBody />
            </div>
            <div className={styles.containerFooter}>
                <ChatFooter />
            </div>
        </div>
    )
};

export default Chat;