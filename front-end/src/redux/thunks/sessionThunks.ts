import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, FetchError } from "../../types/sessionTypes";
import { Auth } from "aws-amplify";
import { fetchCognitoJWT } from "../../auth/CognitoUtils";

export const fetchSession = createAsyncThunk<
  User | null,
  null,
  { rejectValue: FetchError }
>("session/fetchSession", async (_: null, thunkApi) => {
  const jwtToken: string | null = await fetchCognitoJWT();

  if (!jwtToken) return null;

  const uri = `${process.env.REACT_APP_API_URI}/user/session?token=${jwtToken}`;
  const req = await fetch(uri, {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
  });

  if (req.status < 200 || req.status >= 400) {
    const error: FetchError = await req.json();
    thunkApi.rejectWithValue({ message: error.message });
  }

  const { user }: { user: User } = await req.json();
  return user;
});

export const logout = createAsyncThunk<void, null, { rejectValue: void }>(
  "session/logout",
  async (_: null, thunkApi) => {
    try {
      await Auth.signOut();
    } catch (e) {
      thunkApi.rejectWithValue();
    }
  }
);
