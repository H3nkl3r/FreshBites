import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function MyRestaurants({ restaurantInfo }) {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  variant="h3"
                  sx={{ textAlign: "center", marginTop: 2 }}
                >
                  Your Restaurants
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ display: "flex" }}>
                  <CardMedia
                    component="img"
                    src={restaurantInfo.restaurantImage}
                    alt={restaurantInfo.restaurantName}
                    heigth="150"
                    sx={{ width: 200, height: 150 }}
                  />
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">
                        {restaurantInfo.restaurantName}
                      </Typography>
                      <Typography variant="body2"></Typography>
                    </CardContent>
                  </Box>
                  <CardActions
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: 700,
                    }}
                  >
                    {}
                    <Button
                      variant="text"
                      component={Link}
                      to={`/restaurants/${restaurantInfo.restaurantId}`}
                    >
                      View restaurant
                    </Button>
                    <Button
                      variant="text"
                      component={Link}
                      to={`/managerestaurant/${restaurantInfo.restaurantId}`}
                    >
                      Edit restaurant
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center", marginBottom: 2 }}>
                <Tooltip disableFocusListener title="Coming soon" arrow>
                  <span>
                    <Button variant="contained" disabled={true}>
                      Add Restaurant
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Grid>
    </Grid>
  );
}
