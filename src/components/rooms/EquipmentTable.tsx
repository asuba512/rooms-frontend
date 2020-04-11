import TableComponent from '../TableComponent/TableComponent'
import React from 'react'
import { IEquipment, IRoomDetail } from '../../redux/rooms/type'
import { useDispatch } from 'react-redux'
import {
    createEquipment,
    deleteEquipment,
    editEquipment,
} from '../../redux/rooms/roomsThunks'

interface EquipmentTableProps {
    room?: IRoomDetail
    isAdmin: boolean
}

function EquipmentTable({ room, isAdmin }: EquipmentTableProps) {
    const dispatch = useDispatch()

    const onAddNewHandler = (data: IEquipment) => {
        if (room) {
            dispatch(createEquipment({ roomId: room.id, data }))
        }
    }

    const onEditHandler = (data: IEquipment) => {
        dispatch(editEquipment(data))
    }

    const onDeleteHandler = (id: number) => {
        dispatch(deleteEquipment(id))
    }

    return (
        <TableComponent
            title="Equipment"
            rowData={room?.equipment || []}
            cells={{
                type: { title: 'Type' },
                brand: { title: 'Brand', isOptional: true },
                model: { title: 'Model', isOptional: true },
                quantity: {
                    title: 'Quantity',
                    isNumeric: true,
                },
            }}
            defaultSort="type"
            uniqueKeys={['type']}
            onAddNew={isAdmin ? onAddNewHandler : undefined}
            onEdit={isAdmin ? onEditHandler : undefined}
            onDelete={isAdmin ? onDeleteHandler : undefined}
        />
    )
}

export default EquipmentTable
