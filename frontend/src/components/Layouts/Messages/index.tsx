import { useEffect, useState } from 'react';
import styles from './Messages.module.scss';
import { MdOutlineSearch } from 'react-icons/md';
import { Chat } from '@/types/Chat';
import { useRequests } from '@/utils/requests';
import { MessagePreviewItem } from './MessagePreviewItem';
import { socket } from '../Layout';

type Props = {
    setLoading: (value: boolean) => void
}

export const MessagesSideBar = ({ setLoading }: Props) => {
    const [chatsList, setChatsList] = useState<Chat[]>([])
    const [filteredChatsList, setFilteredChatsList] = useState<Chat[]>([])
    const [searchInput, setSearchInput] = useState('')

    const { getChats } = useRequests();

    const handleGetChats = async () => {
        const response = await getChats()

        if (!response.error_detail) {
            setChatsList(response.data.chats)
            setLoading(false)
        }
    }

    const filterChats = () => {
        setFilteredChatsList(chatsList.filter((item) =>
            item.title.toLowerCase().includes(searchInput.toLowerCase())
        ))
    }

    useEffect(() => {
        socket.on("update_chats", () => {
            handleGetChats()
        });

        handleGetChats()
    }, [])

    useEffect(() => {
        filterChats()
    }, [searchInput, chatsList])

    return (
        <div className={styles.container}>
            <div className={styles.search}>
                <button className={styles.searchBtn}>
                    <MdOutlineSearch className={styles.searchBtnIcon} />
                </button>

                <input
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className={styles.searchInput}
                    placeholder='Pesquisar ou começar uma nova conversa'
                />
            </div>

            <div className={styles.messages}>
                {filteredChatsList.map((chat) => (
                    <MessagePreviewItem data={chat} key={chat.id} />
                ))}
            </div>
        </div>
    );
}