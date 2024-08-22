import React, { useState } from "react";
import "./sidenav.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import dashboard from "../../assets/sidenav/dashboard.png";
// import users from "../../assets/sidenav/users.png";
// import help from "../../assets/sidenav/help.png";
// import logout from "../../assets/sidenav/logout.png";
import main_logo from "../../assets/sidenav/AutoREI-FullLogoo.png";
import logout_line from "../../assets/sidenav/logout_line.png";
import { MdContactMail } from "react-icons/md";

import { MdSpaceDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { TbHelpCircleFilled } from "react-icons/tb";
import { MdLogout } from "react-icons/md";

function Sidenav() {
  const [loggedOut, setLoggedOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setLoggedOut(true);
    navigate("/signin");
  };

  if (loggedOut) {
    window.location.reload();
  }

  return (
    <>
      <div className="sidenav-main-container">
        <div>
          <Link to="/dashboard" className="text-underline">
            <p className="mainlogo_div">
              <img src={main_logo} className="main_logo" />
            </p>
          </Link>
        </div>
        <Link to="/dashboard" className="text-underline">
          <div
            className={`sidenav-list ${
              location.pathname === "/dashboard" ? "default-bg" : ""
            }`}
          >
            <span>
              <MdSpaceDashboard className="sidenav-icon-img" />
            </span>
            <p className="sidenav-list-text">Dashboard</p>
          </div>
        </Link>
        <Link to="/user-profile" className="text-underline">
          <div
            className={`sidenav-list ${
              location.pathname === "/user-profile" ? "default-bg" : ""
            }`}
          >
            <span>
              <CgProfile className="sidenav-icon-img" />
            </span>
            <p className="sidenav-list-text">User Profile</p>
          </div>
        </Link>
        <Link to="/email-setting" className="text-underline">
          <div
            className={`sidenav-list ${
              location.pathname === "/email-setting" ? "default-bg" : ""
            }`}
          >
            <span>
              <MdContactMail className="sidenav-icon-img" />
            </span>
            <p className="sidenav-list-text">Auto Offer Send Settings</p>
          </div>
        </Link>
        <Link to="/dashboard" className="text-underline">
          <div className="sidenav-list">
            <span>
              <TbHelpCircleFilled className="sidenav-icon-img" />
            </span>
            <p className="sidenav-list-text">Help</p>
          </div>
        </Link>
        <img
          className="logout_line logout-btn-line"
          src={logout_line}
          alt="logout_line"
        />
        <Link to="/signin" className="text-underline">
          <div className="sidenav-list logout-btn" onClick={handleLogout}>
            <span>
              <MdLogout className="sidenav-icon-img" />
            </span>
            <p className="sidenav-list-text">Log Out</p>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Sidenav;
