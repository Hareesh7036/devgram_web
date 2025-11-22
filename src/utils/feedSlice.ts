import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FeedUser {
  firstName: string;
  lastName: string;
  emailId: string;
  _id: string;
  age?: number;
  gender?: string;
  about?: string;
  skills?: string[];
  photoUrl?: string;
}

export interface FeedState {
  data: FeedUser[];
}

const initialState: FeedState = {
  data: [],
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeed: (state, action: PayloadAction<FeedUser[]>) => {
      state.data = action.payload;
    },
    clearFeed: (state) => {
      state.data = [];
    },
  },
});

export const { setFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
