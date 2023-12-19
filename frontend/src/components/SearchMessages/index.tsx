import { Icon } from '@iconify/react/dist/iconify.js'
import styles from './SearchMessages.module.scss'
import { setChatDetailStatus, setChatScrollToMessage } from '@/utils/redux/slices/chatSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/utils/redux/store'
import { MdOutlineSearch } from 'react-icons/md';
import { useEffect, useState } from 'react'
import { Message } from '@/types/Message'


export const SearchMessages = () => {
    const chat = useSelector((state: RootState) => state.chat)

    const [searchInput, setSearchInput] = useState('')
    const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

    const dispatch = useDispatch()

    const handleCloseSearchMessages = () => {
        dispatch(setChatDetailStatus('closed'))
    }

    const handleChatScrollToMessage = (id: number) => {
        dispatch(setChatScrollToMessage(id))
    }

    const filterMessages = () => {
        let messagesData: Message[] = []

        chat.chat_messages.map((item) => {
            item.messages.map((message) => {
                const messageBody = message.body?.toLowerCase()
                if (messageBody?.includes(searchInput.toLowerCase())) {
                    messagesData.push({ ...message, body: messageBody.replace(searchInput.toLowerCase(), `<span class=${styles.lettersMatch}>${searchInput}</span>`) })
                }
            })
        })

        setFilteredMessages(messagesData)
    }

    useEffect(() => {
        filterMessages()
    }, [searchInput])

    return (
        <div className={styles.container}>
            <header>
                <Icon icon="mingcute:close-fill" onClick={handleCloseSearchMessages} />

                <span>Pesquisar mensagens</span>
            </header>

            <div className={styles.search}>
                <button className={styles.searchBtn}>
                    <MdOutlineSearch className={styles.searchBtnIcon} />
                </button>

                <input
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className={styles.searchInput}
                    placeholder='Pesquisar ...'
                />
            </div>

            {searchInput ?
                <div className={styles.messages}>
                    {filteredMessages.map((message) => (
                        message.body &&
                        <div
                            key={message.id}
                            className={styles.messageItem}
                            onClick={() => handleChatScrollToMessage(message.id)}
                        >
                            <span className={styles.messageItemDate}>{message.created_at}</span>
                            <span className={styles.messageItemBody} dangerouslySetInnerHTML={{ __html: message.body }}></span>
                        </div>
                    ))}
                </div>
                :
                <div className={styles.emptySearch}>
                    <span>Pesquisar mensagens com {chat.chat?.title}</span>
                </div>
            }
        </div>
    )
}