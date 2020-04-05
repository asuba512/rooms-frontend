import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CoursesState } from './type'
import { deleteBulkCourses, deleteCourse, getCourses } from './coursesThunks'

export const coursesSlice = createSlice({
    name: 'courses',
    initialState: null as CoursesState | null,
    reducers: {},
    extraReducers: {
        [getCourses.fulfilled.type]: (
            state,
            { payload }: PayloadAction<CoursesState>
        ) => {
            return payload
        },
        [getCourses.rejected.type]: (
            state,
            { payload }: PayloadAction<CoursesState>
        ) => {
            return payload
        },
        [deleteCourse.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            if (state && state.courses) {
                return {
                    errorCode: null,
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
                    courses: state.courses.filter(
                        (course) => !payload.includes(course.id)
                    ),
                }
            }
            return state
        },
    },
})
