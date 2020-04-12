import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import logger from 'redux-logger'

import { loadingBarReducer } from 'react-redux-loading-bar'

import loadingBarMiddleware from '../middleware/loadingBarMiddleware'
import { authSlice } from './auth/authSlice'
import { coursesSlice } from './courses/coursesSlice'
import { roomsSlice } from './rooms/roomsSlice'
import { usersSlice } from './users/usersSlice'
import { reservationsSlice } from './reservation/reservationsSlice'

const reducer = {
    auth: authSlice.reducer,
    roomsAPI: roomsSlice.reducer,
    coursesAPI: coursesSlice.reducer,
    usersAPI: usersSlice.reducer,
    reservationsAPI: reservationsSlice.reducer,
    loadingBar: loadingBarReducer,
}

const middleware =
    process.env.NODE_ENV === 'production'
        ? [...getDefaultMiddleware(), loadingBarMiddleware]
        : [...getDefaultMiddleware(), loadingBarMiddleware, logger]

export const {
    set: setAuthDataActionCreator,
    logout: logoutUserActionCreator,
} = authSlice.actions
export const {
    destroyRoomDetail: destroyRoomDetailActionCreator,
} = roomsSlice.actions
export const {
    destroyCourseDetail: destroyCourseDetailActionCreator,
} = coursesSlice.actions
export default configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
})
