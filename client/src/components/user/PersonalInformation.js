import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as React from "react";
import { useState } from "react";
import * as Yup from "yup";
import { checkIfEmailExists } from "../restaurant/FrontendInputValidation";

const API_BASE_URL = "http://localhost:3001";

export default function PersonalInformation({
  userAccount,
  edit,
  userAccountErrors,
  changePassword,
  setSavedUserAccount,
  savedUserAccount,
  setEdit,
  submitting,
  setSubmitting,
  setUserAccount,
  setUserAccountErrors,
  setChangePassword,
  fetchWithToken,
  passwordData,
  setPasswordData,
  passwordDataErrors,
  setPasswordDataErrors,
}) {
  const handleTextFieldChange = (field) => (event) => {
    setUserAccount({
      ...userAccount,
      [field]: event.target.value,
    });
  };

  const [saving, setSaving] = useState(false);

  const handleTextFieldChangePassword = (field) => (event) => {
    setPasswordData({
      ...passwordData,
      [field]: event.target.value,
    });
    setPasswordDataErrors({
      ...passwordDataErrors,
      [field]: "",
    });
  };

  const handleEdit = async () => {
    await setSavedUserAccount(userAccount);
    setEdit(true);
  };

  const validationSchemaInformation = Yup.object().shape({
    lastName: Yup.string().required("Lastname is required"),
    firstName: Yup.string().required("Firstname is required"),
  });

  const validationSchemaEmail = Yup.object().shape({
    email: Yup.string()
      .email("Please use a valid email address.")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please use a valid email address."
      )
      .required("Email is required")
      .test("unique-email", "Email already exists", async function (value) {
        const emailExists = await checkIfEmailExists(value); // Function to query the database
        return !emailExists; // Return true if email does not exist
      }),
  });

  const validationSchemaPassword = Yup.object().shape({
    newPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password needs to have at least 8 characters"),
    repeatPassword: Yup.string()
      .required("Repeat password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords do not match"),
  });

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      await validationSchemaInformation.validate(
        {
          lastName: userAccount.lastname,
          firstName: userAccount.firstname,
        },
        {
          abortEarly: false,
        }
      );

      if (userAccount.email !== savedUserAccount.email) {
        await validationSchemaEmail.validate(
          { email: userAccount.email },
          { abortEarly: false }
        );
      }

      await fetchWithToken(`${API_BASE_URL}/user/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userAccount.userId,
          lastName: userAccount.lastname,
          firstName: userAccount.firstname,
          email: userAccount.email,
        }),
      });
      await setUserAccountErrors({
        lastnameError: "",
        firstnameError: "",
        emailError: "",
      });

      setEdit(false);
    } catch (errors) {
      let updatedErrors = {};
      await errors.inner.forEach((error) => {
        if (error.message.startsWith("Lastname")) {
          updatedErrors.lastnameError = error.message;
        } else if (error.message.startsWith("Firstname")) {
          updatedErrors.firstnameError = error.message;
        } else if (
          error.message.includes("email") ||
          error.message.includes("Email")
        ) {
          updatedErrors.emailError = error.message;
        }
      });
      setUserAccountErrors(updatedErrors);
    } finally {
      setSubmitting(false);
    }
  };
  const handleCancelEdit = () => {
    setUserAccount(savedUserAccount);
    setEdit(false);
    setUserAccountErrors("");
  };

  const handleChangePasswordButton = () => {
    setChangePassword(true);
  };

  const handleCancelPasswordChange = () => {
    setChangePassword(false);
    setPasswordData({
      ...passwordData,
      repeatPassword: "",
    });
  };

  const handleSavePassword = async () => {
    setSaving(true);
    try {
      await validationSchemaPassword.validate(
        {
          newPassword: passwordData.newPassword,
          repeatPassword: passwordData.repeatPassword,
        },
        { abortEarly: false }
      );

      await fetchWithToken(`${API_BASE_URL}/user/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userAccount.userId,
          password: passwordData.newPassword,
        }),
      });
      setPasswordDataErrors({
        newPasswordError: "",
        repeatPasswordError: "",
      });
      setChangePassword(false);
    } catch (errors) {
      let updatedErrors = {};
      errors.inner.forEach((error) => {
        if (
          error.message.includes("match") ||
          error.message.includes("repeat")
        ) {
          updatedErrors.repeatPasswordError = error.message;
        } else {
          updatedErrors.newPasswordError = error.message;
        }
      });
      setPasswordDataErrors(updatedErrors);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ textAlign: "center" }}>
      <Container sx={{ display: "flex" }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ textAlign: "center", marginTop: 2 }}>
              Your Personal Information
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              required
              id="lastname"
              label={userAccount.lastname ? "" : "Lastname"}
              value={userAccount.lastname}
              onChange={handleTextFieldChange("lastname")}
              error={Boolean(userAccountErrors.lastnameError)}
              helperText={userAccountErrors.lastnameError}
              disabled={!edit}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              id="firstname"
              label={userAccount.firstname ? "" : "Firstname"}
              value={userAccount.firstname}
              onChange={handleTextFieldChange("firstname")}
              error={Boolean(userAccountErrors.firstnameError)}
              helperText={userAccountErrors.firstnameError}
              disabled={!edit}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              id="email"
              label={userAccount.email ? "" : "Email"}
              value={userAccount.email}
              onChange={handleTextFieldChange("email")}
              error={Boolean(userAccountErrors.emailError)}
              helperText={userAccountErrors.emailError}
              disabled={!edit}
            />
          </Grid>
          {changePassword ? (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="newPassword"
                  label="New password"
                  type="password"
                  value={passwordData.password}
                  onChange={handleTextFieldChangePassword("newPassword")}
                  error={Boolean(passwordDataErrors.newPasswordError)}
                  helperText={passwordDataErrors.newPasswordError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="repeatPassword"
                  label="Repeat password"
                  type="password"
                  value={passwordData.repeatPassword}
                  onChange={handleTextFieldChangePassword("repeatPassword")}
                  error={Boolean(passwordDataErrors.repeatPasswordError)}
                  helperText={passwordDataErrors.repeatPasswordError}
                />
              </Grid>
            </>
          ) : null}
          {!edit ? (
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "center",
              }}
            >
              <Button
                onClick={handleEdit}
                variant="contained"
                sx={{ marginBottom: 2 }}
                disabled={changePassword}
              >
                Edit personal information
              </Button>
            </Grid>
          ) : (
            <>
              <Grid item xs={3} sx={{ textAlign: "center" }}>
                <Button
                  onClick={handleCancelEdit}
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={3} sx={{ textAlign: "center" }}>
                <LoadingButton
                  loading={submitting}
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{ marginBottom: 2 }}
                >
                  Submit
                </LoadingButton>
              </Grid>
            </>
          )}
          {!changePassword ? (
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "center",
              }}
            >
              <Button
                onClick={handleChangePasswordButton}
                variant="contained"
                sx={{ marginBottom: 2 }}
                disabled={edit}
              >
                Change password
              </Button>
            </Grid>
          ) : (
            <>
              <Grid
                item
                xs={3}
                sx={{
                  textAlign: "center",
                }}
              >
                <Button
                  onClick={handleCancelPasswordChange}
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  textAlign: "center",
                }}
              >
                <LoadingButton
                  loading={saving}
                  onClick={handleSavePassword}
                  variant="contained"
                  sx={{ marginBottom: 2 }}
                >
                  Save password
                </LoadingButton>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Paper>
  );
}
