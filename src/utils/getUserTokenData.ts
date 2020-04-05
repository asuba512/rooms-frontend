import jwt from 'jsonwebtoken'
import axios from 'axios'

import { KeyToClaimURI } from './keyToClaimURI'
import { AuthState } from '../redux/type'

const setAuthorizationToken = (token: string) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}

const unsetAuthorizationToken = () => {
    delete axios.defaults.headers.common['Authorization']
}

export const getUserTokenData: () => AuthState | null = () => {
    const token = localStorage.jwtToken
    try {
        setAuthorizationToken(token)
        const decoded = jwt.decode(token) as { [key: string]: any }
        const now = new Date()
        const expirationTime = new Date(decoded.exp * 1000)
        if (now < expirationTime) {
            return {
                username: decoded[KeyToClaimURI.USERNAME],
                id: Number(decoded[KeyToClaimURI.ID]),
                role: decoded[KeyToClaimURI.ROLE],
                expiration: decoded.exp * 1000,
                errorCode: null,
            }
        }
    } catch {}

    localStorage.removeItem('jwtToken')
    unsetAuthorizationToken()
    return null
}

export const removeUserToken = () => {
    localStorage.removeItem('jwtToken')
    unsetAuthorizationToken()
}
