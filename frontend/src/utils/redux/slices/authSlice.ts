import { User } from '@/types/User';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UserState = User | 'loading' | 'not_authenticated' | 'authenticated'

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null as User | null,
        user_status: 'loading' as UserState
    },
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload
        },
        setUserStatus: (state, action: PayloadAction<UserState>) => {
            state.user_status = action.payload
        }
    }
})

export const {
    setUser,
    setUserStatus
} = authSlice.actions;

export default authSlice.reducer;