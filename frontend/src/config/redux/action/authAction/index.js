import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const loginUser = createAsyncThunk(
    'auth/login',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/login', {
                email: user.email,
                password: user.password
            });
            if(response.data.token){
                localStorage.setItem('token', response.data.token);

            } else {
                return thunkAPI.rejectWithValue({message:"No token received"});
            }

            return thunkAPI.fulfillWithValue(response.data.token)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            const request = await clientServer.post("/register", {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name,
            })
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
);


export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI)=> {
        try {
            const response = await clientServer.get("/get_user_and_profile", {
                params: {
                    token: user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkAPI)=> {
        try {
            const response = await clientServer.get("/get_all_user_profiles")
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const sendConnectionRequest = createAsyncThunk("user/sendConnectionRequest",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/send_connection_request", {
                token: user.token,
                connectionId: user.userId
            });
            thunkAPI.dispatch(getConnectionsRequest({token:user.token}))
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getConnectionsRequest = createAsyncThunk("user/getConnectionsRequest",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/getConnectionsRequest", {
                params: { token: user.token }
            });
            return thunkAPI.fulfillWithValue({connections: response.data.connections});
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const getMyConnectionRequest = createAsyncThunk("user/getMyConnectionRequest",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/user_connection_request", {
                params: { token: user.token }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const AcceptConnection = createAsyncThunk("user/AcceptConnection",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/accept_connection_request", {
                token: user.token,
                requestId: user.connectionId,
                action_type: user.action
            });
            thunkAPI.dispatch(getConnectionsRequest({token:user.token}))
            thunkAPI.dispatch(getMyConnectionRequest({token:user.token}))
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);