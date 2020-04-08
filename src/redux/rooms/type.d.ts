export interface RoomInterface {
    id: number
    name: string
    location: string | null
    capacity: number
    roomType: number
}

interface EquipmentInterface {
    id: number
    type: string
    brand: string
    model: string
    quantity: number
}

interface SubjectInterface {
    id: number
    name: string
    abbreviation: string
    credits: number
    teachers: any
}

interface ScheduleItemInterface {
    type: number
    name: string
    start: Date
    end: Date
    subject: SubjectInterface | null
}

export interface RoomDetailInterface extends RoomInterface {
    equipment?: EquipmentInterface[]
    schedule?: ScheduleItemInterface[]
}

export interface RoomsState {
    rooms: RoomInterface[] | null
    room: RoomDetailInterface | null
    errorCode: number | null
}
