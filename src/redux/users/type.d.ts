import { ICourse } from '../courses/type'

export interface IUser {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    titleBefore: string | null
    titleAfter: string | null
    password: string | null
}

export interface UsersState {
    users: IUser[] | null
    errorCode: number | null
}
