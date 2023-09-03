import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Skeleton,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { AuthContext } from "../../utils/AuthProvider";

function ResultItem({
  restaurant,
  handleFavorite,
  handleLearnMore,
  ButtonText = { ButtonText },
  parseCuisineValue,
  parseRequirementValue,
  index,
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card key={index}>
      <Box sx={{ display: "flex" }}>
        <CardActionArea
          sx={{ display: "flex", flexGrow: 1 }}
          onClick={() => handleLearnMore(restaurant._id)}
        >
          <CardMedia
            component="img"
            src={restaurant.images[0]}
            alt={restaurant.name}
            sx={{
              width: 150,
              height: 150,
              objectFit: "cover",
            }}
          />
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography variant="h5">{restaurant.name}</Typography>
            <Typography variant="subtitle2">
              {restaurant.cuisineType.map((cuisine, index) =>
                index < restaurant.cuisineType.length - 1
                  ? parseCuisineValue(cuisine) + " • "
                  : parseCuisineValue(cuisine)
              )}
            </Typography>
            <Typography variant="subtitle2">
              {restaurant.specialRequirements.map((requirement, index) =>
                index < restaurant.specialRequirements.length - 1
                  ? parseRequirementValue(requirement) + " • "
                  : parseRequirementValue(requirement)
              )}
            </Typography>
            <Rating
              name="read-only"
              value={restaurant.averageRating}
              precision={0.5}
              readOnly
            />
          </CardContent>
        </CardActionArea>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <CardActions sx={{ flexDirection: "column", padding: "8px" }}>
            <Button
              variant="smallText"
              onClick={() => handleFavorite(restaurant._id)}
              style={{ whiteSpace: "nowrap" }}
              disabled={user && user.role === "OWNER"}
            >
              {ButtonText}
            </Button>
            <Button
              variant="smallText"
              component={Link}
              to={`/voucher/${restaurant._id}`}
              style={{ whiteSpace: "nowrap" }}
              disabled={user && user.role === "OWNER"}
            >
              Get Voucher
            </Button>
          </CardActions>
        </Box>
      </Box>
    </Card>
  );
}

export default function ResultItems({
  loading,
  data,
  handleFavorite,
  handleLearnMore,
  parseCuisineValue,
  parseRequirementValue,
  ButtonText = { ButtonText },
}) {
  const items = [...data];
  if (loading) {
    // When loading, append skeletons to the end of the list
    items.push(...Array.from(new Array(6)));
  }

  return items.length > 0 ? (
    items.map((item, index) => (
      <Grid item xs={12} key={index}>
        {!item ? (
          <Skeleton animation="wave" height={150} />
        ) : (
          <ResultItem
            restaurant={item}
            handleFavorite={handleFavorite}
            handleLearnMore={handleLearnMore}
            ButtonText={ButtonText}
            parseCuisineValue={parseCuisineValue}
            parseRequirementValue={parseRequirementValue}
            index={index}
          />
        )}
      </Grid>
    ))
  ) : (
    <Grid
      item
      xs={12}
      sx={{ textAlign: "center", alignItems: "center", marginTop: 20 }}
    >
      <Typography sx={{ fontSize: 18 }}>
        Unfortunately, we weren't able to find restaurants matching your
        criteria.
      </Typography>
      <SentimentVeryDissatisfiedIcon
        sx={{ height: 40, width: 40, marginTop: 3 }}
      />
    </Grid>
  );
}
