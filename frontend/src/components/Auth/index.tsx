import { useEffect, useRef, useState } from 'react'
import styles from './Auth.module.scss'
import { Button } from 'primereact/button'
import { useAuth } from '@/utils/auth'
import { Toast } from 'primereact/toast'
 

export const Auth = () => {
    const [authType, setAuthType] = useState<'signin' | 'signup'>('signin');
    const [nameInput, setNameInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')

    const toast = useRef<Toast>(null);

    const { signIn, signUp } = useAuth()

    const handleSubmit = async () => {
        const [name, email, password] = [nameInput, emailInput, passwordInput]

        if (!email || !password || (authType == 'signup' && !name)) {
            toast.current?.show({ severity: 'error', detail: 'Preencha todos os campos', life: 3000 });
            return;
        }

        let error_detail = ''
        if (authType == 'signin') {
            error_detail = await signIn({ email, password })
        } else {
            error_detail = await signUp({ name, email, password })
        }

        if (error_detail) {
            toast.current?.show({ severity: 'error', detail: error_detail, life: 4000 });
            return;
        }
    }
    return (
        <div className={styles.container}>
            <Toast ref={toast} />

            <div className={styles.containerInputs}>
                {authType == 'signup' &&
                    <div className={styles.formInput}>
                        <input
                            className={styles.input}
                            placeholder='Digite seu nome'
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                        />
                    </div>
                }
                <div className={styles.formInput}>
                    <input
                        className={styles.input}
                        placeholder='Digite seu email'
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                    />
                </div>
                <div className={styles.formInput}>
                    <input
                        className={styles.input}
                        placeholder='Digite sua senha'
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                    />
                </div>
            </div>

            {authType == 'signin' ?
                <p className={styles.description}>
                    Ainda não tem conta? <span className={styles.descriptionAction} onClick={() => setAuthType('signup')}>Criar conta</span>
                </p>
                :
                <p className={styles.description}>
                    Já tem conta? <span className={styles.descriptionAction} onClick={() => setAuthType('signin')}>Fazer login</span>
                </p>
            }

            <Button size="small" className={styles.btn} onClick={handleSubmit}>
                {authType == 'signin' ?
                    'Fazer login'
                    : 'Criar conta'
                }
            </Button>
        </div>
    )
}