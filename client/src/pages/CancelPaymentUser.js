import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material/";

const CancelDisplay = () => {
  return (
    <Container style={{ textAlign: "center" }}>
      <Grid
        container
        spacing={6}
        alignItems="center"
        justifyContent="space-evenly"
      >
        <Grid item xs={12}>
          <Typography
            variant="h2"
            sx={{ display: "flex", alignItems: "center" }}
          >
            Don't want to be a premium customer yet? If you change your mind,
            you can upgrade your subscription at any time in your user profile
            or use the button below.
          </Typography>
        </Grid>
        <Grid item>
          <Card sx={{ width: 300 }}>
            <CardMedia
              sx={{ height: 200 }}
              image={
                "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1600"
              }
            />

            <CardActions style={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:3000/usermanagement/")
                }
              >
                Upgrade to premium plan
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default function CancelPaymentUser() {
  return (
    <Container>
      <CancelDisplay />
    </Container>
  );
}
