import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConnections } from "../utils/connectionSlice";
import type { RootState } from "../utils/appStore";
import { Link } from "react-router-dom";

function Connections() {
  const connections = useSelector((store: RootState) => store.connections);
  const onlineUsers = useSelector((store: RootState) => store.onlineUsers);

  const dispatch = useDispatch();
  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(setConnections(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (connections.data.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-2xl font-semibold">No Connections</h2>
      </div>
    );
  }

  function isUserOnline(userId: string) {
    return onlineUsers.data.includes(userId);
  }
  return (
    <div>
      {connections.data.map((connection) => {
        return (
          <div
            key={connection._id}
            className="card card-side bg-base-300 shadow-sm w-9/10 md:w-1/2 mx-auto my-5 rounded-2xl flex flex-col md:flex-row"
          >
            <figure className="p-4 md:pl-[30px] py-[30px]">
              <img
                src={connection.photoUrl}
                alt="connection image"
                className="w-48 h-48 rounded-2xl"
              />
            </figure>
            <div className="card-body flex-1">
              <h2 className="card-title capitalize flex items-center justify-between">
                {connection.firstName} {connection.lastName}{" "}
                {
                  <div className="flex items-center gap-5 bg-gray-800 px-2 py-1 rounded-2xl text-[14px] md:text-[16px]">
                    <span>
                      {isUserOnline(connection._id) ? "Online" : "Offline"}
                    </span>
                    {
                      <div
                        className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${
                          isUserOnline(connection._id)
                            ? "bg-green-500 animate-ping"
                            : "bg-gray-400"
                        }`}
                      />
                    }
                  </div>
                }
              </h2>
              {connection.age && (
                <p className="capitalize">
                  Age: {connection.age},{" "}
                  {connection.gender && <span>{connection.gender}</span>}
                </p>
              )}
              {connection.about && (
                <p className="capitalize">{connection.about}</p>
              )}
              <div className="card-actions justify-end">
                <Link to={`/chat/${connection._id}`}>
                  <button className="btn btn-primary">Chat</button>
                </Link>
                <button className="btn btn-warning">Remove</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Connections;
