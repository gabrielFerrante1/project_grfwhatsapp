import DefaultPage from "@/components/DefaultPage";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { jwtDecode } from 'jwt-decode'

export default () => {
    const app = useSelector((state: RootState) => state.app);

    return (
        <div>
 sdsdsdsd
        </div>
    );
}