import TableComponent from '../TableComponent/TableComponent'
import { useDispatch, useSelector } from 'react-redux'
import {
    deleteBulkReservations,
    deleteReservation,
    getReservations,
} from '../../redux/reservation/reservationsThunks'
import React, { useEffect } from 'react'
import { RootState } from '../../redux/type'
import { IRow } from '../TableComponent/type'
import moment from 'moment'

function ReservationsTable() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getReservations())
    }, [dispatch])

    const reservations =
        useSelector(
            (state: RootState) => state.reservationsAPI.reservations
        )?.map((reservation) => {
            return {
                id: reservation.id,
                name: reservation.name,
                start: moment.utc(reservation.start).local(),
                end: moment.utc(reservation.end).local(),
                subject: reservation.subject?.abbreviation || '',
                rooms: reservation.roomNames?.join(', ') || '',
                createdById: reservation.createdById,
            }
        }) || []

    const currentUserId = useSelector((state: RootState) => state.auth?.id)

    const cells = {
        name: { title: 'Name' },
        start: { title: 'Beginning', isDate: true },
        end: { title: 'End', isDate: true },
        subject: { title: 'Course' },
        rooms: { title: 'Rooms' },
    }

    const onDeleteHandler = (id: number) => {
        dispatch(deleteReservation(id))
    }

    const onDeleteBulkHandler = (ids: number[]) => {
        dispatch(deleteBulkReservations(ids))
    }

    const canBeDeleted = (item: IRow) => {
        return item.createdById === currentUserId
    }

    return (
        <TableComponent
            title="Reservations"
            rowData={reservations}
            cells={cells}
            defaultSort="start"
            onDelete={onDeleteHandler}
            onDeleteBulk={onDeleteBulkHandler}
            canBeDeleted={canBeDeleted}
        />
    )
}

export default ReservationsTable
