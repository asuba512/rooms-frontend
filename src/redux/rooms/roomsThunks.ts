import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const UNEXPECTED_ERROR =
    'Unexpected error in our backend service. Please, try again later.'
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
    ({ id, start, end }: { id: number; start: Date; end: Date }, thunkAPI) => {
        return axios
            .get(`https://wap-rooms.herokuapp.com/api/room/${id}/schedule`, {
                params: { start: start.toISOString(), end: end.toISOString() },
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
