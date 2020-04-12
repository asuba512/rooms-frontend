import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IReservation, ReservationsState } from './type'
import {
    createReservation,
    deleteBulkReservations,
    deleteReservation,
    getReservations,
} from './reservationsThunks'

const initialState = {
    reservations: null,
    reservation: null,
}

export const reservationsSlice = createSlice({
    name: 'reservations',
    initialState: initialState as ReservationsState,
    reducers: {
        destroyReservationDetail: (state, action: PayloadAction) => {
            state.reservation = null
        },
    },
    extraReducers: {
        [getReservations.fulfilled.type]: (
            state,
            { payload }: PayloadAction<IReservation[]>
        ) => {
            state.reservations = payload
        },
        [createReservation.fulfilled.type]: (
            state,
            action: PayloadAction<boolean>
        ) => {},
        [deleteReservation.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number>
        ) => {
            if (state.reservations) {
                const index = state.reservations.findIndex(
                    (reservation) => reservation.id === payload
                )
                state.reservations.splice(index, 1)
            }
        },
        [deleteBulkReservations.fulfilled.type]: (
            state,
            { payload }: PayloadAction<number[]>
        ) => {
            if (state.reservations) {
                state.reservations = state.reservations.filter(
                    (reservation) => !payload.includes(reservation.id)
                )
            }
        },
    },
})
