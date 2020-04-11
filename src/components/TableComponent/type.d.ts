export interface IRow {
    id: number
    [key: string]: any
}

export interface ICell {
    title: string
    isNumeric?: boolean
    isBoolean?: boolean
    isOptional?: boolean
    allowedValues?: { [enumValue: string]: string }
}

export interface ICells {
    [key: string]: ICell
}
