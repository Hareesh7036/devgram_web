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
    removeUserFromFeed: (state, action) => {
      const newFeed = state.data.filter((user) => user._id !== action.payload);
      state.data = newFeed;
    },
  },
});

export const { setFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
