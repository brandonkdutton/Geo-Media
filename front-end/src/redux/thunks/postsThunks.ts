import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Post,
  FetchError,
  PostToCreate,
  Reply,
  ReplyToCreate,
  Category,
} from "../../types/postTypes";
import { fetchCognitoJWT } from "../../auth/CognitoUtils";

export const fetchPostsForLocation = createAsyncThunk<
  Post[],
  { locId: number; offset: number; filterTags: Category[] },
  { rejectValue: FetchError }
>(
  "posts/fetchPostsForLocation",
  async ({ locId, offset, filterTags }, thunkApi) => {
    if (locId < 1) return [];

    const filterValues = filterTags.map((c) => c.id);
    const uri = `${process.env.REACT_APP_API_URI}/posts/atLocation/${locId}?limit=${offset}&filter=${filterValues}`;
    const req = await fetch(uri);

    if (req.status < 200 || req.status >= 400) {
      const error: FetchError = await req.json();
      thunkApi.rejectWithValue({ message: error.message });
    }

    const { posts }: { posts: Post[] } = await req.json();
    return posts;
  }
);

export const postPostsForLocation = createAsyncThunk<
  Post,
  PostToCreate,
  { rejectValue: FetchError }
>("posts/postPostForLocation", async (postToCreate: PostToCreate, thunkApi) => {
  const jwtToken = await fetchCognitoJWT();
  //if (!jwtToken) thunkApi.rejectWithValue({ message: "No jwt token found" });

  const uri = `${process.env.REACT_APP_API_URI}/posts/atLocation/${postToCreate.locId}?token=${jwtToken}`;
  const req = await fetch(uri, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postToCreate),
  });

  if (req.status < 200 || req.status >= 400) {
    const error: FetchError = await req.json();
    thunkApi.rejectWithValue({ message: error.message });
  }

  const { newPostId }: { newPostId: number } = await req.json();

  const newPostUri = `${process.env.REACT_APP_API_URI}/post/${newPostId}`;
  const newPostReq = await fetch(newPostUri);

  if (newPostReq.status < 200 || newPostReq.status >= 400) {
    const error: FetchError = await req.json();
    thunkApi.rejectWithValue({ message: error.message });
  }

  const { post }: { post: Post } = await newPostReq.json();
  return post;
});

export const postReplyForLocation = createAsyncThunk<
  Reply,
  ReplyToCreate,
  { rejectValue: FetchError }
>(
  "posts/postReplyAtPost",
  async (replyToCreate: ReplyToCreate, thunkApi): Promise<Reply> => {
    const jwtToken = await fetchCognitoJWT();
    //if (!jwtToken) thunkApi.rejectWithValue({ message: "No jwt token found" });

    const uri = `${process.env.REACT_APP_API_URI}/reply/atPost/${replyToCreate.postId}?token=${jwtToken}`;
    const req = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyToCreate.content }),
    });

    if (req.status < 200 || req.status >= 400) {
      const error: FetchError = await req.json();
      thunkApi.rejectWithValue({ message: error.message });
    }

    const { newReplyId }: { newReplyId: number } = await req.json();

    const newReplyUri = `${process.env.REACT_APP_API_URI}/reply/${newReplyId}`;
    const newReplyReq = await fetch(newReplyUri);

    if (newReplyReq.status < 200 || newReplyReq.status >= 400) {
      const error: FetchError = await req.json();
      thunkApi.rejectWithValue({ message: error.message });
    }

    const { reply }: { reply: Reply } = await newReplyReq.json();
    return reply;
  }
);
