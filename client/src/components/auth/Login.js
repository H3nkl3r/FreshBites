import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { AuthContext } from "../../utils/AuthProvider";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login({ open, handleClose, openRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { handleLogin, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated()) {
      closeWindow();
    }
  }, [isAuthenticated, handleClose]);

  const handleLoginButton = async () => {
    setErrors((prevErrors) => ({ ...prevErrors, general: null }));

    try {
      await validationSchema.validate(
        { email, password },
        { abortEarly: false }
      );

      await handleLogin(email, password);
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  const closeWindow = () => {
    setEmail("");
    setPassword("");
    setErrors({});
    handleClose();
  };

  return (
    <Dialog open={open} onClose={closeWindow}>
      <DialogTitle>
        <Typography variant={"h5"}>Sign in to FreshBites</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={closeWindow}>
          Cancel
        </Button>
        <Button variant="text" onClick={handleLoginButton}>
          Login
        </Button>
        <Button variant="text" onClick={openRegister}>
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  );
}
