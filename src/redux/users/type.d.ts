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
    isAdmin: boolean | ''
}

export interface IUserDetail extends IUser {
    courses: ICourse[]
}

export interface UsersState {
    users: IUser[] | null
    user: IUserDetail | null
}
