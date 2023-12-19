import { MessageContext } from "@/types/Message"
import styles from './ChatBody.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
import { formatDateTimeToTime } from '@/utils/date';
import { useAuth } from "@/utils/auth";
import { useRequests } from "@/utils/requests";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { AudioControls } from "./AudioControls";

type Props = {
    data: MessageContext
}

export const MessageItem = ({ data }: Props) => {
    const chat = useSelector((state: RootState) => state.chat)

    const { user } = useAuth()

    const { deleteChatMessage } = useRequests()

    const handleDeleteChatMessage = async (message_id: number) => {
        if (!chat.chat) return;

        await deleteChatMessage(chat.chat.id, message_id)
    }

    return (
        <div className={styles.messageContext}>
            <div className={styles.messageContextDate}>
                <span>{data.date}</span>
            </div>

            {data.messages.map((message) => (
                <div
                    key={message.id}
                    className={`${styles.messageItemContainer} ${message.from_user == user?.id ? styles.myMessage : ''} ${message.to_user == user?.id ? styles.messageFromOther : ''}`}
                    id={`message-${message.id}`}
                >
                    <div className={styles.messageItem}>
                        {message.deleted && <div className={styles.messageItemDeleted}> <Icon icon="mdi:ban" /> Mensagem apagada</div>}

                        {!message.deleted && message.attachments.audio &&
                            <>
                                <div className={styles.audioControls}>
                                    <AudioControls
                                        message={message}
                                    />
                                </div>
                            </>
                        }

                        {!message.deleted && message.body && <span dangerouslySetInnerHTML={{ __html: message.body }}></span>}

                        <div className={styles.messageItemSendDate}>
                            {formatDateTimeToTime(message.created_at)}
                        </div>

                        {message.from_user == user?.id &&
                            <>
                                <div className={styles.messageItemActions}>
                                    <Icon
                                        icon="material-symbols:delete"
                                        className={styles.messageItemActionsDeleteIcon}
                                        onClick={() => handleDeleteChatMessage(message.id)}
                                    />
                                </div>

                                <div className={styles.messageItemStatus}>
                                    <Icon icon="mdi:done-all" color={message.viewed_at ? 'var(--blue-400)' : 'var(--gray-700)'} className={styles.messageItemStatusIcon} />
                                </div>
                            </>
                        }
                    </div>
                </div>
            ))}

        </div >

    )
}