import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../utils/appStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { resetFeed } from "../utils/feedSlice";
import { disconnectSocket } from "../utils/socketClient";
import { clearOnlineUsers } from "../utils/onlineUsersSlice";
import { useEffect, useRef, useState } from "react";
import SearchSuggestionCard from "./searchSuggestionCard";
import type { User } from "../utils/userSlice";
import {
  clearSelectedSearchUser,
  setSelectedSearchUser,
} from "../utils/searchSelectionSlice";
import { clearConnections, setConnections } from "../utils/connectionSlice";

const SEARCH_DEBOUNCE_MS = 700;

function NavBar() {
  const user = useSelector((store: RootState) => store.user);
  const connections = useSelector((store: RootState) => store.connections.data);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const normalizedSearchText = searchText.trim();
  const hasEnoughCharacters = normalizedSearchText.length >= 2;
  const isDebouncing =
    hasEnoughCharacters && normalizedSearchText !== debouncedQuery;
  const isDropdownOpen = !!user?._id && isSearchFocused && normalizedSearchText.length > 0;

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      disconnectSocket();
      dispatch(clearOnlineUsers());
      dispatch(clearConnections());
      dispatch(removeUser());
      dispatch(resetFeed());
      dispatch(clearSelectedSearchUser());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        dispatch(setConnections(res.data.data));
      } catch (err) {
        console.log(err);
      }
    };

    if (user?._id && connections.length === 0) {
      fetchConnections();
    }
  }, [dispatch, user?._id, connections.length]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(normalizedSearchText);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [normalizedSearchText]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    const searchUsers = async () => {
      try {
        setIsSearching(true);
        setError("");
        const res = await axios.get(BASE_URL + "/user/search", {
          params: { q: debouncedQuery, limit: 20 },
          signal: controller.signal,
          withCredentials: true,
        });
        setResults(res.data.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(err);
        setResults([]);
        setError("We couldn't load search results right now.");
      } finally {
        setIsSearching(false);
      }
    };

    searchUsers();

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    if (isDropdownOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    setIsSearchFocused(false);
  }, [location.pathname]);

  const handleSelectSuggestion = async (selectedUser: User) => {
    const isExistingConnection = connections.some(
      (connection) => connection._id === selectedUser._id
    );
    let resolvedRelationStatus = isExistingConnection
      ? "accepted"
      : selectedUser.relationStatus ?? "new";
    let resolvedPendingState = isExistingConnection
      ? false
      : selectedUser.hasPendingRequest ?? false;
    let resolvedConnectedState =
      isExistingConnection || selectedUser.isConnected === true;

    if (selectedUser._id) {
      try {
        const relationRes = await axios.get(
          BASE_URL + "/user/relationship/" + selectedUser._id,
          { withCredentials: true }
        );

        resolvedRelationStatus = relationRes.data.data.relationStatus;
        resolvedPendingState = relationRes.data.data.hasPendingRequest;
        resolvedConnectedState = relationRes.data.data.isConnected;
      } catch (err) {
        console.error(err);
      }
    }

    dispatch(
      setSelectedSearchUser({
        ...selectedUser,
        relationStatus: resolvedRelationStatus,
        hasPendingRequest: resolvedPendingState,
        isConnected: resolvedConnectedState,
      })
    );
    setSearchText("");
    setDebouncedQuery("");
    setResults([]);
    setIsSearchFocused(false);
    navigate("/");
  };

  return (
    <div className="navbar bg-base-300 shadow-sm sticky top-0 z-[500] px-4">
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
        <div className="hidden flex-1 justify-center px-4 lg:flex">
          <div className="relative z-[550] w-full max-w-2xl" ref={searchContainerRef}>
            <label className="input input-bordered flex w-full items-center gap-3 bg-base-100">
              <i className="fas fa-search opacity-60"></i>
              <input
                type="text"
                className="grow"
                placeholder="Search by name or skill"
                value={searchText}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </label>

            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+0.75rem)] z-[600] w-full overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-2xl">
                <div className="max-h-[24rem] overflow-y-auto overscroll-contain p-3">
                  <div className="flex flex-col gap-3">
                    {!hasEnoughCharacters ? (
                      <div className="rounded-2xl border border-dashed border-base-300 px-4 py-5 text-sm opacity-70">
                        Start typing at least 2 characters to see suggestions.
                      </div>
                    ) : isDebouncing ? (
                      <div className="rounded-2xl border border-base-300 px-4 py-5 text-sm opacity-70">
                        Preparing search...
                      </div>
                    ) : isSearching ? (
                      <div className="rounded-2xl border border-base-300 px-4 py-5 text-sm">
                        Searching developers...
                      </div>
                    ) : error ? (
                      <div className="rounded-2xl border border-error/40 bg-error/10 px-4 py-5 text-sm text-error">
                        {error}
                      </div>
                    ) : results.length === 0 ? (
                      <div className="rounded-2xl border border-base-300 px-4 py-5 text-sm opacity-70">
                        No matching developers found.
                      </div>
                    ) : (
                      results.map((searchedUser) => (
                        <SearchSuggestionCard
                          key={searchedUser._id}
                          user={searchedUser}
                          onSelect={handleSelectSuggestion}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!!user && (
        <div className="flex flex-1 justify-end items-center gap-2">
          {user.firstName && (
            <p className="hidden capitalize text-[14px] md:block md:text-[16px]">
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
