import { IReservation } from '../reservation/type'

export interface IRoom {
    id: number
    name: string
    location: string | null
    capacity: number
    roomType: number
}

interface IEquipment {
    id: number
    type: string
    brand: string
    model: string
    quantity: number
}

export interface IRoomDetail extends IRoom {
    equipment?: IEquipment[]
    schedule?: IReservation[]
}

export interface RoomsState {
    rooms: IRoom[] | null
    room: IRoomDetail | null
}
