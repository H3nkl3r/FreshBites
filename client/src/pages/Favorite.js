import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Snackbar, Typography } from "@mui/material";
import ResultItems from "../components/restaurant/RestaurantSearchResults";
import { AuthContext } from "../utils/AuthProvider";
import {
  parseCuisineValue,
  parseRequirementValue,
} from "../components/restaurant/RestaurantDetailsParser";
import { useNavigate } from "react-router-dom";

export default function Favorite() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading indicator
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { fetchWithToken } = useContext(AuthContext);

  const navigate = useNavigate();

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

  const handleClickSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        navigate("/voucher");
      } else {
        fetchData();
      }
    }
  }, [authLoading, isAuthenticated]);

  const fetchData = async () => {
    const response = await fetchWithToken(`http://localhost:3001/favorite`);
    if (response) {
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  const handleFavorite = async (restaurantId) => {
    const response = await fetchWithToken(
      "http://localhost:3001/favorite/remove",
      {
        method: "PUT",
        body: JSON.stringify({ restaurantId: restaurantId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      handleClickSnackbar();
      fetchData();
    }
  };

  return (
    <Container>
      <Typography variant="h2" sx={{ my: 2 }}>
        Favorite Restaurants
      </Typography>
      <Grid container justifyContent="center" spacing={2}>
        {data.restaurants && data.restaurants.restaurants.length > 0 ? (
          <ResultItems
            loading={loading}
            data={data.restaurants.restaurants}
            handleFavorite={handleFavorite}
            handleLearnMore={handleLearnMore}
            ButtonText={"Unfavorite"}
            parseCuisineValue={parseCuisineValue}
            parseRequirementValue={parseRequirementValue}
          />
        ) : (
          <Typography variant="h6" sx={{ my: 2 }}>
            You have no favorite restaurants
          </Typography>
        )}
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        message="Removed from favorites"
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
}
