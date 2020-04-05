import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import logger from 'redux-logger'

import { loadingBarReducer } from 'react-redux-loading-bar'

import loadingBarMiddleware from '../middleware/loadingBarMiddleware'
import { authSlice } from './auth/authSlice'
import { coursesSlice } from './courses/coursesSlice'
import { roomsSlice } from './rooms/roomsSlice'
import { usersSlice } from './users/usersSlice'

const reducer = {
    auth: authSlice.reducer,
    roomsAPI: roomsSlice.reducer,
    courses: coursesSlice.reducer,
    users: usersSlice.reducer,
    loadingBar: loadingBarReducer,
}

const middleware = [...getDefaultMiddleware(), loadingBarMiddleware, logger]

export const {
    set: setAuthDataActionCreator,
    logout: logoutUserActionCreator,
} = authSlice.actions
export const {
    destroyRoomDetail: destroyRoomDetailActionCreator,
} = roomsSlice.actions
export default configureStore({
    reducer,
    middleware,
})
