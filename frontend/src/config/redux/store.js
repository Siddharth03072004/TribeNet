import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer"

/**
 * 
 * Steps for State management using Redux
 * Submit Action
 * Handle action in its reducer
 * Register Here -> Reducer
 */


export const store = configureStore({
    reducer: {
        // register reducers here
        auth: authReducer,
        postReducer: postReducer
    }
});
