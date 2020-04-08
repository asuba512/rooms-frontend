import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TableComponent from '../TableComponent/TableComponent'
import { RootState } from '../../redux/type'
import { mapRoomTypeEnumToString } from '../../redux/rooms/utils'
import {
    getRooms,
    deleteBulkRooms,
    deleteRoom,
    getRoomById,
} from '../../redux/rooms/roomsThunks'
import RoomDetail from './RoomDetail'
import { destroyRoomDetailActionCreator } from '../../redux/store'

function RoomsTable() {
    const dispatch = useDispatch()
    const roomsState = useSelector((state: RootState) => state.roomsAPI)
    const isAdmin = useSelector(
        (state: RootState) => state.auth?.role === 'admin'
    )

    useEffect(() => {
        dispatch(getRooms())
    }, [dispatch])

    const rooms =
        roomsState.rooms?.map((room) => {
            return {
                ...room,
                type: mapRoomTypeEnumToString(room.roomType),
            }
        }) || []
    const cells = {
        name: { title: 'Name', isNumeric: false },
        type: { title: 'Room Type', isNumeric: false },
        capacity: { title: 'Room Capacity', isNumeric: true },
        location: { title: 'Location', isNumeric: false },
    }

    const onViewDetailHandler = (id: number) => {
        dispatch(getRoomById(id))
    }

    const onViewDetailCloseHandler = () => {
        dispatch(destroyRoomDetailActionCreator())
    }

    const onDeleteHandler = (id: number) => {
        dispatch(deleteRoom(id))
    }

    const onDeleteBulkHandler = (ids: number[]) => {
        dispatch(deleteBulkRooms(ids))
    }

    return (
        <>
            <TableComponent
                title="Rooms"
                data={rooms}
                cells={cells}
                defaultSort="name"
                onViewDetail={onViewDetailHandler}
                onDelete={isAdmin ? onDeleteHandler : undefined}
                onDeleteBulk={isAdmin ? onDeleteBulkHandler : undefined}
            />
            <RoomDetail
                room={roomsState.room || undefined}
                handleClose={onViewDetailCloseHandler}
            />
        </>
    )
}

export default RoomsTable
