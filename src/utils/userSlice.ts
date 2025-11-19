import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
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

const initialState: UserState | null = {
  firstName: "",
  lastName: "",
  emailId: "",
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
        firstName: "",
        lastName: "",
        emailId: "",
        _id: "",
      };
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
