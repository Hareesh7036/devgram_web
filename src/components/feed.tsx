import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../utils/appStore";
import { setFeed } from "../utils/feedSlice";
import UserCard from "./userCard";

function Feed() {
  const feed = useSelector((store: RootState) => store.feed);
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

  return (
    <div className="flex justify-center p-6">
      {!!feed.data.length && <UserCard user={feed.data[0]} />}
    </div>
  );
}

export default Feed;
