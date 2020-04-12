export interface ICourse {
    id: number
    abbreviation: string
    name: string
    credits: number
}

interface ICourseDetail extends ICourse {
    teachers: { id: number }[]
}

export interface CoursesState {
    courses: ICourse[] | null
    course: ICourseDetail | null
}
