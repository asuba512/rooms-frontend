import { Middleware } from '@reduxjs/toolkit'
import { showLoading, hideLoading } from 'react-redux-loading-bar'

const loadingBarMiddleware: Middleware = (api) => (next) => (action) => {
  const isPending = new RegExp(`pending$`, 'g')
  const isFulfilled = new RegExp(`fulfilled$`, 'g')
  const isRejected = new RegExp(`rejected$`, 'g')
  if (action.type.match(isPending)) {
    api.dispatch(showLoading())
  } else if (action.type.match(isFulfilled) || action.type.match(isRejected)) {
    api.dispatch(hideLoading())
  }
  return next(action)
}

export default loadingBarMiddleware
