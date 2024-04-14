import { createStore ,applyMiddleware} from 'redux'
import { createMigrate, persistStore, persistReducer } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

//import storage from 'redux-persist/lib/storage'
import logger from 'redux-logger'
import thunk from "redux-thunk";
import rootReducer from '../reducers/index';
const persistConfig = {
    key: 'root',
   storage: AsyncStorage

  }

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = createStore(persistedReducer, applyMiddleware(thunk,logger));
export const persistor = persistStore(store);