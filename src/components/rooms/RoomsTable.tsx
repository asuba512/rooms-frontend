import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TableComponent from '../TableComponent/TableComponent'
import { RootState } from '../../redux/type'
import { roomTypesAsObject } from '../../redux/rooms/utils'
import {
    getRooms,
    deleteBulkRooms,
    deleteRoom,
    getRoomById,
    createRoom,
    editRoom,
} from '../../redux/rooms/roomsThunks'
import RoomDetail from './RoomDetail'
import { destroyRoomDetailActionCreator } from '../../redux/store'
import { IRoom } from '../../redux/rooms/type'

function RoomsTable() {
    const dispatch = useDispatch()
    const roomsState = useSelector((state: RootState) => state.roomsAPI)
    const isAdmin = useSelector(
        (state: RootState) => state.auth?.role === 'admin'
    )

    useEffect(() => {
        dispatch(getRooms())
    }, [dispatch])

    const rooms = roomsState.rooms || []
    const cells = {
        name: { title: 'Name' },
        roomType: {
            title: 'Room Type',
            allowedValues: roomTypesAsObject,
        },
        capacity: { title: 'Room Capacity', isNumeric: true },
        location: { title: 'Location', isOptional: true },
    }

    const onAddNewHandler = (data: IRoom) => {
        dispatch(createRoom(data))
    }

    const onEditHandler = (data: IRoom) => {
        dispatch(editRoom(data))
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
                rowData={rooms}
                cells={cells}
                defaultSort="name"
                uniqueKeys={['name']}
                onAddNew={isAdmin ? onAddNewHandler : undefined}
                onEdit={isAdmin ? onEditHandler : undefined}
                onViewDetail={onViewDetailHandler}
                onDelete={isAdmin ? onDeleteHandler : undefined}
                onDeleteBulk={isAdmin ? onDeleteBulkHandler : undefined}
            />
            <RoomDetail
                room={roomsState.room || undefined}
                isAdmin={isAdmin}
                handleClose={onViewDetailCloseHandler}
            />
        </>
    )
}

export default RoomsTable
