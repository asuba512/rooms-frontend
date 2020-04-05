export type Order = 'asc' | 'desc'

const ascendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
    const A = a[orderBy]
    const B = b[orderBy]
    if (typeof A == 'string' && typeof B == 'string') {
        return A.localeCompare(B)
    } else {
        if (A > B) {
            return 1
        } else if (A < B) {
            return -1
        } else {
            return 0
        }
    }
}

export const getComparator = <Key extends keyof any>(
    order: Order,
    orderBy: Key
): ((
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number) => {
    return order === 'desc'
        ? (a, b) => -ascendingComparator(a, b, orderBy)
        : (a, b) => ascendingComparator(a, b, orderBy)
}

export const stableSort = <T>(
    array: T[],
    comparator: (a: T, b: T) => number
) => {
    const stabilizedArray = array.map((el, index) => [el, index] as [T, number])
    stabilizedArray.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedArray.map((el) => el[0])
}
