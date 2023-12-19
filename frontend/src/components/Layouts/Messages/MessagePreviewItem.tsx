import { Chat } from '@/types/Chat';
import styles from './Messages.module.scss';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { setAppMode } from '@/utils/redux/slices/appSlice';
import { setChat } from '@/utils/redux/slices/chatSlice';
import { formatDateTimeToDate } from '@/utils/date';
import { useAuth } from '@/utils/auth';

type Props = {
    data: Chat
}

export const MessagePreviewItem = ({ data }: Props) => {
    const { user } = useAuth()

    const dispatch = useDispatch()

    const handleOnClick = () => {
        dispatch(setAppMode('chat'))
        dispatch(setChat(data))
    }

    return (
        <div className={styles.messagePreviewItem} onClick={handleOnClick}>
            <div className={styles.avatar}>
                <img alt={data.title} src={data.avatar} className={styles.avatarImg} />
            </div>

            <div className={styles.messageInfo}>
                <div className={styles.messageInfoData}>
                    <div>
                        <span className={styles.messageInfoDataTitle}>{data.title}</span>
                    </div>

                    <div className={styles.messageInfoDataBody}>
                        {!data.last_message &&
                            <div className={styles.chatBodyEmpty} >
                                Nenhuma mensagem ainda
                            </div>
                        }

                        {data.last_message?.from_user == user?.id &&
                            (data.last_message?.viewed_at ?
                                <Icon icon="mdi:done-all" color='var(--blue-400)' className={styles.messageInfoDataBodyIcon} />
                                :
                                <Icon icon="mdi:done-all" color="var(--gray-700)" className={styles.messageInfoDataBodyIcon} />
                            )
                        }

                        {!data.last_message?.body ?
                            data.last_message?.attachments.audio &&
                            <div className={styles.chatBodyEmpty} >
                                <Icon icon="material-symbols:mic" className={styles.chatBodyEmptyIcon} />
                                Áudio
                            </div>
                            :
                            <span dangerouslySetInnerHTML={{ __html: data.last_message?.body }}></span>
                        }
                    </div>
                </div>

                <div className={styles.messageInfoData} >
                    {data.viewed_at &&
                        <div className={styles.messageInfoDataDate}>
                            <span className={data.unseen_count >= 1 ? styles.messageInfoDataDateActive : ''} >{formatDateTimeToDate(data.viewed_at)}</span>
                        </div>
                    }

                    {data.unseen_count >= 1 &&
                        <div className={styles.messageInfoDataMessagesCount}>
                            <span>{data.unseen_count}</span>
                        </div>
                    }
                </div>
            </div>

        </div>
    );
}