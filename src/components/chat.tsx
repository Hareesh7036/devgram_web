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
  messageId: string | null;
  chatId: string | null;
};

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState<User>();
  const [seenMsgId, setSeenMsgId] = useState<string>("");
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const [pendingDelivered, setPendingDelivered] = useState<
    { senderId: string; messageId: string; chatId: string }[]
  >([]);
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
        senderId: { firstName: string; lastName: string; _id: string };
        text: string;
        seenBy: string[];
        _id: string;
      }) => {
        const { senderId, text, seenBy } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          senderId: senderId._id,
          text,
          seenBy,
          messageId: msg._id,
        };
      }
    );
    setMessages(chatMessages);
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      const msg = chatMessages[i];
      console.log("Checking message for seen status:", msg);
      console.log(userId);
      if (msg.senderId === userId && msg?.seenBy?.includes(targetUserId)) {
        console.log("Setting seenMsgId to", msg.messageId);
        setSeenMsgId(msg.messageId);
        break;
      }
    }
  };

  const fetchTargetUser = async () => {
    const targetUser = await axios.get(BASE_URL + "/user/" + targetUserId, {
      withCredentials: true,
    });
    if (targetUser) {
      setTargetUser(targetUser.data.data);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;

    const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    fetchChatMessages();
    fetchTargetUser();
  }, [userId]);

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
      ({ firstName, lastName, text, messageId, chatId, senderId }: any) => {
        console.log("Message received:", {
          firstName,
          lastName,
          text,
          messageId,
          chatId,
          senderId,
        });
        setMessages((messages) => [
          ...messages,
          { firstName, lastName, text, messageId, chatId },
        ]);
        console.log("userId", userId, "senderId", senderId);
        if (senderId !== userId) {
          console.log("Adding to pendingDelivered", {
            messageId,
            chatId,
            senderId,
          });
          setPendingDelivered((prev) => [
            ...prev,
            { senderId, messageId, chatId },
          ]);
        }
      }
    );
    socket?.on("messageSeen", ({ messageId, seenBy }) => {
      console.log("seenmsgId", messageId, seenBy);
      setSeenMsgId(messageId);
    });
    socket?.on("errorMessage", ({ code, message }) => {
      console.error(code, message);
    });
  }, [userId, targetUserId, socket]);

  useEffect(() => {
    if (!socket || !userId) return;
    if (!isAtBottom) return;
    if (pendingDelivered.length === 0) return;

    // Fire delivered for all pending messages when user reaches bottom
    console.log("Emitting messageDelivered for pending messages");

    pendingDelivered.forEach(({ senderId, messageId, chatId }) => {
      // if (senderId !== userId) {
      socket.emit("messageDelivered", {
        targetUserId: senderId,
        currentUserId: userId,
        messageId,
        chatId,
      });
      // }
    });

    // Clear pending list after emitting
    setPendingDelivered([]);
  }, [isAtBottom, pendingDelivered, socket, userId]);

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

  console.log("messages", messages);
  console.log("pendingDelivered", pendingDelivered);
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
      <div className="flex-1 overflow-scroll p-5" onScroll={handleScroll}>
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
              {msg.messageId === seenMsgId && (
                <div className="chat-footer opacity-50">Seen</div>
              )}
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
