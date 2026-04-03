import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Bet from "./pages/Bet";
import Welcome from "./pages/Welcome";
import History from "./pages/History";
import PrivateRoute from "./components/common/PrivateRoute";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route index path="/" element={<Home />} />
            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Dashboard Layout */}
            <Route element={<AppLayout />}>
              <Route
                path="/bet"
                element={
                  <PrivateRoute>
                    <Bet />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfiles />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/welcome"
                element={
                  <PrivateRoute>
                    <Welcome />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <History />{" "}
                  </PrivateRoute>
                }
              />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}
