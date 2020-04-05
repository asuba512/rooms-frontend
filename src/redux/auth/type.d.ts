export interface AuthState {
    id: number
    username: string
    role: string
    expiration: number
    errorCode: number | null
}
