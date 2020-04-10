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

export interface IUserDetail extends IUser {
    subjects: ICourse[]
}

export interface UsersState {
    users: IUser[] | null
    user: IUserDetail | null
    errorCode: number | null
}
