import { ICourse } from '../courses/type'
import { IUser } from '../users/type'
import { IRoom } from '../rooms/type'

export interface IReservation {
    id: number
    type: number
    name: string
    start: string
    end: string
    createdBy: IUser | null
    createdById: number | null
    subject: ICourse | null
    rooms: IRoom[] | null
    roomNames: string[] | null
}

export interface ReservationsState {
    reservations: IReservation[] | null
    reservation: IReservation | null
}
