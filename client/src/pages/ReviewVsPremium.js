import * as React from "react";
import { useContext } from "react";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import VoucherComparison from "../components/information/VoucherComparison";
import { LoginContext } from "../utils/LoginProvider";
import { AuthContext } from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function ReviewVsPremium() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const {
    handleClickOpenLogin,
    handleClickOpenUpgrade,
    handleClickOpenRegister,
  } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleWriteReview = () => {
    if (user) {
      navigate("/restaurants");
    } else {
      handleClickOpenLogin();
    }
  };

  const handleGetSubscription = () => {
    if (!isAuthenticated()) {
      handleClickOpenRegister();
    } else {
      handleClickOpenUpgrade();
    }
  };

  function Options() {
    return (
      <Container style={{ textAlign: "center" }}>
        <Grid container spacing={4} sx={{ textAlign: "center" }}>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Card
              sx={{
                height: 380,
                display: "flex",
                textAlign: "center",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardMedia
                sx={{ height: 200 }}
                image="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                title="fancy fries"
              />
              <CardContent sx={{ alignItems: "flex-end" }}>
                <Typography variant="h3" style={{ marginBottom: 10 }}>
                  Get your subscription
                </Typography>
                <Typography variant="body2" style={{ marginBottom: 10 }}>
                  Upgrade your subscription with only 4,99 € per month or 49,99
                  € per year and get access to various discounts
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  variant="text"
                  sx={{ textAlign: "center" }}
                  onClick={handleGetSubscription}
                  disabled={user && user.role !== "FREE"}
                >
                  Subscribe Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
            <Card
              sx={{
                height: 380,
                display: "flex",
                textAlign: "center",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardMedia
                sx={{ height: 200 }}
                image="https://images.pexels.com/photos/265152/pexels-photo-265152.jpeg?auto=compress&cs=tinysrgb&w=1600"
                title="reviews"
              />
              <CardContent sx={{ alignItems: "flex-end" }}>
                <Typography variant="h3" style={{ marginBottom: 10 }}>
                  Log in and write a review
                </Typography>
                <Typography variant="body2" style={{ marginBottom: 10 }}>
                  Write reviews and get a voucher per every three reviews
                  regardless of your subscription status
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  variant="text"
                  sx={{ textAlign: "center" }}
                  onClick={handleWriteReview}
                  disabled={user && user.role === "OWNER"}
                >
                  Write a review
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ justifyContent: "center" }}>
            {user && user.role === "OWNER" && (
              <Grid
                item
                xs={12}
                style={{
                  justifyContent: "center",
                  marginRight: 0,
                  marginBottom: -30,
                }}
              >
                <Alert severity="info" color="warning">
                  <Typography variant={"body2"}>
                    As a restaurant owner, you are not eligible to receive
                    vouchers.
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={6}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography variant="h1">Get your Personal Discounts</Typography>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography variant="body1">
            Getting discounts for new food spots has never been cheaper and
            easier!
          </Typography>
          <Typography variant="body1">
            Upgrade your subscription or write reviews.
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Options />
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography variant="h2">Compare your options</Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <VoucherComparison />
        </Grid>
      </Grid>
    </Container>
  );
}
