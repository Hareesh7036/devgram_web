import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: {
    data: [] as string[],
  },
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.data = action.payload;
    },
    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.data.includes(action.payload)) {
        state.data.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((id) => id !== action.payload);
    },
    clearOnlineUsers: (state) => {
      state.data = [];
    },
  },
});

export const {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  clearOnlineUsers,
} = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
