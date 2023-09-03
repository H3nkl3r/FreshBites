import * as React from "react";
import {
  Checkbox,
  Container,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

export default function UserAccountStepperRestaurant({
  formData,
  setFormData,
  formError,
  setFormError,
}) {
  const handleTextFieldChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    setFormError({
      ...formError,
      [field]: "",
    });
  };

  const handleCheckboxChange = (event) => {
    setFormData({
      ...formData,
      agreedToTermsOfUse: event.target.checked,
    });
    setFormError({
      ...formError,
      agreedToTermsOfUseError: "",
    });
  };

  return (
    <Container
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Grid container spacing={2} style={{ marginTop: "2%" }}>
        <Grid item xs={12}>
          <Typography variant={"h5"}>Create your User Account here</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            id="firstname"
            label="Firstname"
            value={formData.firstname}
            onChange={handleTextFieldChange("firstname")}
            error={Boolean(formError.firstnameError)}
            helperText={formError.firstnameError}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            id="lastname"
            label="Lastname"
            value={formData.lastname}
            onChange={handleTextFieldChange("lastname")}
            error={Boolean(formError.lastnameError)}
            helperText={formError.lastnameError}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            id="email"
            label="Email"
            value={formData.email}
            onChange={handleTextFieldChange("email")}
            error={Boolean(formError.emailError)}
            helperText={formError.emailError}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleTextFieldChange("password")}
            error={Boolean(formError.passwordError)}
            helperText={formError.passwordError}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            id="repeatPassword"
            label="Repeat password"
            type="password"
            autoComplete="current-password"
            value={formData.repeatPassword}
            onChange={handleTextFieldChange("repeatPassword")}
            error={Boolean(formError.repeatPasswordError)}
            helperText={formError.repeatPasswordError}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            label={
              <Typography variant={"body2"}>
                I hereby agree to FreshBite's{" "}
                <a
                  href="/terms-of-use"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms of use.
                </a>
              </Typography>
            }
            control={
              <Checkbox
                name="termsOfUse"
                checked={formData.agreedToTermsOfUse}
                onChange={handleCheckboxChange}
              />
            }
          />
          {Boolean(formError.agreedToTermsOfUseError) && (
            <FormHelperText error>
              {formError.agreedToTermsOfUseError}
            </FormHelperText>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
