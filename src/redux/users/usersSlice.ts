import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, UsersState } from './type'
import {
    createUser,
    deleteBulkUsers,
    deleteUser,
    getUsers,
} from './usersThunks'

const initialState = {
    users: null,
    user: null,
    errorCode: null,
}

export const usersSlice = createSlice({
    name: 'users',
    initialState: initialState as UsersState,
    reducers: {},
    extraReducers: {
        [getUsers.fulfilled.type]: (
            state,
            { payload }: PayloadAction<IUser[]>
        ) => {
            state.users = payload
        },
        [getUsers.rejected.type]: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            state.errorCode = payload
        },
        [createUser.fulfilled.type]: (
            state,
            { payload }: PayloadAction<IUser>
        ) => {
            if (state.users) {
                state.users.push(payload)
            }
        },
        [deleteUser.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            if (state && state.users) {
                return {
                    users: state.users.filter((user) => user.id !== payload),
                    user: null,
                    errorCode: null,
                }
            }
            return state
        },
        [deleteBulkUsers.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number[]>
        ) => {
            if (state && state.users) {
                return {
                    users: state.users.filter(
                        (user) => !payload.includes(user.id)
                    ),
                    user: null,
                    errorCode: null,
                }
            }
            return state
        },
    },
})
