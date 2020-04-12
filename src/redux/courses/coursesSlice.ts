import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CoursesState, ICourse, ICourseDetail } from './type'
import {
    createCourse,
    deleteBulkCourses,
    deleteCourse,
    editCourse,
    editTeachers,
    getCourseById,
    getCourses,
} from './coursesThunks'

const initialState = {
    courses: null,
    course: null,
}

export const coursesSlice = createSlice({
    name: 'courses',
    initialState: initialState as CoursesState,
    reducers: {
        destroyCourseDetail: (state, action: PayloadAction) => {
            state.course = null
        },
    },
    extraReducers: {
        [getCourses.fulfilled.type]: (
            state,
            { payload }: PayloadAction<ICourse[]>
        ) => {
            state.courses = payload
        },
        [getCourseById.fulfilled.type]: (
            state,
            { payload }: PayloadAction<ICourseDetail>
        ) => {
            state.course = payload
        },
        [createCourse.fulfilled.type]: (
            state,
            { payload }: PayloadAction<ICourse>
        ) => {
            if (state.courses) {
                state.courses.push(payload)
            }
        },
        [editCourse.fulfilled.type]: (
            state,
            { payload }: PayloadAction<ICourse>
        ) => {
            if (state.course && state.course.id === payload.id) {
                state.course = {
                    ...state.course,
                    ...payload,
                }
            }
            if (state.courses) {
                const index = state.courses.findIndex(
                    (course) => course.id === payload.id
                )
                state.courses[index] = {
                    ...state.courses[index],
                    ...payload,
                }
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
        [editTeachers.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number[]>
        ) => {
            if (state && state.course) {
                state.course.teachers = payload.map((id) => ({
                    id,
                }))
            }
        },
    },
})
