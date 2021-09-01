import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import './styles.css'
import store from './store'

import App from './App';

console.log('initial state: ',store.getState())

const unsubscribe = store.subscribe(() =>  console.log('State after dispatch: ', store.getState()))

store.dispatch({type:"placeholder/test",payload:""})

unsubscribe()



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} >
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
