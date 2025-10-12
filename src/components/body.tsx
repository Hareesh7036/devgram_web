import { Outlet } from "react-router-dom";
import NavBar from "./nav-bar";
import Footer from "./footer";

function Body() {
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Body;
