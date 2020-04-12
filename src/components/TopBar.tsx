import React from 'react'
import {
    AppBar,
    Grid,
    IconButton,
    Toolbar,
    Typography,
} from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Menu from '@material-ui/icons/Menu'
import { logoutUserActionCreator } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import mainLayoutStyles from './mainLayoutStyles'
import { RootState } from '../redux/type'
import { removeUserToken } from '../utils/getUserTokenData'

interface TopBarProps {
    menuOpen: boolean
    setMenuOpen: (state: boolean) => void
}

function TopBar({ menuOpen, setMenuOpen }: TopBarProps) {
    const classes = mainLayoutStyles()
    const authState = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen)
    }

    const logoutHandler = () => {
        removeUserToken()
        dispatch(logoutUserActionCreator())
    }

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Grid item>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleMenuToggle}
                    >
                        <Menu />
                    </IconButton>
                </Grid>
                <Typography variant="h6" className={classes.appTitleBar}>
                    Room Reservation
                </Typography>
                <div className={classes.grow} />
                {authState?.id && (
                    <div>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item>
                                <div style={{ marginTop: '5px' }}>
                                    <AccountCircle />
                                </div>
                            </Grid>
                            <Grid item>{authState.username}</Grid>
                            <Grid item>
                                <IconButton
                                    color="inherit"
                                    onClick={logoutHandler}
                                >
                                    <ExitToApp />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default TopBar
