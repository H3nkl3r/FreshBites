import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { MenuBook, Restaurant } from "@mui/icons-material";
import ResultItems from "../components/restaurant/RestaurantSearchResults";
import { AuthContext } from "../utils/AuthProvider";
import SearchAutocomplete from "../components/common/SearchAutocomplete";
import { useLocation, useNavigate } from "react-router-dom";
import {
  kitchenList,
  parseCuisineValue,
  parseRequirementValue,
  requirementsList,
} from "../components/restaurant/RestaurantDetailsParser";
import { LoginContext } from "../utils/LoginProvider";
import Box from "@mui/material/Box";

export default function RestaurantSearch() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading indicator
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(1); // state for page number
  const [hasMore, setHasMore] = useState(true); // state to check if there's more data to fetch
  const [favoriteSuccessMessage, setFavoriteSuccessMessage] = useState("");

  const { fetchWithToken, setError, isAuthenticated } = useContext(AuthContext);
  const { handleClickOpenLogin } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();

  const userLocation = new URLSearchParams(location.search).get("area");

  const updateUrlParameters = (
    newFilter,
    newSortingOption,
    newRestaurantType,
    newArea // Include newArea as another argument
  ) => {
    let params;
    if (newArea) {
      params = new URLSearchParams({
        filter: JSON.stringify(newFilter),
        sortingOption: newSortingOption,
        restaurantType: newRestaurantType,
        area: newArea,
      });
    } else {
      params = new URLSearchParams({
        filter: JSON.stringify(newFilter),
        sortingOption: newSortingOption,
        restaurantType: newRestaurantType,
      });
      const queryParams = new URLSearchParams(location.search);
      const areaParam = queryParams.get("area");
      if (areaParam) {
        params.append("area", areaParam);
      }
    }
    navigate(`${location.pathname}?${params}`);
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

  const fetchData = async (clearData = false, page = 1) => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const areaParam = queryParams.get("area");
      const nameParam = queryParams.get("name");
      const filterQueryParam = queryParams.get("filter")
        ? JSON.parse(queryParams.get("filter"))
        : filter;
      const sortingQueryParam =
        queryParams.get("sortingOption") || sortingOption;
      const restaurantTypeParam =
        queryParams.get("restaurantType") || restaurantType;

      const params = new URLSearchParams({
        filter: JSON.stringify(filterQueryParam),
        page: page, // include page number in the request
        sortingOption: sortingQueryParam,
        restaurantType: restaurantTypeParam,
      });

      if (areaParam) {
        params.append("area", areaParam);
      }

      if (nameParam) {
        params.append("name", nameParam);
      }

      const response = await fetch(
        `http://localhost:3001/restaurant/get?${params}`
      );
      const jsonData = await response.json();
      if (!response.ok) {
        throw new Error();
      }
      if (clearData) {
        setData(jsonData);
      } else {
        const uniqueRestaurants = new Set(); // Set to store unique restaurant IDs
        const combinedData = [...data, ...jsonData];
        const filteredData = combinedData.filter((restaurant) => {
          if (uniqueRestaurants.has(restaurant._id)) {
            return false; // Duplicate restaurant, filter it out
          }
          uniqueRestaurants.add(restaurant._id);
          return true; // Unique restaurant, keep it
        });
        setData(filteredData);
      }
      setHasMore(jsonData.length > 0); // update hasMore if there's more data to fetch
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      setHasMore(false);
      setError("An error occurred during the search. Please try again later.");
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      hasMore
    ) {
      setPage((prevPage) => {
        return prevPage + 1;
      });
    }
  };

  const handleFavorite = async (restaurantId) => {
    if (!isAuthenticated()) {
      handleClickOpenLogin();
    } else {
      const response = await fetchWithToken(
        "http://localhost:3001/favorite/add",
        {
          method: "PUT",
          body: JSON.stringify({ restaurantId: restaurantId }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        const message = (await response.json()).message;
        setFavoriteSuccessMessage(message);
        handleClickSnackbar();
        fetchData();
      } else {
        setError(
          "Failed to add restaurant to favorites. Please try again later."
        );
      }
    }
  };

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

  const [sortingOption, setSortingOption] = useState("recommended"); // Set "recommended" as the default sorting option
  const handleSortingChange = (event) => {
    const newSortingOption = event.target.value;
    setSortingOption(newSortingOption);
    updateUrlParameters(filter, newSortingOption, restaurantType, userLocation);
  };

  const [filter, setFilter] = useState({
    requirementFilter: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      lactoseFree: false,
      kosher: false,
      halal: false,
    },
    kitchenFilter: {
      italian: false,
      german: false,
      indian: false,
      asian: false,
    },
  });

  const [restaurantType, setRestaurantType] = useState("new");

  useEffect(() => {
    // Read the parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const filterParam = queryParams.get("filter");
    const sortingOptionParam = queryParams.get("sortingOption");
    const restaurantTypeParam = queryParams.get("restaurantType");

    // Set the state based on the URL parameters
    if (filterParam) {
      setFilter(JSON.parse(filterParam));
    }
    if (sortingOptionParam) {
      setSortingOption(sortingOptionParam);
    }
    if (restaurantTypeParam) {
      setRestaurantType(restaurantTypeParam);
    }

    setLoading(true);
    setPage(1);
    fetchData(true, 1);
  }, [location.search]);

  useEffect(() => {
    if (hasMore) {
      setLoading(true);
      fetchData(false, page);
    }
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // add event listener when the component mounts

  const handleKitchenChange = (event, kitchen) => {
    const newFilter = {
      ...filter,
      kitchenFilter: {
        ...filter.kitchenFilter,
        [kitchen]: event.target.checked,
      },
    };
    setFilter(newFilter);
    updateUrlParameters(newFilter, sortingOption, restaurantType);
  };

  const handleRequirementChange = (event, requirement) => {
    const newFilter = {
      ...filter,
      requirementFilter: {
        ...filter.requirementFilter,
        [requirement]: event.target.checked,
      },
    };
    setFilter(newFilter);
    updateUrlParameters(newFilter, sortingOption, restaurantType);
  };

  function KitchenFilter() {
    return (
      <Grid item>
        <Grid container spacing={1} marginTop={"3%"}>
          <Grid item>
            <Restaurant />
          </Grid>
          <Grid item>
            <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
              Cuisine
            </Typography>
          </Grid>
        </Grid>
        <Box style={{ height: "250px", overflow: "auto" }}>
          <Grid container spacing={1} style={{ marginTop: "1%" }}>
            {kitchenList.map((kitchen) => (
              <Grid item xs={12} key={kitchen.value}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filter.kitchenFilter[kitchen.value]}
                        onChange={(event) =>
                          handleKitchenChange(event, kitchen.value)
                        }
                        name={kitchen.value}
                      />
                    }
                    label={
                      <Typography variant="body2" style={{ fontSize: "1rem" }}>
                        {kitchen.label}
                      </Typography>
                    }
                  />
                </FormGroup>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    );
  }

  function SpecialFilter() {
    return (
      <Grid item>
        <Grid container spacing={1} marginTop={"3%"}>
          <Grid item>
            <MenuBook />
          </Grid>
          <Grid item>
            <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
              Dietry Offerings
            </Typography>
          </Grid>
        </Grid>
        <Box style={{ height: "250px", overflow: "auto" }}>
          <Grid container spacing={1} style={{ marginTop: "1%" }}>
            {requirementsList.map((requirement) => (
              <Grid item xs={12} key={requirement.value}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filter.requirementFilter[requirement.value]}
                        onChange={(event) =>
                          handleRequirementChange(event, requirement.value)
                        }
                        name={requirement.value}
                      />
                    }
                    label={
                      <Typography variant="body2" style={{ fontSize: "1rem" }}>
                        {requirement.label}
                      </Typography>
                    }
                  />
                </FormGroup>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    );
  }

  function Filter() {
    return (
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Grid item style={{ marginTop: "3%" }}>
              <KitchenFilter />
            </Grid>
            <Grid item style={{ marginTop: "3%", marginBottom: "3%" }}>
              <Divider />
            </Grid>
            <Grid item style={{ marginBottom: "3%" }}>
              <SpecialFilter style={{ marginTop: "3%", marginBottom: "3%" }} />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }

  function NewVsEstablished() {
    const handleRestaurantType = (event, newValue) => {
      const newRestaurantType = newValue;
      setRestaurantType(newRestaurantType);
      updateUrlParameters(filter, sortingOption, newRestaurantType);
    };

    return (
      <Grid item>
        <ToggleButtonGroup
          variant="outlined"
          color="primary"
          value={restaurantType}
          exclusive
          onChange={handleRestaurantType}
          aria-label="restaurant Type"
        >
          <ToggleButton value="new" aria-label="new">
            New Openings
          </ToggleButton>
          <ToggleButton value="old" aria-label="old">
            Established
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    );
  }

  function SortOptions() {
    return (
      <Grid item>
        <Select value={sortingOption} onChange={handleSortingChange}>
          <MenuItem value="recommended">Recommended</MenuItem>
          <MenuItem value="distance" disabled={!userLocation}>
            Distance
          </MenuItem>

          <MenuItem value="newest">Newest</MenuItem>
        </Select>
      </Grid>
    );
  }

  return (
    <Container onScroll={handleScroll}>
      <Grid container spacing={2}>
        <Filter />
        <Grid item xs={9}>
          <SearchAutocomplete />
          <Grid
            container
            spacing={2}
            sx={{ marginTop: 1, marginBottom: 1 }}
            justifyContent="space-between"
          >
            <NewVsEstablished />
            <SortOptions />
          </Grid>
          <Grid container spacing={2}>
            <ResultItems
              loading={loading}
              data={data}
              handleFavorite={handleFavorite}
              handleLearnMore={handleLearnMore}
              ButtonText={"Favorite"}
              parseCuisineValue={parseCuisineValue}
              parseRequirementValue={parseRequirementValue}
            />
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        message={favoriteSuccessMessage}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
}
