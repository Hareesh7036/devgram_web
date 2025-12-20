import { useEffect, useRef, useState } from "react";
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
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [initialPageLoaded, setInitialPageLoaded] = useState<boolean>(false);

  const user = useSelector((store: RootState) => store.user);
  const userId = user?._id;
  const onlineUsers = useSelector((store: RootState) => store.onlineUsers);

  const socket = getSocket();

  const fetchChatMessages = async () => {
    if (!targetUserId || !userId || !page || !listRef.current) return;

    const el = listRef.current;
    const prevScrollHeight = el.scrollHeight;
    const {
      data: { chat, pagination },
    } = await axios.get(
      `${BASE_URL}/chat/${targetUserId}?page=${page}&limit=10`,
      {
        withCredentials: true,
      }
    );

    const chatId = chat?._id;
    const chatMessages = chat?.messages.map(
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
    setMessages((prevMessages) => [...chatMessages, ...prevMessages]);
    setHasMore(pagination.hasMore);
    if (page === 1) {
      setInitialPageLoaded(true);

      for (let i = chatMessages.length - 1; i >= 0; i--) {
        const msg = chatMessages[i];
        if (msg.senderId === userId && msg?.seenBy?.includes(targetUserId)) {
          setSeenMsgId(msg.messageId);
          break;
        }
      }
      for (let i = chatMessages.length - 1; i >= 0; i--) {
        const msg = chatMessages[i];
        if (msg.senderId !== userId) {
          if (!msg?.seenBy?.includes(userId!)) {
            await updateMessageSeen(msg.messageId!, chatId);
            setPendingDelivered((prev) => [
              ...prev,
              { senderId: msg.senderId!, messageId: msg.messageId!, chatId },
            ]);
            break;
          } else {
            break;
          }
        }
      }
    } else {
      requestAnimationFrame(() => {
        if (!listRef.current) return;
        const newScrollHeight = listRef.current.scrollHeight;
        const diff = newScrollHeight - prevScrollHeight;
        listRef.current.scrollTop = listRef.current.scrollTop + diff;
      });
    }
  };

  const updateMessageSeen = async (messageId: string, chatId: string) => {
    try {
      await axios.post(
        `${BASE_URL}/chat/${chatId}/markSeen`,
        {
          messageId,
        },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Error updating message seen status:", err);
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
    if (scrollTop === 0 && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [userId, targetUserId, page]);

  useEffect(() => {
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

        if (senderId !== userId) {
          setPendingDelivered((prev) => [
            ...prev,
            { senderId, messageId, chatId },
          ]);
        }
      }
    );
    socket?.on("messageSeen", ({ messageId }) => {
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

    // Fire delivered for all pending messages when user is at bottom

    pendingDelivered.forEach(({ senderId, messageId, chatId }) => {
      socket.emit("messageDelivered", {
        targetUserId: senderId,
        currentUserId: userId,
        messageId,
        chatId,
      });
    });

    // Clear pending list after emitting
    setPendingDelivered([]);
  }, [isAtBottom, pendingDelivered, socket, userId]);

  useEffect(() => {
    if (!initialPageLoaded || !listRef.current || page !== 1) return;

    requestAnimationFrame(() => {
      if (!listRef.current) return;
      listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  }, [initialPageLoaded, messages.length]);

  const sendMessage = () => {
    socket?.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
    requestAnimationFrame(() => {
      if (!listRef.current) return;
      listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  };

  function isUserOnline(userId: string) {
    return onlineUsers.data.includes(userId);
  }

  if (!targetUserId) return null;

  return (
    <div className="w-9/10 md:w-3/4 mx-auto border border-gray-600 m-5 h-[80vh] flex flex-col rounded-2xl">
      <h1 className="p-5 border-b border-gray-600 flex justify-between capitalize bg-base-300 rounded-tl-2xl rounded-tr-2xl">
        {targetUser
          ? targetUser?.firstName + " " + targetUser?.lastName
          : "Chat"}
        <div className="flex items-center gap-5 bg-gray-800 px-2 py-1 rounded-2xl text-[14px] md:text-[16px]">
          <span>{isUserOnline(targetUserId) ? "Online" : "Offline"}</span>
          {
            <div
              className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${
                isUserOnline(targetUserId)
                  ? "bg-green-500 animate-ping"
                  : "bg-gray-400"
              }`}
            />
          }
        </div>
      </h1>
      <div
        ref={listRef}
        className="flex-1 overflow-scroll p-5"
        onScroll={handleScroll}
      >
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
      <div className="p-5 border-t border-gray-600 flex items-center gap-2 bg-base-300 rounded-bl-2xl rounded-br-2xl">
        <input
          name="chatText"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // optional, stops form submit / newline
              sendMessage();
            }
          }}
          className="flex-1 border border-gray-500 rounded p-2 w-full input input-secondary h-8 md:h-10"
        ></input>
        <button onClick={sendMessage} className="btn btn-secondary h-8 md:h-10">
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;
