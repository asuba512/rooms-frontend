import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getUserToken } from './authThunks'
import { AuthState } from './type'

export const authSlice = createSlice({
    name: 'auth',
    initialState: null as AuthState | null,
    reducers: {
        set: (state, action: PayloadAction<AuthState>) => {
            return action.payload
        },
        logout: (state, action: PayloadAction) => {
            return null
        },
    },
    extraReducers: {
        [getUserToken.fulfilled.type]: (
            state,
            { payload }: PayloadAction<AuthState>
        ) => {
            return payload
        },
        [getUserToken.rejected.type]: (
            state,
            { payload }: PayloadAction<AuthState>
        ) => {
            return payload
        },
    },
})
