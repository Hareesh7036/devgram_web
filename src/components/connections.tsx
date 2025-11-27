import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConnections } from "../utils/connectionSlice";
import type { RootState } from "../utils/appStore";

function Connections() {
  const connections = useSelector((store: RootState) => store.connections);
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

  console.log(connections);
  return (
    <div>
      {connections.data.map((connection) => {
        return (
          <div className="card card-side bg-base-300 shadow-sm w-1/2 mx-auto my-5 rounded-2xl">
            <figure>
              <img
                src={connection.photoUrl}
                alt="connection image"
                className="w-48 h-48 rounded-2xl"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {connection.firstName} {connection.lastName}
              </h2>
              {connection.age && (
                <p>
                  Age: {connection.age},{" "}
                  {connection.gender && <span>{connection.gender}</span>}
                </p>
              )}
              {connection.about && <p>{connection.about}</p>}
              <div className="card-actions justify-end">
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
