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

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <LoadingBar style={{ zIndex: 10000 }} showFastActions />
            <App />
            <ToastContainer autoClose={false} />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
)
