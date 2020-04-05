import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    RoomInterface,
    RoomDetailInterface,
    RoomsState,
    ScheduleItemInterface,
} from './type'
import {
    getRooms,
    deleteRoom,
    deleteBulkRooms,
    getRoomById,
    getRoomSchedule,
} from './roomsThunks'

const initialState = {
    rooms: null,
    room: null,
    errorCode: null,
}

export const roomsSlice = createSlice({
    name: 'rooms',
    initialState: initialState as RoomsState,
    reducers: {
        destroyRoomDetail: (state, action: PayloadAction) => {
            state.room = null
        },
    },
    extraReducers: {
        [getRooms.fulfilled.type]: (
            state,
            { payload }: PayloadAction<RoomInterface[]>
        ) => {
            state.rooms = payload
        },
        [getRooms.rejected.type]: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            state.errorCode = payload
        },
        [getRoomById.fulfilled.type]: (
            state,
            { payload }: PayloadAction<RoomDetailInterface>
        ) => {
            state.room = payload
        },
        [getRoomSchedule.fulfilled.type]: (
            state,
            { payload }: PayloadAction<ScheduleItemInterface[]>
        ) => {
            if (state.room) {
                state.room.schedule = payload
            }
        },
        [deleteRoom.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            if (state.rooms) {
                return {
                    errorCode: null,
                    room: null,
                    rooms: state.rooms.filter((room) => room.id !== payload),
                }
            }
            return state
        },
        [deleteBulkRooms.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number[]>
        ) => {
            if (state.rooms) {
                return {
                    errorCode: null,
                    room: null,
                    rooms: state.rooms.filter(
                        (room) => !payload.includes(room.id)
                    ),
                }
            }
            return state
        },
    },
})
