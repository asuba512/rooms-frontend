import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ICourse, CoursesState } from './type'
import {
    createCourse,
    deleteBulkCourses,
    deleteCourse,
    getCourses,
} from './coursesThunks'

const initialState = {
    courses: null,
    course: null,
    errorCode: null,
}

export const coursesSlice = createSlice({
    name: 'courses',
    initialState: initialState as CoursesState,
    reducers: {},
    extraReducers: {
        [getCourses.fulfilled.type]: (
            state,
            { payload }: PayloadAction<ICourse[]>
        ) => {
            state.courses = payload
        },
        [getCourses.rejected.type]: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            state.errorCode = payload
        },
        [createCourse.fulfilled.type]: (
            state,
            { payload }: PayloadAction<ICourse>
        ) => {
            if (state.courses) {
                state.courses.push(payload)
            }
        },
        [deleteCourse.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            if (state.courses) {
                return {
                    errorCode: null,
                    course: null,
                    courses: state.courses.filter(
                        (course) => course.id !== payload
                    ),
                }
            }
            return state
        },
        [deleteBulkCourses.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number[]>
        ) => {
            if (state && state.courses) {
                return {
                    errorCode: null,
                    course: null,
                    courses: state.courses.filter(
                        (course) => !payload.includes(course.id)
                    ),
                }
            }
            return state
        },
    },
})
