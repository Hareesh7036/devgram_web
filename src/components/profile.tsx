import { useSelector } from "react-redux";
import EditProfile from "./editProfile";
import type { RootState } from "../utils/appStore";

function Profile() {
  const user = useSelector((store: RootState) => store.user);
  return <EditProfile user={user} />;
}

export default Profile;
