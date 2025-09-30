import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";






export const getAllPosts = createAsyncThunk("post/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get('/posts')
            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const createPost = createAsyncThunk("post/createPost",
    async (userData, thunkAPI) => {
        const {file, body} = userData;
        try {
            const formData = new FormData();
            formData.append('token', localStorage.getItem('token'));
            formData.append('body', body);
            formData.append('media', file);
            const response = await clientServer.post('/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(response.status === 200){

                return thunkAPI.fulfillWithValue("Post Uploaded Successfully");
            } else{
                return thunkAPI.rejectWithValue("Error in uploading post");
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const deletePost = createAsyncThunk("post/deletePost",
    async ({postId}, thunkAPI) => {
        try {
            const response = await clientServer.delete(`delete_post`, {
                data: {
                    token: localStorage.getItem('token'),
                    postId
                }
            });
            return thunkAPI.fulfillWithValue({postId, ...response.data});
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const incrementPostLike = createAsyncThunk("post/incrementLike",
    async ({postId}, thunkAPI) => {
        try {
            const response = await clientServer.post(`increment_post_like`, {
                postId,
                token: localStorage.getItem('token')
            });
            return thunkAPI.fulfillWithValue({postId, ...response.data});
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const getAllComments = createAsyncThunk("post/getAllComments",
    async (postdata, thunkAPI) => {
        try {

            const response = await clientServer.get('/get_comments', {
                params: {
                    postId: postdata.postId,
                }
            });
            return thunkAPI.fulfillWithValue({postId: postdata.postId, comments: response.data.comments});
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);  


export const postComment = createAsyncThunk("post/postComment",
    async (commentData, thunkAPI) => {

        try {
            console.log({
                postId: commentData.postId,
                commentBody: commentData.body
            })
            const response = await clientServer.post('/comment', {
                token: localStorage.getItem('token'),
                postId: commentData.postId,
                commentBody: commentData.body
            });
            return thunkAPI.fulfillWithValue({postId: commentData.postId, comment: response.data.comment});
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
        
