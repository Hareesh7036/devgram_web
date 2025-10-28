import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  firstname: string;
  lastname: string;
  email: string;
  _id: string;
  age?: number;
  gender?: string;
  about?: string;
  skills?: string[];
  photoUrl?: string;
}

const initialState: UserState | null = {
  firstname: "",
  lastname: "",
  email: "",
  _id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (_, action) => {
      return action.payload;
    },
    removeUser: () => {
      return {
        firstname: "",
        lastname: "",
        email: "",
        _id: "",
      };
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
