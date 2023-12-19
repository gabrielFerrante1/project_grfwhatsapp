import { jwtDecode } from "jwt-decode"
import { useDispatch, useSelector } from "react-redux"
import { setUser, setUserStatus } from "./redux/slices/authSlice"
import { ApiAuthUser, UserJwtPayload } from "@/types/User"
import { RootState } from "./redux/store"
import { useApi } from "./api"

export const getAccessToken = () => localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_LOCAL_STORAGE as string)

export const useAuth = () => {
    const {user} = useSelector((state: RootState) => state.auth)

    const dispatch = useDispatch()

    const initAuth = () => {
        const access_token = getAccessToken()

        if (!access_token) {
            dispatch(setUserStatus('not_authenticated'))
            return;
        }

        try {
            const { user_id, user_avatar, user_name, user_email } = jwtDecode<UserJwtPayload>(access_token)

            dispatch(setUser({
                id: user_id,
                avatar: user_avatar,
                name: user_name,
                email: user_email,
                access_token: access_token
            }))

            dispatch(setUserStatus('authenticated'))
        } catch {
            dispatch(setUserStatus('not_authenticated'))
        }
    }

    const signIn = async ({ email, password }: { email: string, password: string }) => {
        const response = await useApi<ApiAuthUser>({ endpoint: 'accounts/signin', method: 'POST', data: { email, password }, withAuth: false })
        const user = response.data

        if (!response.error_detail) {
            dispatch(setUser({
                id: user.user.id,
                avatar: user.user.avatar,
                name: user.user.name,
                email: user.user.email,
                access_token: user.user.access
            }))
            dispatch(setUserStatus('authenticated'))

            // Save access_token in localstorage
            localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_LOCAL_STORAGE as string, user.user.access)
        } else {
            dispatch(setUserStatus('not_authenticated'))
        }

        return response.error_detail;
    }

    const signUp = async ({ name, email, password }: { name: string, email: string, password: string }) => {
        const response = await useApi<ApiAuthUser>({ endpoint: 'accounts/signup', method: 'POST', data: { name, email, password }, withAuth: false })
        const user = response.data

        if (!response.error_detail) {
            dispatch(setUser({
                id: user.user.id,
                avatar: user.user.avatar,
                name: user.user.name,
                email: user.user.email,
                access_token: user.user.access
            }))
            dispatch(setUserStatus('authenticated'))
            
            // Save access_token in localstorage
            localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_LOCAL_STORAGE as string, user.user.access)
        } else {
            dispatch(setUserStatus('not_authenticated'))
        }

        return response.error_detail;
    }

    const signOut = () => {
        dispatch(setUserStatus('not_authenticated'));
        localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_LOCAL_STORAGE as string)
    }
    
    return {
        user,
        initAuth,
        signIn,
        signUp,
        signOut
    };
}