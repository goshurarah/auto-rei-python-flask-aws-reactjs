import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css";
const SignUp = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.firstName === "") {
      toast.error("First Name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          confirmPassword: "",
        });
        setSuccess(true);
        setError(null);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/signin");
        }, 4000);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during signup");
      }
    } finally {
      setLoading(false);
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
          <span className="welcome">Welcome to</span> <br />
          <span className="real_estate">
            Real-estate Management System
          </span>{" "}
          <br />
          <span className="login_account">
            Enter your information below to continue.
          </span>
        </Typography>
        <span className="email_input">Email:</span>
        <TextField
          name="email"
          type="email"
          margin="normal"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
        />
        <Box display="flex">
          <Box flex="1" pr={1}>
            <span className="email_input">First Name:</span>
            <TextField
              name="firstName"
              type="text"
              margin="normal"
              fullWidth
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </Box>
          <Box flex="1" pl={1}>
            <span className="email_input">Last Name:</span>
            <TextField
              name="lastName"
              type="text"
              margin="normal"
              fullWidth
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </Box>
        </Box>
        <Box display="flex">
          <Box flex="1" pr={1}>
            <span className="email_input">Password:</span>
            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
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
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              fullWidth
              required
              value={formData.confirmPassword}
              onChange={handleChange}
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
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Creating..." : "Create Account"}
        </Button>
        <Link to="/signin">
          <p>Back to Login</p>
        </Link>
      </Box>
      <ToastContainer />
    </Box>
  );
};
export default SignUp;
