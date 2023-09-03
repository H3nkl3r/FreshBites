import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

export default function FailureDisplay({ message }) {
  return (
    <Container style={{ textAlign: "center", marginBottom: "6rem" }}>
      <Grid
        container
        spacing={12}
        alignItems="center"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Grid item xs={12}>
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {message}
          </Typography>
        </Grid>
        <Card sx={{ width: 300 }}>
          <CardMedia
            sx={{ height: 200 }}
            image={
              "https://images.pexels.com/photos/33999/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600"
            }
          />

          <CardActions style={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() =>
                (window.location.href = "http://localhost:3000/contact/")
              }
            >
              Contact us!
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Container>
  );
}
