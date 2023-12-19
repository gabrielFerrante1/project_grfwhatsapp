import { ReactNode, useEffect, useState } from "react";
import styles from './Layout.module.scss';
import { HeaderSideBar } from "./Header";
import { MessagesSideBar } from "./Messages";
import { Nunito } from 'next/font/google'
import LoadingApp from "./LoadingApp";
import { useAuth } from "@/utils/auth";
import { Auth } from "../Auth";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import io from "socket.io-client";
import { SearchMessages } from "../SearchMessages";
import { ContactInfo } from "../ContactInfo";

type Props = {
    children: ReactNode;
}

export const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL as string)

const nunito = Nunito({ subsets: ['latin'] })

export const Layout = ({ children }: Props) => {
    const [loading, setLoading] = useState(true)

    const chat = useSelector((state: RootState) => state.chat)
    const user = useSelector((state: RootState) => state.auth)

    const { initAuth } = useAuth();

    useEffect(() => {
        // Initialization Authentication
        initAuth()
    }, [])

    useEffect(() => {
        if (user.user_status == 'not_authenticated') {
            setLoading(false)
        }

        if (user.user_status == 'authenticated') {
            // Join room with user logged id
            socket.emit("joinUserRoom", { id: user.user?.id })
        }
    }, [user])

    if (user.user_status == 'not_authenticated') {
        return (
            <div className={`${styles.app} ${nunito.className}`}>
                <LoadingApp loading={loading} />

                <main className={styles.appMain}>
                    <Auth />
                </main>
            </div>
        )
    }

    return (
        <div className={`${styles.app} ${nunito.className}`}>
            <LoadingApp loading={loading} />

            {user.user_status != 'loading' &&
                <>
                    <div className={styles.appSideBar}>
                        <div className={styles.appSideBarHeader}>
                            <HeaderSideBar />
                        </div>
                        <div className={styles.appSideBarBody}>
                            <MessagesSideBar setLoading={setLoading} />
                        </div>
                    </div>

                    <main className={styles.appMain}>
                        {children}
                    </main>

                    <div className={styles.appSideBarRight} style={{ width: chat.chat_detail != 'closed' ? 450 : 0 }}>
                        {chat.chat_detail == 'search_messages' && <SearchMessages />}
                        {chat.chat_detail == 'contact_info' && <ContactInfo />}
                    </div>
                </>
            }
        </div>
    );
}

export default Layout;