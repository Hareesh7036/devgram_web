import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Body from "./components/body";
import Login from "./components/login";
import { Provider } from "react-redux";
import store from "./utils/appStore";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="home" element={<div>Home</div>} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<div>Sign Up</div>} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
