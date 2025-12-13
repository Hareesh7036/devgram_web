import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";
import onlineUsersReducer from "./onlineUsersSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
    onlineUsers: onlineUsersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
