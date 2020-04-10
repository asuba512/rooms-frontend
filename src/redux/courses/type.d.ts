import { IUser } from '../users/type'

export interface ICourse {
    id: number
    abbreviation: string
    name: string
    credits: string
}

interface ICourseDetail extends ICourse {
    teachers: IUser[]
}

export interface CoursesState {
    courses: ICourse[] | null
    course: ICourseDetail | null
    errorCode: number | null
}
