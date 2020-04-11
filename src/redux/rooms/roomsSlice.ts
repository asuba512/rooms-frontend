import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    IRoom,
    IRoomDetail,
    RoomsState,
    IScheduleItem,
    IEquipment,
} from './type'
import {
    getRooms,
    deleteRoom,
    deleteBulkRooms,
    getRoomById,
    getRoomSchedule,
    editRoom,
    createRoom,
    deleteEquipment,
    createEquipment,
    editEquipment,
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
            { payload }: PayloadAction<IRoom[]>
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
            { payload }: PayloadAction<IRoomDetail>
        ) => {
            state.room = payload
        },
        [getRoomSchedule.fulfilled.type]: (
            state,
            { payload }: PayloadAction<IScheduleItem[]>
        ) => {
            if (state.room) {
                state.room.schedule = payload
            }
        },
        [createRoom.fulfilled.type]: (
            state,
            { payload }: PayloadAction<IRoom>
        ) => {
            if (state.rooms) {
                state.rooms.push(payload)
            }
        },
        [editRoom.fulfilled.type]: (
            state,
            { payload }: PayloadAction<IRoomDetail>
        ) => {
            if (state.room && state.room.id === payload.id) {
                state.room = {
                    ...state.room,
                    ...payload,
                }
            }
            if (state.rooms) {
                const index = state.rooms.findIndex(
                    (room) => room.id === payload.id
                )
                state.rooms[index] = {
                    ...state.rooms[index],
                    ...payload,
                }
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
        [createEquipment.fulfilled.type]: (
            state,
            { payload }: PayloadAction<IEquipment>
        ) => {
            if (state.room) {
                if (state.room.equipment) {
                    state.room.equipment.push(payload)
                } else {
                    state.room.equipment = [payload]
                }
            }
        },
        [editEquipment.fulfilled.type]: (
            state,
            { payload }: PayloadAction<IEquipment>
        ) => {
            if (state.room && state.room) {
                if (state.room.equipment) {
                    const index = state.room.equipment.findIndex(
                        (equipment) => equipment.id === payload.id
                    )
                    state.room.equipment[index] = payload
                } else {
                    state.room.equipment = [payload]
                }
            }
        },
        [deleteEquipment.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            if (state.room && state.room.equipment) {
                const index = state.room.equipment.findIndex(
                    (equipment) => equipment.id === payload
                )
                state.room.equipment.splice(index, 1)
            }
        },
    },
})
