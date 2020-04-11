import { IUser } from './type'

export const formatFullName = (user: IUser) =>
    `${user.titleBefore ? user.titleBefore + ' ' : ''}${user.firstName} ${
        user.lastName
    }${user.titleAfter ? ', ' + user.titleAfter : ''}`
