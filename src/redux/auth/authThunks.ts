import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getUserTokenData } from '../../utils/getUserTokenData'
import { toast } from 'react-toastify'

export const getUserToken = createAsyncThunk(
    'auth/getUserToken',
    (
        { username, password }: { username: string; password: string },
        thunkAPI
    ) => {
        return axios
            .post(`${process.env.REACT_APP_BASE_API_URL}/api/token`, {
                username,
                password,
            })
            .then((response) => {
                const token = response.data.accessToken
                localStorage.setItem('jwtToken', token)
                const userData = getUserTokenData()
                if (userData) {
                    return userData
                }
                return thunkAPI.rejectWithValue("Couldn't decode the token.")
            })
            .catch((error) => {
                localStorage.removeItem('jwtToken')
                const errorCode = error.response.status
                if (errorCode !== 401) {
                    toast.error(
                        'Unexpected error in our authentication service. Please, try again later.'
                    )
                } else if (errorCode === 401) {
                    toast.error('Provided credentials are wrong.')
                }
                return thunkAPI.rejectWithValue({
                    errorCode: errorCode,
                })
            })
    }
)
