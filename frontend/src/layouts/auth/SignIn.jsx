import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignIn.css";
// import "../../Assets/background.png";
const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    // Check if the rememberMe checkbox is checked
    if (!rememberMe) {
      toast.error("Please check the 'Remember Me' box to proceed.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/signin", {
        email: formData.email,
        password: formData.password,
      });
      // console.log(response.data);
      const token = response.data.token;
      localStorage.setItem("accessToken", token);
      // Handle successful login
      if (response.data.message) {
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        // Navigate to dashboard
        navigate("/dashboard");
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      // Display error message
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred. Please try again.");
      }
      // Clear form fields
      setFormData({
        email: "",
        password: "",
      });
      setRememberMe(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box className="main_box">
      <ToastContainer />
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
          <span className="login_account">Please Login to your account.</span>
        </Typography>
        <span className="email_input">Email:</span>
        <TextField
          type="email"
          name="email"
          margin="normal"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
        />
        <span className="email_input">Password:</span>
        <TextField
          type={showPassword ? "text" : "password"}
          name="password"
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          mb={2}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                required // Make checkbox required
              />
            }
            label="Remember Me"
            className="email_input"
          />
          <Link to="/forgot-password" underline="none" color="primary">
            <span className="email_input1">Forgot Password?</span>
          </Link>
        </Box>
        <Button
          variant="contained"
          className="button_create"
          fullWidth
          type="submit"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Loging in..." : "Log In"}
        </Button>
        <Typography variant="body2" color="textSecondary" align="center" mt={2}>
          New member here?{" "}
          <Link to="/signup" underline="none" color="primary">
            Register Now
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
export default SignIn;
