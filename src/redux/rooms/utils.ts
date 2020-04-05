export const mapRoomTypeEnumToString = (roomType: number | undefined) => {
    switch (roomType) {
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
