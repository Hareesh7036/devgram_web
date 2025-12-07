import axios from "axios";
import type { User } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

type Props = {
  user: User;
  isProfileOverview?: boolean;
};

function UserCard({ user, isProfileOverview }: Props) {
  const dispatch = useDispatch();
  const handleSendRequest = async (status: string, userId: string) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="card bg-base-300 w-96 shadow-sm transform transition-all duration-1000 ease-out  will-change-transform">
      <figure className="px-10 pt-10">
        <img
          src={
            user?.photoUrl ??
            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
          }
          alt="User Photo"
          className="rounded-xl"
          width={400}
          height={400}
        />
      </figure>
      <div className="card-body flex gap-4 opacity-100 transition-all duration-800 ease-out">
        <div className="flex justify-center items-center text-center">
          <h2 className="card-title capitalize translate-y-0 transition-all duration-700 ease-out">
            {user.firstName} {user.lastName}
          </h2>
        </div>
        <div className="flex gap-4 flex-col">
          {user.about && <p className="capitalize">{user.about}</p>}
          {user.age && (
            <p className="capitalize">
              {user.age} years
              {user.gender && <span>, {user.gender}</span>}
            </p>
          )}
          {user.skills && user.skills.length > 0 && (
            <div className="badge-group flex flex-wrap gap-2 animate-fadeIn">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-soft capitalize animate-pulse"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
        {!isProfileOverview && !!user._id && (
          <div className=" flex items-center text-center">
            <div className="flex card-actions items-center transform transition-all duration-300 hover:translate-y-[-2px]">
              <button
                className="btn btn-primary transition-all duration-200 hover:scale-105"
                onClick={() => {
                  if (!user._id) return;
                  handleSendRequest("ignored", user._id);
                }}
              >
                Ignore
              </button>
              <button
                className="btn btn-secondary transition-all duration-200 hover:scale-105"
                onClick={() => {
                  if (!user._id) return;
                  handleSendRequest("interested", user._id);
                }}
              >
                Interested
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCard;
