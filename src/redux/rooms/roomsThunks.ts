import { createAsyncThunk, ThunkAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import { IRoomDetail, IRoom } from './type'
import { UNEXPECTED_ERROR } from '../constant'

export const getRooms = createAsyncThunk('rooms/getAll', (arg, thunkAPI) => {
    return axios
        .get('https://wap-rooms.herokuapp.com/api/room')
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            const errorCode = error.response.status
            toast.error(UNEXPECTED_ERROR)
            return thunkAPI.rejectWithValue(errorCode)
        })
})

export const getRoomById = createAsyncThunk(
    'rooms/getById',
    (id: number, thunkAPI) => {
        return axios
            .get(`https://wap-rooms.herokuapp.com/api/room/${id}`)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                const errorCode = error.response.status
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(errorCode)
            })
    }
)

export const getRoomSchedule = createAsyncThunk(
    'rooms/getSchedule',
    (
        { id, start, end }: { id: number; start: string; end: string },
        thunkAPI
    ) => {
        return axios
            .get(`https://wap-rooms.herokuapp.com/api/room/${id}/schedule`, {
                params: { start: start, end: end },
            })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                const errorCode = error.response.status
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(errorCode)
            })
    }
)

export const createRoom = createAsyncThunk(
    'rooms/createRoom',
    (arg: IRoom, thunksAPI) => {
        return axios
            .post('https://wap-rooms.herokuapp.com/api/room/', arg)
            .then((response) => {
                const id = response.data
                return {
                    ...arg,
                    id,
                }
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunksAPI.rejectWithValue(false)
            })
    }
)

export const editRoom = createAsyncThunk(
    'rooms/editRoom',
    (arg: IRoomDetail, thunksAPI) => {
        const { id, ...data } = arg
        return axios
            .put(`https://wap-rooms.herokuapp.com/api/room/${id}/`, data)
            .then((response) => {
                return arg
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunksAPI.rejectWithValue(false)
            })
    }
)

export const deleteRoom = createAsyncThunk(
    'rooms/delete',
    (id: number, thunkAPI) => {
        return axios
            .delete(`https://wap-rooms.herokuapp.com/api/room/${id}`)
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

export const deleteBulkRooms = createAsyncThunk(
    'rooms/deleteBulk',
    (ids: number[], thunkAPI) => {
        return axios
            .delete(`https://wap-rooms.herokuapp.com/api/room`, { data: ids })
            .then((response) => {
                return ids
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(ids)
            })
    }
)
