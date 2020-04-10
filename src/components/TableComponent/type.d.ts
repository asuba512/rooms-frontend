export interface IRow {
    id: number
    [key: string]: any
}

export interface ICells {
    [key: string]: {
        title: string
        isNumeric?: boolean
        isOptional?: boolean
        allowedValues?: { [key: number]: string }
    }
}
