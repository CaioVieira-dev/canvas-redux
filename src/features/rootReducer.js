import {combineReducers} from 'redux'


import placeholderReducer from './placeholder/placeholderSlice'

const rootReducer = combineReducers({
    placeholder: placeholderReducer,
})

export default rootReducer