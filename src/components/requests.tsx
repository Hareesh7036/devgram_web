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
  const handleReviewRequest =
    (action: string, requestId: string) => async () => {
      try {
        await axios.post(
          BASE_URL + "/request/review/" + action + "/" + requestId,
          {},
          {
            withCredentials: true,
          }
        );
        getRequests();
      } catch (err) {
        console.log(err);
      }
    };
  useEffect(() => {
    getRequests();
  }, []);

  if (requests.data.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-2xl font-semibold">No Requests</h2>
      </div>
    );
  }

  return (
    <div>
      {requests.data.map((request) => {
        const user = request.fromUserId;
        return (
          <div className="card card-side bg-base-300 shadow-sm w-1/2 mx-auto my-5 rounded-2xl flex">
            <figure className="pl-[30px] py-[30px]">
              <img
                src={user.photoUrl}
                alt="connection image"
                className="w-48 h-48 rounded-2xl"
              />
            </figure>
            <div className="card-body flex-1">
              <h2 className="card-title capitalize">
                {user.firstName} {user.lastName}
              </h2>
              {user.age && (
                <p className="capitalize">
                  Age: {user.age}, {user.gender && <span>{user.gender}</span>}
                </p>
              )}
              {user.about && <p className="capitalize">{user.about}</p>}
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={handleReviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleReviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Requests;
