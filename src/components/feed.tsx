import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../utils/appStore";
import { setFeed, type FeedUser } from "../utils/feedSlice";
import UserCard from "./userCard";
import UsageSection from "./usage-section";
import type { User } from "../utils/userSlice";
import { clearSelectedSearchUser } from "../utils/searchSelectionSlice";

function Feed() {
  const feed = useSelector((store: RootState) => store.feed);
  const selectedSearchUser = useSelector(
    (store: RootState) => store.searchSelection.selectedUser
  );
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed.data.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(setFeed(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const displayedUser: User | FeedUser | null =
    selectedSearchUser ?? feed.data[0] ?? null;

  const handleActionComplete = () => {
    if (selectedSearchUser) {
      dispatch(clearSelectedSearchUser());
    }
  };

  return (
    <div className="flex flex-col items-center isolate">
      <div className="relative z-0 flex justify-center p-4 md:p-8 w-full max-w-4xl">
        {!displayedUser ? (
          <div className="card bg-base-200 border border-base-300 w-full animate-fadeIn shadow-inner">
            <div className="card-body items-center text-center py-10">
              <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
                <i className="fas fa-users-slash text-2xl opacity-50"></i>
              </div>
              <h2 className="text-2xl font-bold">You've reached the end!</h2>
              <p className="opacity-70 max-w-xs">
                We've shown you all available developers for now. Check back later for new connections!
              </p>
            </div>
          </div>
        ) : (
          <div
            key={
              displayedUser._id ?? `${displayedUser.firstName}-${displayedUser.lastName}`
            }
            className="transform transition-all duration-1000 ease-out hover:scale-105"
            style={{
              transform: "translateY(0px) rotateX(0deg)",
              animation: "cardFlipUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            }}
          >
            <UserCard user={displayedUser} onRequestSuccess={handleActionComplete} />
          </div>
        )}
      </div>

      <div className="w-full border-t border-base-300 mt-4">
        <UsageSection />
      </div>
    </div>
  );
}

export default Feed;
