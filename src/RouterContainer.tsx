import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'
import mainLayoutStyles from './utils/mainLayoutStyles'

function RouterContainer() {
    const classes = mainLayoutStyles()
    return (
        <>
            <Router>
                <Switch></Switch>
            </Router>
        </>
    )
}

export default RouterContainer
