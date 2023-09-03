import * as React from "react";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LocationOn, Restaurant } from "@mui/icons-material";
import { debounce } from "@mui/material/utils";
import { useLocation, useNavigate } from "react-router-dom";

const fetchAreaSuggestions = debounce(async (query, callback) => {
  const response = await fetch(
    `http://localhost:3001/restaurant/getLocationAutocomplete?query=${query}&types=area`
  );
  try {
    const data = await response.json();
    callback(data.items.map((item) => ({ type: "area", data: item })));
  } catch (e) {
    // No error feedback. Just do nothing and let it load when server response is not ok.
  }
}, 400);

const fetchRestaurantSuggestions = debounce(async (query, callback) => {
  const response = await fetch(
    `http://localhost:3001/restaurant/getAutocompleteRestaurantName?query=${query}`
  );
  try {
    const data = await response.json();
    callback(data.items.map((item) => ({ type: "restaurant", data: item })));
  } catch (e) {
    // No error feedback. Just do nothing and let it load when server response is not ok.
  }
}, 400);

export default function SearchAutocomplete({ page = "restaurants" }) {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlArea = params.get("area");
    const urlName = params.get("name");
    if (urlArea) {
      setValue({ type: "area", data: { address: { label: urlArea } } });
    }
    if (urlName) {
      setValue({ type: "restaurant", data: { name: urlName } });
    }
  }, [location.search]);

  useEffect(() => {
    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }
    setLoading(true);
    Promise.all([
      new Promise((resolve) => fetchAreaSuggestions(inputValue, resolve)),
      new Promise((resolve) => fetchRestaurantSuggestions(inputValue, resolve)),
    ]).then((results) => {
      const combinedResults = [...results[0], ...results[1]];
      setOptions(combinedResults || []);
      setLoading(false);
    });
  }, [value, inputValue]);

  return (
    <Autocomplete
      id="search-autocomplete"
      getOptionLabel={(option) =>
        option.type === "area" ? option.data.address.label : option.data.name
      }
      isOptionEqualToValue={(option, value) =>
        option.type === "area"
          ? option.data.address.label === value.data.address.label
          : option.data.name === value.data.name
      }
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No cities or restaurants"
      onChange={(event, newValue) => {
        setValue(newValue);
        if (newValue) {
          if (newValue.type === "area") {
            navigate(`/${page}?area=${newValue.data.address.label}`, {
              replace: true,
            });
          } else if (newValue.type === "restaurant") {
            navigate(`/${page}?name=${newValue.data.name}`, {
              replace: true,
            });
          }
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Where do you want to eat today?"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
            style: { backgroundColor: "white" },
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Grid container alignItems="center">
            <Grid item sx={{ display: "flex", width: 44 }}>
              {option.type === "area" ? (
                <LocationOn sx={{ color: "text.secondary" }} />
              ) : (
                <Restaurant sx={{ color: "text.secondary" }} />
              )}
            </Grid>
            <Grid
              item
              sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
            >
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {option.type === "area"
                  ? option.data.address.label
                  : option.data.name}
              </Box>
              <Typography
                variant="body2"
                style={{ textAlign: "left" }}
                color="text.secondary"
              >
                {option.type === "area" ? option.data.title : option.data.name}
              </Typography>
            </Grid>
          </Grid>
        </li>
      )}
    />
  );
}
