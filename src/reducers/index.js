import { combineReducers } from 'redux';
// Imports: Reducers

 import home_Reducer from './home_reducers';
 import auth_Reducer from './auth_reducers';



// Redux: Root Reducer
const rootReducer = combineReducers({
     auth_Reducer : auth_Reducer,
     home_Reducer : home_Reducer,
    
   

});
// Exports
export default rootReducer;