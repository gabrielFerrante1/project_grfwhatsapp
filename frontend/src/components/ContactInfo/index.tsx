import { Icon } from '@iconify/react/dist/iconify.js';
import styles from './ContactInfo.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setChatDetailStatus, setDeleteChatMessages } from '@/utils/redux/slices/chatSlice';
import { useRequests } from '@/utils/requests';
import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/auth';
import { ContactInfo as TypeContactInfo } from '@/types/Contact';
import { RootState } from '@/utils/redux/store';

export const ContactInfo = () => {
    const chat = useSelector((state: RootState) => state.chat)

    const [requestLoading, setRequestLoading] = useState(true)
    const [contactData, setContactData] = useState<TypeContactInfo | null>(null)

    const { getContactInfo, blockUser, unblockUser, deleteMyChatMessages } = useRequests()
    const { user } = useAuth()

    const dispatch = useDispatch()

    const handleCloseContactInfo = () => {
        dispatch(setChatDetailStatus('closed'))
    }

    const handleGetContactInfo = async () => {
        if (!chat.chat) return;

        const other_user_id = chat.chat.to_user_id != user?.id ? chat.chat.to_user_id : chat.chat.from_user_id

        const response = await getContactInfo(other_user_id)
        setRequestLoading(false)

        if (!response.error_detail) setContactData(response.data.contact)
    }

    const handleBlockUser = async () => {
        if (!contactData) return;

        await blockUser(contactData.id)
        setContactData({ ...contactData, blocked: true })
    }

    const handleUnblockUser = async () => {
        if (!contactData) return;

        setContactData({ ...contactData, blocked: false })
        await unblockUser(contactData.id)
    }

    const handleDeleteMyChatMessages = async () => {
        if (!chat.chat || !user) return;

        await deleteMyChatMessages(chat.chat.id)
    }

    useEffect(() => {
        handleGetContactInfo()
    }, [])

    return (
        <div className={styles.container}>
            <header>
                <Icon icon="mingcute:close-fill" onClick={handleCloseContactInfo} />

                <span>Dados do contato</span>
            </header>

            <div className={styles.contactDataContainer}>
                <div className={styles.contactData} >
                    <div className={styles.contactDataImage}>
                        <img src={contactData?.avatar} alt={contactData?.name} />
                    </div>

                    <div className={styles.contactDataInfo}>
                        <span className={styles.contactDataName}>{contactData?.name}</span>
                        <span className={styles.contactDataEmail}>{contactData?.email}</span>
                    </div>
                </div>

                <div className={styles.contactActions}>
                    {contactData?.blocked ?
                        <div className={styles.contactActionsItem} onClick={handleUnblockUser}>
                            <div className={styles.contactActionsItemIcon}>
                                <Icon icon="oi:ban" color='var(--green-600)' />
                            </div>
                            <div className={styles.contactActionsLabel} style={{ color: 'var(--green-600)' }}>
                                Desbloquear {contactData?.name}
                            </div>
                        </div>
                        :
                        <div className={styles.contactActionsItem} onClick={handleBlockUser}>
                            <div className={styles.contactActionsItemIcon}>
                                <Icon icon="oi:ban" color='var(--red-600)' />
                            </div>
                            <div className={styles.contactActionsLabel} style={{ color: 'var(--red-600)' }} >
                                Bloquear {contactData?.name}
                            </div>
                        </div>
                    }

                    <div className={styles.contactActionsItem} onClick={handleDeleteMyChatMessages}>
                        <div className={styles.contactActionsItemIcon}>
                            <Icon icon="mingcute:delete-fill" color='var(--red-600)' />
                        </div>
                        <div className={styles.contactActionsLabel} style={{ color: 'var(--red-600)' }}>
                            Apagar minhas mensagens
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}