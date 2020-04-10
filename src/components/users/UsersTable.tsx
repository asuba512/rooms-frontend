import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TableComponent from '../TableComponent/TableComponent'
import { RootState } from '../../redux/type'
import { createUser, getUsers } from '../../redux/users/usersThunks'
import { deleteBulkUsers, deleteUser } from '../../redux/users/usersThunks'
import { toast } from 'react-toastify'
import { IUser } from '../../redux/users/type'

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
    }

    const onViewDetailHandler = (id: number) => {
        console.log(id)
    }

    const onAddNewHandler = (data: IUser) => {
        dispatch(createUser(data))
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

    const canBeDeleted = (id: number) => {
        return id !== currentUserId
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
            uniqueKey="username"
            onViewDetail={onViewDetailHandler}
            onAddNew={isAdmin ? onAddNewHandler : undefined}
            onDelete={isAdmin ? onDeleteHandler : undefined}
            onDeleteBulk={isAdmin ? onDeleteBulkHandler : undefined}
            canBeDeleted={canBeDeleted}
        />
    )
}

export default UsersTable
