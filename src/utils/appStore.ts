import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";
import onlineUsersReducer from "./onlineUsersSlice";
import searchSelectionReducer from "./searchSelectionSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
    onlineUsers: onlineUsersReducer,
    searchSelection: searchSelectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
