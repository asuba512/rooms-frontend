import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import { IEquipment, IRoom, IRoomDetail } from './type'
import { UNEXPECTED_ERROR } from '../constant'

// Rooms

export const getRooms = createAsyncThunk('rooms/getAll', (arg, thunkAPI) => {
    return axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/room`)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            toast.error(UNEXPECTED_ERROR)
            return thunkAPI.rejectWithValue(false)
        })
})

export const getRoomById = createAsyncThunk(
    'rooms/getById',
    (id: number, thunkAPI) => {
        return axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/api/room/${id}`)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
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
            .get(
                `${process.env.REACT_APP_API_BASE_URL}/api/room/${id}/schedule`,
                {
                    params: { start: start, end: end },
                }
            )
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
            })
    }
)

export const createRoom = createAsyncThunk(
    'rooms/createRoom',
    (arg: IRoom, thunksAPI) => {
        arg.roomType = Number(arg.roomType)
        return axios
            .post(`${process.env.REACT_APP_API_BASE_URL}/api/room/`, arg)
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
        arg.roomType = Number(arg.roomType)
        const { id, ...data } = arg
        return axios
            .put(`${process.env.REACT_APP_API_BASE_URL}/api/room/${id}/`, data)
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
            .delete(`${process.env.REACT_APP_API_BASE_URL}/api/room/${id}`)
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
            .delete(`${process.env.REACT_APP_API_BASE_URL}/api/room`, {
                data: ids,
            })
            .then((response) => {
                return ids
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(ids)
            })
    }
)

export const getAvailableRooms = createAsyncThunk(
    'rooms/getAvailable',
    (
        {
            start,
            end,
            numberOfWeeks,
            repeatsIn,
            capacity,
        }: {
            start: string
            end: string
            numberOfWeeks: number
            repeatsIn: number
            capacity: number
        },
        thunkAPI
    ) => {
        return axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/api/room/filter`, {
                params: {
                    start,
                    end,
                    n: numberOfWeeks,
                    gap: repeatsIn,
                    capacity,
                },
            })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
            })
    }
)

// Equipment

export const createEquipment = createAsyncThunk(
    'rooms/createEqipment',
    ({ roomId, data }: { roomId: number; data: IEquipment }, thunksAPI) => {
        return axios
            .post(
                `${process.env.REACT_APP_API_BASE_URL}/api/room/${roomId}/equipment`,
                data
            )
            .then((response) => {
                const id = response.data
                return {
                    ...data,
                    id,
                }
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunksAPI.rejectWithValue(false)
            })
    }
)

export const editEquipment = createAsyncThunk(
    'rooms/editEquipment',
    (arg: IEquipment, thunksAPI) => {
        const { id, ...data } = arg
        return axios
            .put(
                `${process.env.REACT_APP_API_BASE_URL}/api/equipment/${id}/`,
                data
            )
            .then((response) => {
                return arg
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunksAPI.rejectWithValue(false)
            })
    }
)

export const deleteEquipment = createAsyncThunk(
    'rooms/deleteEquipment',
    (id: number, thunkAPI) => {
        return axios
            .delete(`${process.env.REACT_APP_API_BASE_URL}/api/equipment/${id}`)
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
