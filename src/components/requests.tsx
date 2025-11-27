import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../utils/appStore";
import { setRequests } from "../utils/requestSlice";

function Requests() {
  const requests = useSelector((store: RootState) => store.requests);
  const dispatch = useDispatch();
  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recieved", {
        withCredentials: true,
      });
      dispatch(setRequests(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getRequests();
  }, []);

  return (
    <div>
      {requests.data.map((request) => {
        const user = request.fromUserId;
        return (
          <div className="card card-side bg-base-300 shadow-sm w-1/2 mx-auto my-5 rounded-2xl">
            <figure>
              <img
                src={user.photoUrl}
                alt="connection image"
                className="w-48 h-48 rounded-2xl"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {user.firstName} {user.lastName}
              </h2>
              {user.age && (
                <p>
                  Age: {user.age}, {user.gender && <span>{user.gender}</span>}
                </p>
              )}
              {user.about && <p>{user.about}</p>}
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Reject</button>
                <button className="btn btn-secondary">Accept</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Requests;
