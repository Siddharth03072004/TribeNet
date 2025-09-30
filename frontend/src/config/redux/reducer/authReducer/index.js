import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequest, loginUser, registerUser } from "../../action/authAction";

const { connect } = require("react-redux");

const initialState = {
    user: undefined,
    isError : false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    isTokenThere: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: [],
    all_users: [],
    all_profiles_fetched: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: ()=> initialState,
        handleLoginUser: (state)=>{
            state.message = "Hello";
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state)=>{
            state.isTokenThere = true;
        },
        setTokenIsNotThere: (state)=>{
            state.isTokenThere = false;
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(loginUser.pending, (state)=>{
            state.isLoading = true;
            state.message = "Knoking the door...";

        })
        .addCase(loginUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "Login is Successful";
            
        })
        .addCase(loginUser.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(registerUser.pending   , (state)=>{
            state.isLoading = true;
            state.message = "Creating your account...";
        })
        .addCase(registerUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.message = {message: "Account created successfully. Please login."};
        })
        .addCase(registerUser.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAboutUser.fulfilled,(state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload;
        })
        .addCase(getAllUsers.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.all_users = action.payload;
            state.all_profiles_fetched = true;
            
        })
        .addCase(getConnectionsRequest.fulfilled, (state, action)=>{
            state.connections = action.payload.connections;
        })
        .addCase(getConnectionsRequest.rejected, (state, action)=>{
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getMyConnectionRequest.fulfilled, (state, action)=>{
            state.connectionRequests = action.payload.connections;
        })
        .addCase(getMyConnectionRequest.rejected, (state, action)=>{
            state.isError = true;
            state.message = action.payload;
        });
    }

})

export const {reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer;