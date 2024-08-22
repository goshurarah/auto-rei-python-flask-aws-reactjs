// modal/SIdeDrawer.jsx
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import { Link, useLocation, useNavigate } from "react-router-dom";
import dashboard from "../../assets/sidenav/dashboard.png";
import users from "../../assets/sidenav/users.png";
import help from "../../assets/sidenav/help.png";
import logout from "../../assets/sidenav/logout.png";
import { MdSpaceDashboard } from "react-icons/md";
import { MdContactMail } from "react-icons/md";

import { CgProfile } from "react-icons/cg";
import { TbHelpCircleFilled } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import main_logo from "../../assets/sidenav/AutoREI-FullLogoo.png"

export default function SideDrawer({ open, toggleDrawer }) {
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
  const DrawerList = (
    <Box sx={{ width: 320 }} role="presentation" onClick={toggleDrawer(false)}>
      <div className="sideDrawer-main-container">
      <Link to="/dashboard" className="text-underline">
         
          
         <p className="mainlogo_div"><img src={main_logo} className="main_logo"/></p>
       
     </Link>
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
              <MdContactMail  className="sidenav-icon-img" />
            </span>
            <p className="sidenav-list-text">Auto Offer Send Settings</p>
          </div>
        </Link>
        <Link to="/" className="text-underline">
          <div className="sidenav-list">
            <span>
              <TbHelpCircleFilled className="sidenav-icon-img" />
            </span>
            <p className="sidenav-list-text">Help</p>
          </div>
        </Link>
        <Link to="/signin" className="text-underline">
          <div className="sidenav-list logout-btn" onClick={handleLogout}>
            <span>
              <MdLogout className="sidenav-icon-img" />
            </span>
            <p className="sidenav-list-text">Log Out</p>
          </div>
        </Link>
      </div>
    </Box>
  );

  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <Paper sx={{ backgroundColor: "#F2F3F8", height: "100%" }}>
        {DrawerList}
      </Paper>
    </Drawer>
  );
}
