import {combineReducers} from 'redux'


import placeholderReducer from './placeholder/placeholderSlice'
import drawReducer from './draw/drawSlice'

const rootReducer = combineReducers({
    placeholder: placeholderReducer,
    draw: drawReducer,
})

export default rootReducer