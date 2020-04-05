import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { RootState } from '../redux/type'
import { getUserToken } from '../redux/auth/authThunks'

function LoginComponent() {
    const dispatch = useDispatch()
    const authState = useSelector((state: RootState) => state.auth)
    const wrongCredentials = authState?.errorCode === 401
    const [username, setUsername] = useState('')
    const [usernameInvalid, setUsernameInvalid] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordInvalid, setPasswordInvalid] = useState(false)

    const handleLogin = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        toast.dismiss()
        if (!username || !password) {
            if (!username) {
                setUsernameInvalid(true)
            }
            if (!password) {
                setPasswordInvalid(true)
            }
            toast.error('Both username and password are required.')
            return
        } else {
            setUsernameInvalid(false)
            setPasswordInvalid(false)
            dispatch(getUserToken({ username: username, password: password }))
        }
    }

    return (
        <Grid
            container
            style={{ width: '100%', height: '50vh' }}
            justify="center"
        >
            <Grid
                container
                style={{ height: '100%' }}
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Paper
                        style={{
                            paddingTop: '50px',
                            paddingBottom: '50px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            margin: 'auto',
                        }}
                    >
                        <form onSubmit={handleLogin} noValidate={true}>
                            <Grid
                                container
                                direction="column"
                                justify="center"
                                alignItems="center"
                                alignContent="space-between"
                                spacing={3}
                            >
                                <Typography variant="h5">Log in</Typography>
                                <Grid item>
                                    <TextField
                                        error={
                                            usernameInvalid || wrongCredentials
                                        }
                                        type="text"
                                        label="Username"
                                        variant="outlined"
                                        required
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        error={
                                            passwordInvalid || wrongCredentials
                                        }
                                        type="password"
                                        label="Password"
                                        variant="outlined"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                    >
                                        Login
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default LoginComponent
