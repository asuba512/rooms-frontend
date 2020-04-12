import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import { UNEXPECTED_ERROR } from '../constant'
import { ICourse } from './type'

export const getCourses = createAsyncThunk(
    'courses/getAll',
    (arg, thunkAPI) => {
        return axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/api/subject`)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
            })
    }
)

export const getCourseById = createAsyncThunk(
    'courses/getById',
    (arg: number, thunkAPI) => {
        return axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/api/subject/${arg}`)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
            })
    }
)

export const createCourse = createAsyncThunk(
    'courses/createCourse',
    (arg: ICourse, thunkAPI) => {
        return axios
            .post(`${process.env.REACT_APP_API_BASE_URL}/api/subject`, arg)
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

export const editCourse = createAsyncThunk(
    'courses/editCourse',
    (arg: ICourse, thunkAPI) => {
        const { id, ...data } = arg
        return axios
            .put(
                `${process.env.REACT_APP_API_BASE_URL}/api/subject/${id}`,
                data
            )
            .then((response) => {
                return arg
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
            .delete(`${process.env.REACT_APP_API_BASE_URL}/api/subject/${id}`)
            .then((response) => {
                return id
            })
            .catch((error) => {
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

export const editTeachers = createAsyncThunk(
    'courses/teachers',
    ({ courseId, ids }: { courseId: number; ids: number[] }, thunkAPI) => {
        return axios
            .put(
                `https://wap-rooms.herokuapp.com/api/subject/${courseId}/teachers`,
                ids
            )
            .then((response) => {
                return ids
            })
            .catch((error) => {
                toast.error(UNEXPECTED_ERROR)
                return thunkAPI.rejectWithValue(false)
            })
    }
)
