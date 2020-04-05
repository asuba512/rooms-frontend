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

interface ScheduleItemInterface {
    type: number
    name: string
    start: Date
    end: Date
    subject: string | null
}

export interface RoomDetailInterface extends RoomInterface {
    equipment: EquipmentInterface[]
    schedule?: ScheduleItemInterface[]
}

export interface RoomsState {
    rooms: RoomInterface[] | null
    room: RoomDetailInterface | null
    errorCode: number | null
}
