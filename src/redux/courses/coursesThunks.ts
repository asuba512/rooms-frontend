import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import { UNEXPECTED_ERROR } from '../constant'
import { ICourse } from './type'

export const getCourses = createAsyncThunk(
    'courses/getAll',
    (arg, thunkAPI) => {
        return axios
            .get('https://wap-rooms.herokuapp.com/api/subject')
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

export const createCourse = createAsyncThunk(
    'courses/createCourse',
    (arg: ICourse, thunkAPI) => {
        return axios
            .post('https://wap-rooms.herokuapp.com/api/subject', arg)
            .then((response) => {
                const id = response.data
                return { ...arg, id }
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
            })
    }
)

export const deleteCourse = createAsyncThunk(
    'courses/delete',
    (id: number, thunkAPI) => {
        return axios
            .delete(`https://wap-rooms.herokuapp.com/api/subject/${id}`)
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

export const deleteBulkCourses = createAsyncThunk(
    'courses/deleteBulk',
    (ids: number[], thunkAPI) => {
        return axios
            .delete(`https://wap-rooms.herokuapp.com/api/subject`, {
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
