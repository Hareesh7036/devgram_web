import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./nav-bar";
import Footer from "./footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import type { RootState } from "../utils/appStore";

function Body() {
  const user = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (axios.isAxiosError(err) && err.status === 401) {
        navigate("/login");
      }
      console.log(err);
    }
  };
  useEffect(() => {
    if (!user._id) {
      fetchUser();
    }
  }, []);
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Body;
