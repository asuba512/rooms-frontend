import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TableComponent from './TableComponent/TableComponent'
import { RootState } from '../redux/type'
import { getUsers } from '../redux/users/usersThunks'
import { deleteBulkUsers, deleteUser } from '../redux/users/usersThunks'
import { toast } from 'react-toastify'

function UsersComponent() {
    const dispatch = useDispatch()
    const usersState = useSelector((state: RootState) => state.users)
    const [isAdmin, currentUserId] = useSelector((state: RootState) => [
        state.auth?.role === 'admin',
        state.auth?.id,
    ])

    const users =
        usersState?.users?.map((user) => {
            return {
                ...user,
                name:
                    [user.titleBefore, user.firstName, user.lastName].join(
                        ' '
                    ) + (user.titleAfter ? `, ${user.titleAfter}` : ''),
            }
        }) || []
    const cells = {
        name: { title: 'Name', isNumeric: false },
        username: { title: 'Login', isNumeric: false },
        email: { title: 'E-Mail', isNumeric: false },
    }

    const onViewDetailHandler = (id: number) => {
        console.log(id)
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
            data={users}
            cells={cells}
            defaultSort="name"
            onViewDetail={onViewDetailHandler}
            onDelete={isAdmin ? onDeleteHandler : undefined}
            onDeleteBulk={isAdmin ? onDeleteBulkHandler : undefined}
            canBeDeleted={canBeDeleted}
        />
    )
}

export default UsersComponent
