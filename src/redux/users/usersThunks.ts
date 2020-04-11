import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import { UNEXPECTED_ERROR } from '../constant'
import { IUser } from './type'

export const getUsers = createAsyncThunk('users/getAll', (arg, thunkAPI) => {
    return axios
        .get('https://wap-rooms.herokuapp.com/api/user')
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            const errorCode = error.response.status
            toast.error(UNEXPECTED_ERROR)
            return thunkAPI.rejectWithValue(errorCode)
        })
})

export const createUser = createAsyncThunk(
    'users/createUser',
    (arg: IUser, thunkAPI) => {
        arg.password = Math.random().toString(36).slice(-8)
        return axios
            .post('https://wap-rooms.herokuapp.com/api/user', arg)
            .then((response) => {
                const id = response.data
                return {
                    ...arg,
                    password: null,
                    id,
                }
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
            })
    }
)

export const editUser = createAsyncThunk(
    'users/editUser',
    (arg: IUser, thunkAPI) => {
        const { id, ...data } = arg
        return axios
            .put(`https://wap-rooms.herokuapp.com/api/user/${id}`, data)
            .then((response) => {
                return arg
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
            })
    }
)
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
                toast.error(UNEXPECTED_ERROR)
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
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(ids)
            })
    }
)
