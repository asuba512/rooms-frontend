import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

export const getUsers = createAsyncThunk('users/getAll', (arg, thunkAPI) => {
    return axios
        .get('https://wap-rooms.herokuapp.com/api/user')
        .then((response) => {
            return {
                users: response.data,
            }
        })
        .catch((error) => {
            const errorCode = error.response.status
            toast.error(
                'Unexpected error in our backend service. Please, try again later.'
            )
            return thunkAPI.rejectWithValue({
                errorCode: errorCode,
            })
        })
})

export const deleteUser = createAsyncThunk(
    'users/delete',
    (id: number, thunkAPI) => {
        return axios
            .delete(`https://wap-rooms.herokuapp.com/api/user/${id}`)
            .then((response) => {
                return id
            })
            .catch((error) => {
                const errorCode = error.response.status
                if (errorCode === 404) {
                    return id
                }
                toast.error(
                    'Unexpected error in our backend service. Please, try again later.'
                )
                return thunkAPI.rejectWithValue(id)
            })
    }
)

export const deleteBulkUsers = createAsyncThunk(
    'users/deleteBulk',
    (ids: number[], thunkAPI) => {
        return axios
            .delete(`https://wap-rooms.herokuapp.com/api/user`, { data: ids })
            .then((response) => {
                return ids
            })
            .catch((error) => {
                toast.error(
                    'Unexpected error in our backend service. Please, try again later.'
                )
                return thunkAPI.rejectWithValue(ids)
            })
    }
)
