import React from 'react'
import ReactDOM from 'react-dom'
import { ToastContainer } from 'react-toastify'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store, { setAuthDataActionCreator } from './redux/store'
import LoadingBar from 'react-redux-loading-bar'
import { getUserTokenData } from './utils/getUserTokenData'

import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

const userData = getUserTokenData()
if (userData) {
    store.dispatch(setAuthDataActionCreator(userData))
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#00a9e0',
        },
        secondary: {
            main: '#e4002b',
        },
        contrastThreshold: 2,
        tonalOffset: 0.2,
    },
})
console.log(process.env.REACT_APP_API_URL)
console.log(process.env.NODE_ENV)

ReactDOM.render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <LoadingBar
                    style={{ zIndex: 10000 }}
                    showFastActions
                    updateTime={1}
                />
                <App />
                <ToastContainer autoClose={false} />
            </ThemeProvider>
        </Provider>
    </MuiPickersUtilsProvider>,
    document.getElementById('root')
)
