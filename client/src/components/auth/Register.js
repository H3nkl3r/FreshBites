import React, { useContext, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { AuthContext } from "../../utils/AuthProvider";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address."),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password needs to have at least 8 characters"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  repeatPassword: yup
    .string()
    .required("Repeat password is required")
    .oneOf([yup.ref("password"), null], "Passwords do not match"),
  policy: yup
    .boolean()
    .oneOf([true], "You must accept the terms")
    .required("You must accept the terms"),
});
export default function Register({ open, handleClose, openUpgrade }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [policy, setPolicy] = useState(false);
  const [errors, setErrors] = useState({});

  const { handleRegister } = useContext(AuthContext);

  const handleRegisterButton = async () => {
    try {
      await validationSchema.validate(
        { email, password, firstName, lastName, policy, repeatPassword },
        { abortEarly: false }
      );

      handleRegister(
        email,
        password,
        firstName,
        lastName,
        undefined,
        (isSuccess, errorMsg) => {
          // isSuccess is true if registration was successful, false if there was an error
          // errorMsg contains the error message if there was an error
          if (isSuccess) {
            closeWindow(); // Close the dialog
            openUpgrade();
          } else {
            setErrors({ general: errorMsg });
          }
        }
      );
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
    }
  };

  const closeWindow = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPolicy(false);
    setErrors({});
    handleClose();
  };

  return (
    <Dialog open={open} onClose={closeWindow}>
      <DialogTitle>
        <Typography variant={"h5"}>Sign up to FreshBites</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="first"
          label="First Name"
          type="text"
          variant="standard"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          margin="dense"
          id="last"
          label="Last Name"
          type="text"
          variant="standard"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
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
        <TextField
          margin="dense"
          id="repeatPassword"
          label="Repeat Password"
          type="password"
          fullWidth
          variant="standard"
          required
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          error={!!errors.repeatPassword}
          helperText={errors.repeatPassword}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="policy"
              checked={policy}
              onChange={(e) => setPolicy(e.target.checked)}
            />
          }
          label={
            <Typography variant={"body2"}>
              I hereby agree to FreshBite's{" "}
              <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">
                terms of use.
              </a>
            </Typography>
          }
        />
        {Boolean(errors.policy) && (
          <FormHelperText error>{errors.policy}</FormHelperText>
        )}
        {errors.general && (
          <Typography style={{ color: "error" }}>{errors.general}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeWindow}>Cancel</Button>
        <Button onClick={handleRegisterButton}>Sign Up</Button>
      </DialogActions>
    </Dialog>
  );
}
