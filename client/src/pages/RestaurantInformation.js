import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  Rating,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import MasonryImageList from "../components/common/MasonryImageList";
import {
  Article,
  Celebration,
  Favorite,
  FavoriteBorder,
  Language,
  LocationOn,
  MenuBook,
  Phone,
  Restaurant,
  Schedule,
} from "@mui/icons-material";
import WriteReview from "../components/restaurant/WriteReview";
import {
  parseCuisineValue,
  parseRequirementValue,
} from "../components/restaurant/RestaurantDetailsParser";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { AuthContext } from "../utils/AuthProvider";
import { LoginContext } from "../utils/LoginProvider";

export default function RestaurantInformation() {
  let { id } = useParams();
  const theme = useTheme();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true); // New state for loading indicator
  const [reviews, setReviews] = useState([]);
  const [additionalInformation, setAdditionalInformation] = useState([]);
  const [dishInformation, setDishInformation] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [blogId, setBlogId] = useState("");

  const navigate = useNavigate();

  const {
    setError,
    user,
    isAuthenticated,
    fetchWithToken,
    loading: authLoading,
  } = useContext(AuthContext);
  const { handleClickOpenLogin } = useContext(LoginContext);

  useEffect(() => {
    if (!authLoading) {
      fetchAndBuild()
        .then(() => {
          setLoading(false);
        })
        .catch((e) => setError(e.message));
    }
  }, [authLoading, user]);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleFavorite = async () => {
    if (!isAuthenticated()) {
      handleClickOpenLogin();
    } else {
      const action = isFavorite ? "remove" : "add";
      const response = await fetchWithToken(
        `http://localhost:3001/favorite/${action}`,
        {
          method: "PUT",
          body: JSON.stringify({ restaurantId: id }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setIsFavorite(!isFavorite);
      } else {
        setError(
          "Failed to add restaurant to favorites. Please try again later."
        );
      }
    }
  };

  const fetchAndBuild = async () => {
    const restaurantData = await fetchData();
    await fetchReviews();
    await checkFavorite();
    await fetchBlog();
    buildAdditionalInformation(restaurantData);
    buildDishInformation(restaurantData);
  };

  const fetchData = async () => {
    const params = new URLSearchParams({ restaurantId: id });
    const response = await fetch(
      `http://localhost:3001/restaurant/get?${params}`
    );
    if (response.ok) {
      const jsonData = await response.json();
      setData(jsonData);
      return jsonData;
    } else {
      throw new Error("Error loading restaurant data");
    }
  };

  const fetchReviews = async () => {
    const params = new URLSearchParams({ restaurantID: id });
    const response = await fetch(`http://localhost:3001/review/get?${params}`);
    if (response.ok) {
      const jsonData = await response.json();
      setReviews(jsonData);
    } else {
      throw new Error("Error loading reviews");
    }
  };
  const fetchBlog = async () => {
    const params = new URLSearchParams({ restaurantId: id });
    const response = await fetch(
      `http://localhost:3001/blog/getByRestaurant?${params}`
    );
    if (response.ok) {
      const jsonData = await response.json();
      if (jsonData.blog) {
        setBlogId(jsonData.blog._id);
      }
    } else {
      throw new Error("Error loading blog");
    }
  };

  const checkFavorite = async () => {
    if (!isAuthenticated()) {
      setIsFavorite(false);
      return;
    }
    const params = new URLSearchParams({ restaurantId: id });
    const response = await fetchWithToken(
      `http://localhost:3001/favorite/isFavorite?${params}`
    );
    if (response) {
      const jsonData = await response.json();
      setIsFavorite(jsonData.isFavorite);
    } else {
      setIsFavorite(false);
    }
  };

  const buildAdditionalInformation = async (jsonData) => {
    const openingHours = await parseOpeningHours(jsonData.openingHours);
    //get and format opening Date
    const openingDate = jsonData.openingDate;
    const openSinceDate = new Date(openingDate);
    openSinceDate.setUTCHours(0, 0, 0, 0); // to get the same time zone as the opening Date was saved
    const openSinceFormatted = `${openSinceDate.getDate()}.${
      openSinceDate.getMonth() + 1
    }.${openSinceDate.getFullYear()}`;
    setAdditionalInformation([
      {
        title: "Address",
        value: [
          `${jsonData.address.street} ${jsonData.address.houseNumber}`,
          `${jsonData.address.zip} ${jsonData.address.city}`,
          `${jsonData.address.country}`,
        ],
        icon: (
          <LocationOn
            sx={{
              width: 30,
              height: 30,
            }}
          />
        ),
      },
      {
        title: "Phone",
        value: [jsonData.phone],
        icon: (
          <Phone
            sx={{
              width: 30,
              height: 30,
            }}
          />
        ),
      },
      {
        title: "Website",
        value: jsonData.website !== "" ? [jsonData.website] : ["-"],
        icon: (
          <Language
            sx={{
              width: 30,
              height: 30,
            }}
          />
        ),
      },
      {
        title: "Opening Hours",
        value: openingHours,
        icon: (
          <Schedule
            sx={{
              width: 30,
              height: 30,
            }}
          />
        ),
      },
      {
        title: "Open since",
        value: [openSinceFormatted],
        icon: (
          <Celebration
            sx={{
              width: 30,
              height: 30,
            }}
          />
        ),
      },
    ]);
  };

  const buildDishInformation = async (jsonData) => {
    const cuisineType = jsonData.cuisineType.map((cuisine, index) => {
      return parseCuisineValue(cuisine);
    });

    const specialRequirements = jsonData.specialRequirements.map(
      (requirement, index) => {
        return parseRequirementValue(requirement);
      }
    );

    setDishInformation([
      {
        title: "Cuisine",
        value: cuisineType,
        icon: (
          <Restaurant
            sx={{
              width: 30,
              height: 30,
            }}
          />
        ),
      },
      {
        title: "Supported Dietary Needs",
        value: specialRequirements.length > 0 ? specialRequirements : ["-"],
        icon: (
          <MenuBook
            sx={{
              width: 30,
              height: 30,
            }}
          />
        ),
      },
    ]);
  };

  const [openReview, setOpenReview] = React.useState(false);

  const handleClickOpenReview = () => {
    if (isAuthenticated()) {
      setOpenReview(true);
    } else {
      handleClickOpenLogin();
    }
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  };

  const createdAtDate = new Date(data.createdAt);
  // calculation of today one year ago to check if a restaurant is category new opened or already category established
  const currentDate = new Date();
  const todayOneYearAgo = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth(),
    currentDate.getDate(),
    currentDate.getHours(),
    currentDate.getMinutes(),
    currentDate.getSeconds()
  );

  const parseOpeningHours = async (openingHoursJSON) => {
    const openingHoursRawData = JSON.parse(JSON.stringify(openingHoursJSON));

    const weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    let openingHoursArray = [];
    const options = {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      minute: "2-digit",
    };
    await weekDays.forEach((day) => {
      if (
        openingHoursRawData[`open${day}`] === null &&
        openingHoursRawData[`close${day}`] === null
      ) {
        openingHoursArray.push(`${day}: Closed`);
      } else {
        const openingTime = new Date(openingHoursRawData[`open${day}`]);
        const closingTime = new Date(openingHoursRawData[`close${day}`]);
        const localOpeningTime = openingTime.toLocaleTimeString(
          "en-GB",
          options
        );
        const localClosingTime = closingTime.toLocaleTimeString(
          "en-GB",
          options
        );

        //const closingTime = new Date(openingHoursRawData.closeMonday);
        openingHoursArray.push(
          `${day}: ${localOpeningTime} - ${localClosingTime}`
        );
      }
    });
    return openingHoursArray;
  };

  const parseDate = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is zero-based, so add 1
    const day = date.getDate();

    return `${day.toString().padStart(2, "0")}.${month
      .toString()
      .padStart(2, "0")}.${year}`;
  };

  function DishInformation() {
    return dishInformation.map((item, index) => (
      <Grid container alignItems="center" margin={"3%"} key={index}>
        <Grid item xs={12}>
          <Grid container direction="row" alignItems="top" spacing={1}>
            <Grid item>{item.icon}</Grid>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant={"h6"} style={{ fontWeight: "bold" }}>
                    {item.title}
                  </Typography>
                </Grid>
                {item.value.map((line, index) => {
                  return (
                    <Grid item key={index}>
                      <Typography variant={"body2"}>{line}</Typography>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    ));
  }

  function AdditionalInformation() {
    return additionalInformation.map((item, index) => (
      <Grid container alignItems="center" margin={"3%"} key={index}>
        <Grid item xs={12}>
          <Grid container direction="row" alignItems="top" spacing={1}>
            <Grid item>{item.icon}</Grid>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant={"h6"} style={{ fontWeight: "bold" }}>
                    {item.title}
                  </Typography>
                </Grid>
                {item.value.map((line, index) => {
                  return (
                    <Grid item key={index}>
                      <Typography variant={"body2"}>{line}</Typography>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    ));
  }

  function Map() {
    const position = loading
      ? [48.137154, 11.576124]
      : [data.location.coordinates[1], data.location.coordinates[0]];
    return (
      <Card>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "40vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} />
        </MapContainer>
      </Card>
    );
  }

  function RestaurantRatingBar() {
    return (
      <Grid container spacing={0.5}>
        <Grid item>
          <Rating
            name="read-only"
            precision={0.5}
            value={data.averageRating}
            readOnly
          />
        </Grid>
        <Grid item sx={{ alignItems: "center" }}>
          <Typography variant="body2" style={{ fontWeight: "bold" }}>
            {data.averageRating.toFixed(1)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant={"body2"} sx={{ alignItems: "center" }}>
            ({reviews.length} Reviews)
          </Typography>
        </Grid>
      </Grid>
    );
  }

  function Review(review) {
    return (
      <Card style={{ margin: "3%" }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={1.5}>
            <Grid
              container
              direction="column"
              sx={{ alignItems: "center", margin: "3%" }}
              spacing={0.5}
            >
              <Grid item>
                <Typography variant={"body2"} textAlign={"center"}>
                  {review.user.firstName}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant={"subtitle1"}>
                  {parseDate(review.date)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={10.5}>
            <Grid container direction="row" sx={{ margin: "3%" }} spacing={1}>
              <Grid item xs={12} sx={{ alignItems: "center" }}>
                <Rating
                  name="read-only"
                  precision={0.5}
                  value={review.numbStars}
                  readOnly
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant={"body2"} style={{ marginRight: "5%" }}>
                  {review.description}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    );
  }

  function Reviews() {
    return (
      loading || reviews.length === 0
        ? Array.from(new Array(loading ? 6 : 1))
        : reviews
    ).map((review, index) => (
      <Grid item xs={12} key={index}>
        {loading ? (
          <Skeleton animation="wave" height={150} />
        ) : reviews.length === 0 && index === 0 ? (
          <Typography variant="body2" style={{ margin: "3%" }}>
            No reviews yet
          </Typography>
        ) : (
          Review(review)
        )}
      </Grid>
    ));
  }

  function Menu() {
    return (
      <Typography variant={"body2"}>
        <Link
          to={loading ? "" : data.menuURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Click here
        </Link>{" "}
        to view the menu.
      </Typography>
    );
  }

  function MainColumn() {
    return (
      <Grid item xs={8}>
        <Card>
          {loading ? (
            <Skeleton animation="wave" />
          ) : (
            <Box display="flex" justifyContent="space-between" margin={"3%"}>
              <Typography
                variant={"h2"}
                maxWidth={"70%"}
                style={{ textAlign: "left" }}
              >
                {data.name} {"  "}
                {createdAtDate > todayOneYearAgo && (
                  <Chip
                    label="NEW"
                    style={{
                      fontSize: "0.9rem",
                      padding: "1.0rem",
                    }}
                    sx={{
                      color: "white",
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                )}
              </Typography>
              <Box display="flex">
                <Button
                  disabled={user && user.role === "OWNER"}
                  onClick={handleFavorite}
                >
                  {isFavorite ? (
                    <Box>
                      <Favorite />
                      <Typography variant={"body2"}>Unfavorite</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <FavoriteBorder />
                      <Typography variant={"body2"}>Favorite</Typography>
                    </Box>
                  )}
                </Button>
                <Button
                  onClick={() => navigate(`/blog/${blogId}`)}
                  disabled={!blogId}
                >
                  <Box>
                    <Article />
                    <Typography variant={"body2"}>Blog</Typography>
                  </Box>
                </Button>
              </Box>
            </Box>
          )}
          <Divider style={{ margin: "3%" }} />
          {loading ? (
            <Skeleton animation="wave" />
          ) : (
            <Grid container direction="column" style={{ margin: "3%" }}>
              <Grid item xs={6}>
                <RestaurantRatingBar />
              </Grid>
              <Grid item style={{ marginTop: "3%" }}>
                <Typography variant={"body2"} sx={{ marginRight: "5%" }}>
                  {loading ? <Skeleton animation="wave" /> : data.description}
                </Typography>
              </Grid>
            </Grid>
          )}
          <Divider style={{ margin: "3%" }} />
          <Typography
            variant={"h5"}
            style={{ margin: "3%", fontWeight: "bold" }}
          >
            {loading ? (
              <Skeleton animation="wave" />
            ) : (
              `${data.images.length} Pictures`
            )}
          </Typography>
          <Box style={{ margin: "3%" }}>
            {loading ? (
              <Skeleton animation="wave" />
            ) : (
              <MasonryImageList
                style={{ margin: "3%" }}
                itemData={data.images}
              />
            )}
          </Box>
          <Divider style={{ margin: "3%" }} />
          <Grid container style={{ margin: "3%" }} direction="column">
            <Grid item>
              <Typography variant={"h5"} sx={{ fontWeight: "bold" }}>
                Menu
              </Typography>
            </Grid>
            <Grid item>
              {loading ? <Skeleton animation="wave" /> : <Menu />}
            </Grid>
          </Grid>
          <Divider style={{ margin: "3%" }} />
          <Grid
            container
            spacing={0.5}
            style={{ margin: "3%" }}
            direction="column"
          >
            <Grid item>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Reviews
              </Typography>
            </Grid>
            {loading ? (
              <Skeleton animation="wave" />
            ) : (
              <Grid item>
                <RestaurantRatingBar />
              </Grid>
            )}
          </Grid>
          {loading ? <Skeleton animation="wave" /> : <Reviews />}
        </Card>
      </Grid>
    );
  }

  function SideColumn() {
    return (
      <Grid item xs={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <Typography
                variant={"h5"}
                align={"center"}
                sx={{ fontWeight: "bold" }}
                marginTop={"3%"}
              >
                Voucher
              </Typography>
              <Divider style={{ margin: "3%" }} />
              <Grid container spacing={1} style={{ margin: "3%" }}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/voucher/${id}`}
                    disabled={user && user.role === "OWNER"}
                  >
                    Get Voucher
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    onClick={handleClickOpenReview}
                    disabled={user && user.role === "OWNER"}
                  >
                    Write Review
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {user && user.role === "OWNER" && (
                    <Grid item xs={12} style={{ width: "89%" }}>
                      <Alert severity="info" color="warning">
                        As a restaurant owner, you are not eligible to receive
                        vouchers, write reviews, and add favorites.
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <Typography
                variant={"h5"}
                align={"center"}
                sx={{ fontWeight: "bold" }}
                marginTop={"3%"}
              >
                Dishes
              </Typography>
              <Divider style={{ margin: "3%" }} />
              {loading ? <Skeleton animation="wave" /> : <DishInformation />}
            </Card>
          </Grid>
          <Grid item xs={12}>
            {loading ? <Skeleton animation="wave" /> : <Map />}
          </Grid>
          <Grid item xs={12}>
            <Card>
              <Typography
                variant={"h5"}
                align={"center"}
                sx={{ fontWeight: "bold" }}
                marginTop={"3%"}
              >
                Additional Information
              </Typography>
              <Divider style={{ margin: "3%" }} />
              {loading ? (
                <Skeleton animation="wave" />
              ) : (
                <AdditionalInformation />
              )}
            </Card>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box style={{ position: "relative" }}>
      <Box
        style={{
          backgroundImage: "url(" + (loading ? "" : data.images[0]) + ")",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "40vh",
        }}
      />
      <Container
        style={{ position: "relative", marginTop: "-10vh", zIndex: 1 }}
      >
        <Grid container spacing={2}>
          <MainColumn />
          <SideColumn />
        </Grid>
      </Container>
      <WriteReview
        onClose={handleCloseReview}
        restaurantID={loading ? null : data._id}
        openReview={openReview}
      />
    </Box>
  );
}
