import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./layouts/dashboard/Dashboard.jsx";
import PropertyDetail from "./layouts/dashboard/pages/PropertyDetail.jsx";
import SignIn from "./layouts/auth/SignIn.jsx";
import SignUp from "./layouts/auth/SignUp.jsx";
import ForgotPassword from "./layouts/auth/ForgotPassword.jsx";
import SetNewPassword from "./layouts/auth/SetNewPassword.jsx";
import UserProfile from "./layouts/userProfile/UserProfile.jsx";
import EmailSettings from "./layouts/autooffer/EmailSettings.jsx";
import EmailTemplate from "./layouts/autooffer/EmailTemplate.jsx";

function App() {
  const token = localStorage.getItem("accessToken");
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" /> : <SignIn />}
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/new-password/:token" element={<SetNewPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard/property-detail/:id"
            element={<PropertyDetail />}
          />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/email-setting" element={<EmailSettings />} />
          <Route path="/email-template" element={<EmailTemplate />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
