import * as React from "react";
import { useEffect, useState } from "react";
import { debounce } from "@mui/material/utils";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";

const fetchAddressSuggestions = debounce(async (query, callback) => {
  const response = await fetch(
    `http://localhost:3001/restaurant/getLocationAutocomplete?query=${query}&types=address`
  );
  if (response.ok) {
    const data = await response.json();
    callback(data.items);
  }
}, 400);

const concatErrors = (errors) => {
  const errorFields = [
    "streetError",
    "houseNumberError",
    "zipError",
    "cityError",
    "countryError",
  ];

  return errorFields
    .map((field) => errors.address[field])
    .filter((error) => error) // filter out undefined and empty strings
    .join(", ");
};

export default function AddressAutocomplete({
  formData,
  setFormData,
  formError,
  setFormError,
}) {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }
    setLoading(true);
    fetchAddressSuggestions(inputValue, (results) => {
      setOptions(results || []);
      setLoading(false);
    });
  }, [value, inputValue]);

  useEffect(() => {
    if (formData.address && formData.address.street) {
      const address = {
        address: {
          street: formData.address.street,
          houseNumber: formData.address.houseNumber,
          postalCode: formData.address.zip,
          city: formData.address.city,
          countryName: formData.address.country,
          label: formData.address.label,
        },
        position: {
          lat: formData.address.latitude,
          lng: formData.address.longitude,
        },
      };

      setValue(address);
      setOptions([address]);
    } else {
      setValue(null);
      setOptions([]);
    }
  }, [formData.address]);

  return (
    <Autocomplete
      id="address-autocomplete"
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.address.label
      }
      options={options}
      isOptionEqualToValue={(option, value) =>
        option.address.label === value.address.label
      }
      autoComplete
      includeInputInList
      required
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        if (newValue) {
          setFormData((prevState) => ({
            ...prevState,
            address: {
              label: newValue.address.label,
              street: newValue.address.street,
              houseNumber: newValue.address.houseNumber,
              zip: newValue.address.postalCode,
              city: newValue.address.city,
              country: newValue.address.countryName,
              latitude: newValue.position.lat,
              longitude: newValue.position.lng,
            },
          }));
          setFormError((prevState) => ({
            ...prevState,
            addressError: "",
          }));
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Address"
          required
          error={
            Boolean(formError.address.streetError) ||
            Boolean(formError.address.houseNumberError) ||
            Boolean(formError.address.zipError) ||
            Boolean(formError.address.cityError) ||
            Boolean(formError.address.countryError)
          }
          helperText={concatErrors(formError)}
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
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Grid container alignItems="center">
            <Grid item sx={{ display: "flex", width: 44 }}>
              <LocationOn sx={{ color: "text.secondary" }} />
            </Grid>
            <Grid
              item
              sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
            >
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {option.address.label}
              </Box>
            </Grid>
          </Grid>
        </li>
      )}
    />
  );
}
