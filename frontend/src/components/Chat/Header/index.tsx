import { useDispatch, useSelector } from 'react-redux';
import styles from './ChatHeader.module.scss';
import { RootState } from '@/utils/redux/store';
import { Icon } from '@iconify/react/dist/iconify.js';
import { setChatDetailStatus } from '@/utils/redux/slices/chatSlice';

export const ChatHeader = () => {
    const chat = useSelector((state: RootState) => state.chat)

    const dispatch = useDispatch()

    const handleOpenSearchMessages = () => dispatch(setChatDetailStatus('search_messages'))

    const handleOpenContactInfo = () => dispatch(setChatDetailStatus('contact_info'))

    return (
        <div className={styles.container}>
            <div className={styles.headerChatInfo} onClick={handleOpenContactInfo}>
                <div className={styles.headerChatInfoAvatar}>
                    <img
                        src={chat.chat?.avatar}
                        alt={chat.chat?.title}
                    />
                </div>

                <div className={styles.headerChatInfoTitle}>
                    <span>{chat.chat?.title}</span>
                    <small>clique para mostrar os dados do contato</small>
                </div>
            </div>

            <div className={styles.headerChatActions}>
                <div className={styles.actionIcon} onClick={handleOpenSearchMessages}>
                    <Icon icon="heroicons-solid:search" className={styles.actionIconSvg} />
                </div>

                <div className={styles.actionIcon} onClick={handleOpenContactInfo}>
                    <Icon icon="humbleicons:dots-vertical" className={styles.actionIconSvg} />
                </div>
            </div>
        </div>
    )
}