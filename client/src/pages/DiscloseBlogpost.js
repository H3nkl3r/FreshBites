import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";

import { AuthContext } from "../utils/AuthProvider";

export default function DiscloseBlogpost() {
  const [blogpost, setBlogpost] = useState({});
  const [restaurant, setRestaurant] = useState({});

  const [loading, setLoading] = useState(true); // New state for loading indicator
  let { blogpostId } = useParams();
  const { fetchWithToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogpostData();
  }, [blogpostId]);

  useEffect(() => {
    if (blogpost.restaurantId) {
      fetchRestaurantData();
    }
    setLoading(false);
  }, [blogpost]);

  const handleLearnMore = async (restaurantId) => {
    fetch(`http://localhost:3001/restaurant/click`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ restaurantId: restaurantId }),
    });
    navigate(`/restaurants/${restaurantId}`);
  };
  const fetchBlogpostData = async () => {
    const params = new URLSearchParams({ blogpostId: blogpostId });
    const response = await fetchWithToken(
      `http://localhost:3001/blog/getOne?${params}`
    );
    if (response) {
      const jsonData = await response.json();
      setBlogpost(jsonData);
      return jsonData;
    }
  };

  const fetchRestaurantData = async () => {
    if (blogpost.restaurantId) {
      const restaurantParams = new URLSearchParams({
        restaurantId: blogpost.restaurantId,
      });
      const restaurantResponse = await fetchWithToken(
        `http://localhost:3001/restaurant/get?${restaurantParams}`
      );
      if (restaurantResponse) {
        const jsonDataRestaurant = await restaurantResponse.json();
        setRestaurant(jsonDataRestaurant);
        setLoading(false);
        return jsonDataRestaurant;
      }
    }
  };

  return (
    <Box style={{ position: "relative" }}>
      <Box
        style={{
          backgroundImage: `url(${loading ? "" : blogpost.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "40vh",
        }}
      />
      <Container
        style={{ position: "relative", marginTop: "-10vh", zIndex: 1 }}
        sx={{ backgroundColor: "white", padding: "2rem" }}
      >
        <Typography variant="h2" gutterBottom style={{ textAlign: "left" }}>
          {blogpost.title}
        </Typography>
        {loading ? (
          <Skeleton
            animation="wave"
            style={{ width: "900px", height: "300px" }}
          />
        ) : blogpost.type !== "successStory" ? (
          <Typography
            variant="subtitle1"
            component="p"
            style={{ textAlign: "left" }}
          >
            by {restaurant.name}
            <Button
              variant="text"
              onClick={() => handleLearnMore(blogpost.restaurantId)}
              style={{ marginLeft: "5%" }}
            >
              learn more
            </Button>
          </Typography>
        ) : (
          <Box />
        )}
        <Divider style={{ margin: "3%" }} />
        {loading ? (
          <Skeleton
            animation="wave"
            style={{ width: "900px", height: "300px" }}
          />
        ) : (
          <Typography variant="body2">{blogpost.text}</Typography>
        )}
      </Container>
    </Box>
  );
}
