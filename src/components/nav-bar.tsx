import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../utils/appStore";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { resetFeed } from "../utils/feedSlice";
import { disconnectSocket } from "../utils/socketClient";
import { clearOnlineUsers } from "../utils/onlineUsersSlice";

function NavBar() {
  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      disconnectSocket();
      dispatch(clearOnlineUsers());
      dispatch(removeUser());
      dispatch(resetFeed());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="navbar bg-base-300 shadow-sm sticky top-0 z-10 px-4">
      <div className="flex-1 flex justify-start">
        <Link
          to="/"
          className="btn btn-ghost hover:bg-transparent flex items-center gap-2 group p-0 px-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-content shadow-lg transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
            <i className="fas fa-terminal text-lg"></i>
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter flex items-center transition-all duration-300">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DEV
            </span>
            <span className="text-base-content opacity-90">GRAM</span>
          </span>
        </Link>
      </div>
      {!!user && (
        <div className="flex gap-2 items-center">
          {user.firstName && (
            <p className="capitalize text-[14px] md:text-[16px]">
              Welcome {user.firstName}!
            </p>
          )}
          <div className="dropdown dropdown-end mx-2 md:mx-4">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={
                    user.photoUrl && user.photoUrl.length
                      ? user.photoUrl
                      : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={"/"} className="justify-between">
                  Home
                </Link>
              </li>
              <li>
                <Link to={"/profile"} className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to={"/connections"} className="justify-between">
                  Connections
                </Link>
              </li>
              <li>
                <Link to={"/requests"} className="justify-between">
                  Requests
                </Link>
              </li>
              <li>
                <Link to={"/premium"} className="justify-between">
                  Premium
                </Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
