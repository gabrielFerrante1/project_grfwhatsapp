import { useSelector } from 'react-redux';
import styles from './ChatFooter.module.scss';
import { RootState } from '@/utils/redux/store';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useRef, useState } from 'react';
import { useRequests } from '@/utils/requests';
import { Toast } from 'primereact/toast';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

export const ChatFooter = () => {
    const chat = useSelector((state: RootState) => state.chat)

    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
    const [messageBodyInput, setMessageBodyInput] = useState('')
    const [recordingStatus, setRecordingStatus] = useState(false)
    const [audioChunks, setAudioChunks] = useState<Blob[]>([])

    const toast = useRef<Toast>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);

    const { addChatMessage } = useRequests()

    const handleNewMessage = async () => {
        if (!chat.chat) return;

        // Clear input body
        setMessageBodyInput('')

        if (!messageBodyInput) {
            toast.current?.show({ severity: 'error', detail: 'Digite alguma mensagem' });
        }

        const response = await addChatMessage(chat.chat.id, { body: messageBodyInput })

        if (response.error_detail) {
            toast.current?.show({ severity: 'error', detail: response.error_detail })
        }
    }

    const handleToggleEmojiPicker = () => setEmojiPickerOpen(!emojiPickerOpen)

    const handleAddEmojiOnBodyInput = (emojiData: EmojiClickData, event: MouseEvent) => {
        setMessageBodyInput(body => `${body}${emojiData.emoji}`)
    }

    // Microphone
    const mimeType = "audio/webm";

    const handleStartRecording = async () => {
        let stream: MediaStream | null = null

        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                })

                stream = streamData
            } catch {
                toast.current?.show({ severity: 'error', detail: 'Permita nas configurações do seu navegador o recurso de áudio' });
                return;
            }
        } else {
            toast.current?.show({ severity: 'error', detail: 'Seu navegador não suporta gravar áudios' });
            return;
        }

        if (!stream) return;

        setRecordingStatus(true);

        const media = new MediaRecorder(stream, { mimeType: mimeType });

        mediaRecorder.current = media;
        mediaRecorder.current.start();

        const localAudioChunks: Blob[] = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined" || event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };

        setAudioChunks(localAudioChunks);
    };

    const handleStopRecording = () => {
        if (!mediaRecorder.current) return;

        setRecordingStatus(false);

        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = async () => {
            if (!chat.chat) return;

            const audioBlob = new Blob(audioChunks, { type: mimeType });

            await addChatMessage(chat.chat.id, { audio_file: audioBlob })

            setAudioChunks([]);
        };
    };


    useEffect(() => {
        setMessageBodyInput('')
        setEmojiPickerOpen(false)
    }, [chat.chat])



    return (
        <div className={styles.container}>
            <Toast ref={toast} />

            <div className={`${styles.emojiPickerContainer} ${emojiPickerOpen ? styles.emojiPickerOpen : styles.emojiPickerClosed}`} >
                <EmojiPicker
                    onEmojiClick={handleAddEmojiOnBodyInput}
                    searchDisabled
                />
            </div>

            <div className={styles.footerIcon}>
                <Icon icon="mdi:emoji-outline" onClick={handleToggleEmojiPicker} />
            </div>

            <div className={styles.footerIcon}>
                <Icon icon="mingcute:attachment-line" />
            </div>

            <div className={styles.footerInput}>
                <input
                    value={messageBodyInput}
                    onChange={e => setMessageBodyInput(e.target.value)}
                    placeholder='Digite uma mensagem'
                />
            </div>

            <div className={styles.footerIcon}>
                {messageBodyInput ?
                    <Icon icon="ic:baseline-send" onClick={handleNewMessage} />
                    :
                    <>
                        {recordingStatus ?
                            <Icon
                                icon="fluent:mic-pulse-24-filled"
                                onClick={handleStopRecording}
                                color='var(--teal-600)'
                            />
                            :
                            <Icon
                                icon="fluent:mic-24-filled"
                                onClick={handleStartRecording}
                            />
                        }
                    </>

                }
            </div>
        </div>
    )
}