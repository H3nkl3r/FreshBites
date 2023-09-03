import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material/";
import { useParams } from "react-router-dom";
import FailureDisplay from "../components/payment/FailureDisplay.js";
import { AuthContext } from "../utils/AuthProvider";

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
            Don't want to register your restaurant yet? If you change your mind,
            we would be very happy to welcome you back.
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
                    "http://localhost:3000/restaurants/create")
                }
              >
                Create restaurant
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default function CancelPaymentRestaurant() {
  const { restaurantId } = useParams();
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(true); // New state for loading indicator
  let [success, setSuccess] = useState();
  let [message, setMessage] = useState("");
  const { fetchWithToken, handleLogout, setError } = useContext(AuthContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSessionId(urlParams.get("session_id"));
  }, []);

  useEffect(() => {
    if (sessionId) {
      handleCancellation(restaurantId, sessionId);
    }
  }, [sessionId, restaurantId]);

  const handleCancellation = async (restaurantId, sessionId) => {
    const response = await fetchWithToken(
      "http://localhost:3001/restaurant/checkToDelete",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: restaurantId,
          sessionId: sessionId,
        }),
      }
    );

    if (response) {
      setSuccess(true);
      setLoading(false);
      handleLogout();
    } else {
      setLoading(false);
      setError(
        "There occurred some problems cancelling your registration. Please contact our Customer Service before registering again."
      );
      setMessage(
        "Unfortunately, there occurred some problems cancelling your registration. Please contact our Customer Service before registering again."
      );
      handleLogout();
    }
  };

  if (loading) {
    return (
      <Grid style={{ display: "flex", justifyContent: "center" }}>
        <Skeleton
          animation="wave"
          style={{ width: "800px", height: "300px" }}
        />
      </Grid>
    );
  } else if (success) {
    return (
      <Container>
        <CancelDisplay />
      </Container>
    );
  } else {
    return (
      <Container>
        <FailureDisplay message={message} />
      </Container>
    );
  }
}
