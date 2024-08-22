import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SetNewPassword.css";
const SetNewPassword = () => {
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate();
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`/api/reset_password/${token}`, {
        password,
      });
      setSuccess(true);
      setError(null);
      setPassword("");
      setConfirmPassword("");
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/signin");
      }, 5000);
    } catch (error) {
      setError("Error resetting password");
      setSuccess(false);
      toast.error("Error resetting password");
    }
  };
  return (
    <Box className="main_box">
      <Box
        component="form"
        p={4}
        borderRadius={1}
        boxShadow={3}
        bgcolor="white"
        display="flex"
        flexDirection="column"
        maxWidth="400px"
        width="100%"
        onSubmit={handleSubmit}
      >
        <Typography variant="h5" gutterBottom className="content_main">
          <span className="welcome">Registration</span> <br />
          <span className="real_estate">Set New Password</span> <br />
          <span className="login_account">Kindly Reset your password</span>
        </Typography>
        <Box display="flex" className="mt-3">
          <Box flex="1" pr={1}>
            <span className="email_input">Password:</span>
            <TextField
              type={showPassword ? "text" : "password"}
              margin="normal"
              fullWidth
              required
              value={password}
              onChange={handlePasswordChange}
              error={Boolean(error)}
              helperText={error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box flex="1" pl={1}>
            <span className="email_input">Confirm Password:</span>
            <TextField
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              fullWidth
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        <Button
          className="mt-3 button_create"
          variant="contained"
          fullWidth
          type="submit"
        >
          Change Password
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
};
export default SetNewPassword;
