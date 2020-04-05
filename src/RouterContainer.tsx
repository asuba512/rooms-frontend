import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import useStyles from './utils/useStyles'

function RouterContainer() {
  const classes = useStyles()
  return (
    <>
      <Router>
        <Switch></Switch>
      </Router>
    </>
  )
}

export default RouterContainer
