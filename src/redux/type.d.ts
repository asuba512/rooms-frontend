import { AuthState } from './auth/type'
import { CoursesState } from './courses/type'
import { RoomsState } from './rooms/type'
import { UsersState } from './users/type'

export interface RootState {
    auth: AuthState | null
    coursesAPI: CoursesState
    roomsAPI: RoomsState
    usersAPI: UsersState
}

export { AuthState, CoursesState, RoomsState, UsersState }
