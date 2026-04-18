import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./userSlice";

type SearchSelectionState = {
  selectedUser: User | null;
};

const initialState: SearchSelectionState = {
  selectedUser: null,
};

const searchSelectionSlice = createSlice({
  name: "searchSelection",
  initialState,
  reducers: {
    setSelectedSearchUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
    clearSelectedSearchUser: (state) => {
      state.selectedUser = null;
    },
  },
});

export const { setSelectedSearchUser, clearSelectedSearchUser } =
  searchSelectionSlice.actions;
export default searchSelectionSlice.reducer;
