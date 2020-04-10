import { ICourse } from '../courses/type'

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

interface IScheduleItem {
    type: number
    name: string
    start: Date
    end: Date
    subject: ICourse | null
}

export interface IRoomDetail extends IRoom {
    equipment?: IEquipment[]
    schedule?: IScheduleItem[]
}

export interface RoomsState {
    rooms: IRoom[] | null
    room: IRoomDetail | null
    errorCode: number | null
}
