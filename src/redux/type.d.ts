import { AuthState } from './auth/type'
import { CoursesState } from './courses/type'
import { RoomsState } from './rooms/type'
import { UsersState } from './users/type'
import { ReservationsState } from './reservation/type'

export interface RootState {
    auth: AuthState | null
    coursesAPI: CoursesState
    roomsAPI: RoomsState
    usersAPI: UsersState
    reservationsAPI: ReservationsState
}

export { AuthState, CoursesState, RoomsState, UsersState }
