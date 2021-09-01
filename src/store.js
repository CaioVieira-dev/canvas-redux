import {createStore} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './features/rootReducer'

const store = createStore(rootReducer,composeWithDevTools())

export default store