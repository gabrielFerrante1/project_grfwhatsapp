import styles from './Header.module.scss';
import { Icon } from '@iconify/react';
import { RiMessage2Fill } from 'react-icons/ri';
import { MdGroupAdd } from 'react-icons/md'
import { useAuth } from '@/utils/auth';
import { Dialog } from 'primereact/dialog';
import { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { useRequests } from '@/utils/requests';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

export const HeaderSideBar = () => {
    const toast = useRef<Toast>(null);

    const [newChatDialogOpen, setNewChatDialogOpen] = useState(false)
    const [emailInput, setEmailInput] = useState('')

    const { user } = useAuth()

    const { newChat } = useRequests()

    const handleToggleNewChatDialog = () => setNewChatDialogOpen(!newChatDialogOpen)

    const handleNewChat = async () => {
        if (!emailInput) {
            toast.current?.show({ severity: 'error', detail: 'Preencha todos os campos' });
            return;
        }

        const response = await newChat({ email: emailInput })
        
        if (response.error_detail) {
            toast.current?.show({ severity: 'error', detail: response.error_detail });
        } else {
            setEmailInput('')
            setNewChatDialogOpen(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.avatar}>
                <img src={user?.avatar} className={styles.avatarImg} />
            </div>

            <Toast ref={toast} />

            <Dialog header="Iniciar uma nova conversa" visible={newChatDialogOpen} style={{ width: '25vw' }} onHide={handleToggleNewChatDialog}>
                <p >
                    <InputText
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        placeholder='Digite o email do usuário'
                        style={{ width: '22vw' }}
                    />

                    <Button style={{marginTop: 20}} size='small' onClick={handleNewChat}>Iniciar</Button>
                </p>
            </Dialog>

            <div className={styles.options}>
                <MdGroupAdd fontSize={25} className={styles.optionsIcon} />
                <RiMessage2Fill fontSize={24} className={styles.optionsIcon} onClick={handleToggleNewChatDialog} />
                <Icon icon="bi:three-dots-vertical" fontSize={22} className={styles.optionsIcon} />
            </div>
        </div>
    );
}