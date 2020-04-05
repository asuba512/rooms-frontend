import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UsersState } from './type'
import { deleteBulkUsers, deleteUser, getUsers } from './usersThunks'

export const usersSlice = createSlice({
    name: 'users',
    initialState: null as UsersState | null,
    reducers: {},
    extraReducers: {
        [getUsers.fulfilled.type]: (
            state,
            { payload }: PayloadAction<UsersState>
        ) => {
            return payload
        },
        [getUsers.rejected.type]: (
            state,
            { payload }: PayloadAction<UsersState>
        ) => {
            return payload
        },
        [deleteUser.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            if (state && state.users) {
                return {
                    errorCode: null,
                    users: state.users.filter((user) => user.id !== payload),
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
                    errorCode: null,
                    users: state.users.filter(
                        (user) => !payload.includes(user.id)
                    ),
                }
            }
            return state
        },
    },
})
