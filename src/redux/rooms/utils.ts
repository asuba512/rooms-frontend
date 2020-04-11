export const mapRoomTypeEnumToString = (roomType: number | undefined) => {
    switch (Number(roomType)) {
        case 0:
            return 'Lecture Room'
        case 1:
            return 'Laboratory'
        case 2:
            return 'Seminar Room'
        case 3:
            return 'Meeting Room'
        default:
            return 'Unknown'
    }
}

export const roomTypesAsObject = {
    '0': 'Lecture Room',
    '1': 'Laboratory',
    '2': 'Seminar Room',
    '3': 'Meeting Room',
}
