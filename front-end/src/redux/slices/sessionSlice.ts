import {
  createSlice
} from '@reduxjs/toolkit';
import { Session, User } from '../../types/sessionTypes';
import { fetchSession, logout} from "../thunks/sessionThunks";

type Action<T> = { type: string; payload: T; };

const initialState: Session = {
  user: null,
  pending: false
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch session cases
    builder.addCase(
      fetchSession.fulfilled,
      (state: Session, action: Action<User | null>) => {
        state.user = action.payload;
        state.pending = false;
      }
    );
    builder.addCase(
      fetchSession.pending,
      (state: Session) => {
        state.pending = true;
      }
    );
    builder.addCase(
      fetchSession.rejected,
      (state: Session) => {
        state.pending = false;
        state.user = null;
      }
    );
    // logout cases
    builder.addCase(
      logout.fulfilled,
      (state: Session) => {
        state.user = null;
        state.pending = false;
      }
    );
    builder.addCase(
      logout.pending,
      (state: Session) => {
        state.pending = true;
      }
    );
    builder.addCase(
      logout.rejected,
      (state: Session) => {
        state.pending = false;
        alert("Failed to logout");
      }
    );
  }
});

export const {} = sessionSlice.actions;

export default sessionSlice.reducer;
  