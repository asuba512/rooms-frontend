import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import mainLayoutStyles from './components/mainLayoutStyles'

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
