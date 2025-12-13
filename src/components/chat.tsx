import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import type { RootState } from "../utils/appStore";
import { getSocket } from "../utils/socketClient";
import type { User } from "../utils/userSlice";

type MessageType = {
  firstName: string | null;
  lastName: string | null;
  text: string | null;
};

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState<User>();
  const user = useSelector((store: RootState) => store.user);
  const userId = user?._id;
  const onlineUsers = useSelector((store: RootState) => store.onlineUsers);

  const socket = getSocket();

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map(
      (msg: {
        senderId: { firstName: string; lastName: string };
        text: string;
      }) => {
        const { senderId, text } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
        };
      }
    );
    setMessages(chatMessages);
  };

  const fetchTargetUser = async () => {
    const targetUser = await axios.get(BASE_URL + "/user/" + targetUserId, {
      withCredentials: true,
    });
    if (targetUser) {
      setTargetUser(targetUser.data.data);
    }
  };

  useEffect(() => {
    fetchChatMessages();
    fetchTargetUser();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    // As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket?.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket?.on(
      "messageReceived",
      ({ firstName, lastName, text }: MessageType) => {
        console.log("Message received:", { firstName, lastName, text });
        setMessages((messages) => [...messages, { firstName, lastName, text }]);
      }
    );
    socket?.on("errorMessage", ({ code, message }) => {
      console.error(code, message);
    });
  }, [userId, targetUserId, socket]);

  const sendMessage = () => {
    socket?.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  function isUserOnline(userId: string) {
    return onlineUsers.data.includes(userId);
  }

  if (!targetUserId) return null;

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600 flex justify-between capitalize">
        {targetUser
          ? targetUser?.firstName + " " + targetUser?.lastName
          : "Chat"}
        <div className="flex items-center gap-5 bg-gray-800 px-2 py-1 rounded-2xl">
          <span>{isUserOnline(targetUserId) ? "Online" : "Offline"}</span>
          {
            <div
              className={`w-3 h-3 rounded-full ${
                isUserOnline(targetUserId)
                  ? "bg-green-500 animate-ping"
                  : "bg-gray-400"
              }`}
            />
          }
        </div>
      </h1>
      <div className="flex-1 overflow-scroll p-5">
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={
                "chat " +
                (user.firstName === msg.firstName ? "chat-end" : "chat-start")
              }
            >
              <div className="chat-header">
                {`${msg.firstName}  ${msg.lastName}`}
                <time className="text-xs opacity-50"> 2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-500 text-white rounded p-2"
        ></input>
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;
