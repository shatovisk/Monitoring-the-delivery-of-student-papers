import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Store from './store/store';
import StoreTeacher from './store/storeTeacher';

interface State {
    store: Store,
    storeTeacher: StoreTeacher
}

const store = new Store();
const storeTeacher = new StoreTeacher()

export const Context = createContext<State>({
    store,
    storeTeacher
})


ReactDOM.render(
    <Context.Provider value={{
        store:  new Store(),
        storeTeacher: new StoreTeacher()
    }}>
        <App />
    </Context.Provider>,
    document.getElementById('root')
);
