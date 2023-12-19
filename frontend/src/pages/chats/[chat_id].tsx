import { useRouter } from 'next/router';
import styles from '../../styles/Chat.module.scss';
import Chat from '@/components/Chat/chat';

const ChatPage = () => {
    const router = useRouter()

    return (
        <div className={styles.container}>
            <Chat />
        </div>
    )
}

export default ChatPage;