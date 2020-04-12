import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TableComponent from '../TableComponent/TableComponent'
import { RootState } from '../../redux/type'
import {
    createUser,
    deleteBulkUsers,
    deleteUser,
    editUser,
    getUsers,
} from '../../redux/users/usersThunks'
import { toast } from 'react-toastify'
import { IUser } from '../../redux/users/type'
import { IRow } from '../TableComponent/type'

function UsersTable() {
    const dispatch = useDispatch()
    const usersState = useSelector((state: RootState) => state.usersAPI)
    const [isAdmin, currentUserId] = useSelector((state: RootState) => [
        state.auth?.role === 'admin',
        state.auth?.id,
    ])

    const users = usersState?.users || []
    const cells = {
        username: { title: 'Login' },
        titleBefore: { title: 'Title(s) before', isOptional: true },
        firstName: { title: 'First Name' },
        lastName: { title: 'Last Name' },
        titleAfter: { title: 'Title(s) after', isOptional: true },
        email: { title: 'E-Mail' },
        isAdmin: { title: 'Admin', isBoolean: true, isOptional: true },
    }

    const onAddNewHandler = (data: IUser) => {
        dispatch(createUser(data))
    }

    const onEditHandler = (data: IUser) => {
        dispatch(editUser(data))
    }

    const onDeleteHandler = (id: number) => {
        if (id === currentUserId) {
            toast.error(
                'You tried to delete your account. If you really want to do that, log in as another admin.'
            )
            return
        }
        dispatch(deleteUser(id))
    }

    const onDeleteBulkHandler = (ids: number[]) => {
        dispatch(deleteBulkUsers(ids))
    }

    const canBeDeleted = (item: IRow) => {
        return item.id !== currentUserId
    }

    useEffect(() => {
        dispatch(getUsers())
    }, [dispatch])

    return (
        <TableComponent
            title="Users"
            rowData={users}
            cells={cells}
            defaultSort="lastName"
            uniqueKeys={['username', 'email']}
            onAddNew={isAdmin ? onAddNewHandler : undefined}
            onEdit={isAdmin ? onEditHandler : undefined}
            onDelete={isAdmin ? onDeleteHandler : undefined}
            onDeleteBulk={isAdmin ? onDeleteBulkHandler : undefined}
            canBeDeleted={canBeDeleted}
        />
    )
}

export default UsersTable
