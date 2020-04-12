import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import { UNEXPECTED_ERROR } from '../constant'

export const getReservations = createAsyncThunk(
    'reservations/getAll',
    (arg, thunkAPI) => {
        return axios
            .get('https://wap-rooms.herokuapp.com/api/reservation')
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
            })
    }
)

export const createReservation = createAsyncThunk(
    'reservations/create',
    (
        {
            start,
            end,
            numberOfWeeks,
            repeatsIn,
            roomIds,
            courseId,
            name,
            reservationType,
        }: {
            start: string
            end: string
            numberOfWeeks: number
            repeatsIn: number
            roomIds: number[]
            courseId: number
            name: string
            reservationType: number
        },
        thunkAPI
    ) => {
        return axios
            .post('https://wap-rooms.herokuapp.com/api/reservation', {
                start,
                end,
                times: numberOfWeeks,
                weeks: repeatsIn,
                rooms: roomIds,
                subject: courseId,
                name,
                type: reservationType,
            })
            .then((response) => {
                return true
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
            })
    }
)

export const deleteReservation = createAsyncThunk(
    'reservations/delete',
    (id: number, thunkAPI) => {
        return axios
            .delete(`https://wap-rooms.herokuapp.com/api/reservation/${id}`)
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

export const deleteBulkReservations = createAsyncThunk(
    'reservations/deleteBulk',
    (ids: number[], thunkAPI) => {
        return axios
            .delete(`https://wap-rooms.herokuapp.com/api/reservation`, {
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
