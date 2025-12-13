import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOnlineUser,
  removeOnlineUser,
  setOnlineUsers,
} from "../utils/onlineUsersSlice";
import type { RootState } from "../utils/appStore";
import { getSocket } from "../utils/socketClient";

const OnlineStatusTracker = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const isLoggedIn = !!user?._id;

  useEffect(() => {
    if (!isLoggedIn) return;

    const socket = getSocket();
    // socket.onAny((event, payload) => {
    //   console.log("📩 socket event:", event, payload);
    // });

    const handleOnline = ({ userId }: { userId: string }) => {
      dispatch(addOnlineUser(userId));
    };

    const handleOffline = ({ userId }: { userId: string }) => {
      dispatch(removeOnlineUser(userId));
    };

    const handleAllOnline = ({
      onlineUsersList,
    }: {
      onlineUsersList: string[];
    }) => {
      dispatch(setOnlineUsers(onlineUsersList));
    };
    socket.on("allOnlineUsers", handleAllOnline);
    socket.emit("getAllOnlineUsers");
    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);

    return () => {
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
      socket.off("allOnlineUsers", handleAllOnline);
    };
  }, [isLoggedIn]);

  return null;
};

export default OnlineStatusTracker;
