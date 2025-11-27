import { createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  age?: number;
  skills?: string[];
  photoUrl?: string;
  about?: string;
  gender?: string;
}

export interface Request {
  _id: string;
  fromUserId: User;
  toUserId: string;
  status: string;
}

export interface RequestState {
  data: Request[];
}

const initialState: RequestState = {
  data: [],
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests: (state, action) => {
      state.data = action.payload;
    },
    clearRequests: (state) => {
      state.data = [];
    },
  },
});

export const { setRequests, clearRequests } = requestSlice.actions;
export default requestSlice.reducer;
