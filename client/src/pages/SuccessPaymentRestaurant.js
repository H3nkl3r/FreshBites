import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Container, Grid, Skeleton } from "@mui/material/";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Celebration } from "@mui/icons-material";
import FailureDisplay from "../components/payment/FailureDisplay.js";
import { AuthContext } from "../utils/AuthProvider";

const nextSteps = [
  {
    title:
      "Go to the restaurant's profile and create a blogpost to tell your potential visitors more about your unique restaurant!",
    img: "https://images.pexels.com/photos/2954199/pexels-photo-2954199.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imgTitle: "Restaurant",
    buttonName: "Create blogpost",
  },
];

const SuccessDisplay = ({ restaurantId, navigate }) => {
  return (
    <Box>
      <Container>
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
              Congratulations, your restaurant has been registered successfully!
              <Celebration style={{ fontSize: 80, marginRight: "10px" }} />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ textAlign: "center" }}>
              Get started by following the next step!
            </Typography>
          </Grid>
          {nextSteps.map((story, index) => (
            <Grid item xs={6} key={index}>
              <Card sx={{ maxWidth: 600 }} key={index}>
                <CardMedia
                  sx={{ height: 200 }}
                  image={story.img}
                  title={story.imgTitle}
                />
                <CardContent>
                  <Typography variant="h4">{story.title}</Typography>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      navigate(`/managerestaurant/${restaurantId}`);
                    }}
                  >
                    {story.buttonName}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default function SuccessPaymentRestaurant() {
  const { restaurantId } = useParams();
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(true); // New state for loading indicator
  let [success, setSuccess] = useState();
  let [message, setMessage] = useState("");
   const navigate = useNavigate();
  const { fetchWithToken, setError } = useContext(AuthContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSessionId(urlParams.get("session_id"));
  }, []);

  useEffect(() => {
    if (sessionId) {
      handleActivation(restaurantId, sessionId);
    }
  }, [restaurantId, sessionId]);

  const handleActivation = async (restaurantId, sessionId) => {
    const response = await fetchWithToken(
      "http://localhost:3001/restaurant/activateRestaurant",
      {
        method: "PATCH",
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
    } else {
      const error = await response.json();
      setSuccess(false);
      setError(
        "The activation of your subscription was not successful, please contact our Customer Service."
      );
      setMessage(
        "Unfortunately, the activation of your subscription was not successful, please contact our Customer Service."
      );
      setLoading(false);
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
          <SuccessDisplay
              restaurantId={restaurantId}
              navigate={navigate}/>
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
