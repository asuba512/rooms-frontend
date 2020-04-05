import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'

import TopBar from './components/TopBar'
import LoginComponent from './components/LoginComponent'
import useStyles from './utils/useStyles'
import { CssBaseline } from '@material-ui/core'
import SideMenu from './components/SideMenu'
import RoomsTable from './components/rooms/RoomsTable'
import CoursesComponent from './components/CoursesComponent'
import { RootState } from './redux/type'
import UsersComponent from './components/UsersComponent'

function App() {
    const classes = useStyles()
    const isAuthorized = useSelector((state: RootState) => state.auth?.id)
    const [menuOpen, setMenuOpen] = useState(true)
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
                                <h1>Home</h1>
                            </Route>
                            <Route path="/users">
                                {!isAuthorized && <Redirect to="/login" />}
                                <UsersComponent />
                            </Route>
                            <Route path="/courses">
                                {!isAuthorized && <Redirect to="/login" />}
                                <CoursesComponent />
                            </Route>
                            <Route path="/rooms">
                                {!isAuthorized && <Redirect to="/login" />}
                                <RoomsTable />
                            </Route>
                            <Route path="/reservation">
                                {!isAuthorized && <Redirect to="/login" />}
                                <h1>Reservation</h1>
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
