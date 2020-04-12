export const reservationTypesAsObject = {
    0: 'Lecture',
    1: 'Exercise',
    2: 'Demo',
    3: 'Exam',
    4: 'Other',
}

export const mapEventTypeToString: (eventType: number) => string = (
    eventType
) => {
    switch (eventType) {
        case 0:
            return 'Lecture'
        case 1:
            return 'Exercise'
        case 2:
            return 'Demo'
        case 3:
            return 'Exam'
        default:
        case 4:
            return 'Other'
    }
}

export const mapEventTypeToColor: (eventType: number) => string = (
    eventType
) => {
    switch (eventType) {
        case 0:
            return '#fe4a49'
        case 1:
            return '#2ab7ca'
        case 2:
            return '#fed766'
        case 3:
            return '#e6e6ea'
        default:
        case 4:
            return '#f4f4f8'
    }
}

export const mapEventTypeToDarkerColor: (eventType: number) => string = (
    eventType
) => {
    switch (eventType) {
        case 0:
            return '#9b3131'
        case 1:
            return '#1d8a9b'
        case 2:
            return '#9b803f'
        case 3:
            return '#98989b'
        default:
        case 4:
            return '#98989b'
    }
}
