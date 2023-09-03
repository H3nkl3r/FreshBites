import React from "react";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="67vh"
        py={5}
      >
        <Grid component={Paper} elevation={2} p={3}>
          <Typography
            variant="h1"
            component="h2"
            color="error"
            gutterBottom
            align="center"
          >
            404
          </Typography>
          <Typography variant="h4" component="h3" gutterBottom align="center">
            Oops! Page not found.
          </Typography>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            component="p"
            align="center"
          >
            The page you are looking for might have been removed or is
            temporarily unavailable.
          </Typography>
          <Box mt={3} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
            >
              BACK TO HOMEPAGE
            </Button>
          </Box>
        </Grid>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
