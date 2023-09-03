import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Container, Grid, Skeleton } from "@mui/material/";
import { useParams } from "react-router-dom";
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
    title: "Have a look at the new restaurants and get your premium vouchers!",
    img: "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=1600",
    link: "/restaurants",
    imgTitle: "Restaurant",
    buttonName: "Search restaurants",
  },
  {
    title: "Manage your profile and your personal information",
    img: "https://images.pexels.com/photos/955403/pexels-photo-955403.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imgTitle: "Image Text",
    link: "/userManagement",
    buttonName: "See your profile",
  },
];

const SuccessDisplay = () => {
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
              Congratulations, your premium subscription has been activated
              successfully!
              <Celebration style={{ fontSize: 80, marginRight: "10px" }} />
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="body1">
              Now you are officially a FreshBiter!
            </Typography>
            <Typography variant="body1">
              Get started by following the next steps!
            </Typography>
          </Grid>
          {nextSteps.map((story, index) => (
            <Grid item xs={6}>
              <Card
                sx={{ maxWidth: 600, height: 400 }}
                style={{
                  display: "flex",
                  textAlign: "center",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                key={index}
              >
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
                    onClick={() => (window.location.href = story.link)}
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

export default function SuccessPaymentUser() {
  const { userId } = useParams();
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(true); // New state for loading indicator
  let [success, setSuccess] = useState();
  let [message, setMessage] = useState("");
  const { fetchWithToken, setError, user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSessionId(urlParams.get("session_id"));
  }, []);

  useEffect(() => {
    if (sessionId) {
      handleActivation(userId, sessionId);
    }
  }, [userId, sessionId]);

  const handleActivation = async (userId, sessionId) => {
    const response = await fetchWithToken(
      "http://localhost:3001/user/activatePremium",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          sessionId: sessionId,
        }),
      }
    );

    if (response) {
      setSuccess(true);
      setUser({ ...user, role: "PREMIUM" });
      setLoading(false);
    } else {
      setSuccess(false);
      setMessage(
        "Unfortunately, the  activation of your subscription was not successful, please contact our Customer Service."
      );
      setError(
        "The activation of your subscription was not successful, please contact our Customer Service."
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
        <SuccessDisplay />
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
