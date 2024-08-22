import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(null);
  };
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/request_reset_password", {
        email,
      });
      setSuccess(true);
      setError(null);
      toast.success("Reset link sent successfully!");
      setEmail("");
      setTimeout(() => {
        navigate("/signin");
      }, 5000);
    } catch (error) {
      setError("Email not found or an error occurred");
      setSuccess(false);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to send reset link");
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
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>
        <TextField
          type="email"
          margin="normal"
          fullWidth
          required
          label="Email"
          value={email}
          onChange={handleEmailChange}
          error={Boolean(error)}
          helperText={error}
        />
        <Button
          variant="contained"
          className="mt-4 button_create"
          fullWidth
          type="submit"
          disabled={success || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading
            ? "Sending..."
            : success
            ? "Reset link sent"
            : "Send Reset Link"}
        </Button>
        <Link to="/signin">
          <p>Back to Login</p>
        </Link>
      </Box>
      <ToastContainer />
    </Box>
  );
};
export default ForgotPassword;
