import Chat from "@/components/Chat/chat";
import DefaultPage from "@/components/DefaultPage";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";

export default () => {
    const app = useSelector((state: RootState) => state.app);
    const chat = useSelector((state: RootState) => state.chat);

    return (
        <div>
            {app.mode == 'default' && <DefaultPage />}
            {app.mode == 'chat' && chat.chat && <Chat />  }
        </div>
    );
}