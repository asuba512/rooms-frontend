import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom'

import TopBar from './components/TopBar'
import LoginComponent from './components/LoginComponent'
import mainLayoutStyles from './components/mainLayoutStyles'
import { CssBaseline } from '@material-ui/core'
import SideMenu from './components/SideMenu'
import RoomsTable from './components/rooms/RoomsTable'
import CoursesTable from './components/courses/CoursesTable'
import { RootState } from './redux/type'
import UsersTable from './components/users/UsersTable'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTheme from '@material-ui/core/styles/useTheme'
import FullSchedule from './components/FullSchedule'
import ReservationWizard from './components/reservations/ReservationWizard'
import ReservationsTable from './components/reservations/ReservationsTable'

function App() {
    const classes = mainLayoutStyles()
    const isAuthorized = useSelector((state: RootState) => state.auth?.id)
    const [menuOpen, setMenuOpen] = useState(true)
    const isSmall = useMediaQuery(useTheme().breakpoints.down('sm'))

    useEffect(() => {
        setMenuOpen(!isSmall)
    }, [isSmall])

    return (
        <>
            <CssBaseline />
            <TopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <Router>
                {isAuthorized && (
                    <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                )}
                <div className={classes.root}>
                    <div
                        className={
                            classes.content +
                            ' ' +
                            (isAuthorized
                                ? menuOpen
                                    ? classes.drawerMarginOpened
                                    : classes.drawerMarginClosed
                                : '')
                        }
                    >
                        <div className={classes.toolbarPadding} />
                        <Switch>
                            <Route path="/login">
                                {isAuthorized && <Redirect to="/home" />}
                                <LoginComponent />
                            </Route>
                            <Route exact path="/home">
                                {!isAuthorized && <Redirect to="/login" />}
                                <FullSchedule />
                            </Route>
                            <Route path="/users">
                                {!isAuthorized && <Redirect to="/login" />}
                                <UsersTable />
                            </Route>
                            <Route path="/courses">
                                {!isAuthorized && <Redirect to="/login" />}
                                <CoursesTable />
                            </Route>
                            <Route path="/rooms">
                                {!isAuthorized && <Redirect to="/login" />}
                                <RoomsTable />
                            </Route>
                            <Route path="/reservation">
                                {!isAuthorized && <Redirect to="/login" />}
                                <ReservationWizard />
                            </Route>
                            <Route path="/reservations">
                                {!isAuthorized && <Redirect to="/login" />}
                                <ReservationsTable />
                            </Route>
                            <Route path="/">
                                {!isAuthorized ? (
                                    <Redirect to="/login" />
                                ) : (
                                    <Redirect to="/home" />
                                )}
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>
        </>
    )
}

export default App
