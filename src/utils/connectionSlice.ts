import { createSlice } from "@reduxjs/toolkit";

export interface Connection {
  _id: string;
  firstName: string;
  lastName: string;
  age?: number;
  skills?: string[];
  photoUrl?: string;
  about?: string;
  gender?: string;
}

export interface ConnectionState {
  data: Connection[];
}

const initialState: ConnectionState = {
  data: [],
};

const connectionSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    setConnections: (state, action) => {
      state.data = action.payload;
    },
    clearConnections: (state) => {
      state.data = [];
    },
  },
});

export const { setConnections, clearConnections } = connectionSlice.actions;
export default connectionSlice.reducer;
