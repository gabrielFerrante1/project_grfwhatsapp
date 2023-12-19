import { AppModes } from "@/types/App";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        mode: 'default' as AppModes 
    },
    reducers: {
        setAppMode: (state, action: PayloadAction<AppModes>) => {
            state.mode = action.payload
        }
    }
});

export const {
    setAppMode
} = appSlice.actions;

export default appSlice.reducer;