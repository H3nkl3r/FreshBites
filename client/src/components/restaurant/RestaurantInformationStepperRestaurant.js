import * as React from "react";
import {
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimeField,
} from "@mui/x-date-pickers";
import MultiSelectComponent from "../common/MultiSelect";
import AddressAutocomplete from "../common/AddressAutocomplete";
import { HelpOutline } from "@mui/icons-material";

const daysOfWeek = [
  { name: "Monday", value: "Monday" },
  { name: "Tuesday", value: "Tuesday" },
  { name: "Wednesday", value: "Wednesday" },
  { name: "Thursday", value: "Thursday" },
  { name: "Friday", value: "Friday" },
  { name: "Saturday", value: "Saturday" },
  { name: "Sunday", value: "Sunday" },
];

const cuisineTypesList = [
  { value: "american", label: "American" },
  { value: "brazilian", label: "Brazilian" },
  { value: "british", label: "British" },
  { value: "caribbean", label: "Caribbean" },
  { value: "chinese", label: "Chinese" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "greek", label: "Greek" },
  { value: "indian", label: "Indian" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "lebanese", label: "Lebanese" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "mexican", label: "Mexican" },
  { value: "moroccan", label: "Moroccan" },
  { value: "spanish", label: "Spanish" },
  { value: "thai", label: "Thai" },
  { value: "turkish", label: "Turkish" },
  { value: "vietnamese", label: "Vietnamese" },
];

const specialRequirementsList = [
  { value: "dairyFree", label: "Dairy Free" },
  { value: "glutenFree", label: "Gluten Free" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "locallySourced", label: "Locally Sourced" },
  { value: "lowCarb", label: "Low Carb" },
  { value: "lowFat", label: "Low Fat" },
  { value: "nutFree", label: "Nut Free" },
  { value: "organic", label: "Organic" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "raw", label: "Raw" },
  { value: "sugarFree", label: "Sugar Free" },
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
];

function OpeningHoursComponent({
  formData,
  setFormData,
  formError,
  setFormError,
}) {
  const theme = useTheme();
  const handleOpeningHoursChange = (newValue, day) => {
    setFormData({
      ...formData,
      openingHours: { ...formData.openingHours, [day]: newValue },
    });
  };

  const handleClosedDayChange = (event) => {
    const day = event.target.name;
    setFormData({
      ...formData,
      closedDays: {
        ...formData.closedDays,
        [day]: event.target.checked,
      },
    });
  };

  const isError = formError.openingHoursError || formError.closedDaysError;

  return (
    <Grid item xs={8}>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ marginBottom: "2%" }}>
          <Typography variant={"h6"}>Fill in your opening hours *</Typography>
        </Grid>
        <Grid
          container
          spacing={2}
          style={{
            border: isError ? "1px solid" + theme.palette.error.main : "none",
            borderRadius: "5px",
          }}
        >
          {daysOfWeek.map((day) => (
            <Grid item xs={12} key={day.value}>
              <FormGroup>
                <Container sx={{ display: "flex", flexDirection: "row" }}>
                  <Grid item xs={3}>
                    <FormLabel>{day.name}</FormLabel>
                  </Grid>
                  <Grid item xs={3}>
                    <TimeField
                      label="From"
                      disabled={formData.closedDays[`closed${day.value}`]}
                      value={formData.openingHours[`open${day.value}`]}
                      onChange={(newValue) =>
                        handleOpeningHoursChange(newValue, `open${day.value}`)
                      }
                      name={`open${day.value}`}
                      format="HH:mm"
                    />
                  </Grid>
                  <Grid item xs={3} style={{ marginLeft: "2%" }}>
                    <TimeField
                      label="To"
                      disabled={formData.closedDays[`closed${day.value}`]}
                      value={formData.openingHours[`close${day.value}`]}
                      onChange={(newValue) =>
                        handleOpeningHoursChange(newValue, `close${day.value}`)
                      }
                      name={`close${day.value}`}
                      format="HH:mm"
                    />
                  </Grid>
                  <Grid item xs={3} style={{ marginLeft: "2%" }}>
                    <FormControlLabel
                      label={<Typography variant="body2">Closed</Typography>}
                      control={
                        <Checkbox
                          checked={formData.closedDays[`closed${day.value}`]}
                          onChange={handleClosedDayChange}
                          name={`closed${day.value}`}
                        />
                      }
                    />
                  </Grid>
                </Container>
              </FormGroup>
            </Grid>
          ))}
        </Grid>
        <Typography color="error" variant={"body2"}>
          {formError.openingHoursError}
          {formError.closedDaysError}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default function RestaurantInformationStepperRestaurant({
  formData,
  setFormData,
  formError,
  setFormError,
  restrictedFields,
}) {
  const handleTextFieldChange = (field) => (eventOrValue) => {
    let value;

    // Check if eventOrValue is an event object with a target property
    if (
      eventOrValue &&
      typeof eventOrValue === "object" &&
      "target" in eventOrValue
    ) {
      value = eventOrValue.target.value;
    } else {
      value = eventOrValue; // In case of DatePicker, eventOrValue is directly the selected date
    }

    setFormData({
      ...formData,
      [field]: value,
    });

    setFormError({
      ...formError,
      [field]: "",
    });
  };

  const handleCuisineChange = (event) => {
    setFormData({
      ...formData,
      cuisineType: event.target.value,
    });
  };

  const handleSpecialRequirementsChange = (event) => {
    setFormData({
      ...formData,
      requirements: event.target.value,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid container spacing={2} style={{ marginTop: "2%" }}>
          <Grid item xs={12}>
            <Typography variant="h6">
              Fill in the information about your restaurant
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              id="restaurantName"
              label="Restaurant name"
              value={formData.restaurantName}
              onChange={handleTextFieldChange("restaurantName")}
              error={Boolean(formError.restaurantNameError)}
              helperText={formError.restaurantNameError}
            />
          </Grid>
          <Grid item xs={12}>
            <AddressAutocomplete
              formError={formError}
              setFormError={setFormError}
              setFormData={setFormData}
              formData={formData}
            />
          </Grid>
          <Grid item xs={3.9}>
            <TextField
              fullWidth
              required
              id="phone"
              label="Phone number"
              value={formData.restaurantPhone}
              onChange={handleTextFieldChange("restaurantPhone")}
              error={Boolean(formError.restaurantPhoneError)}
              helperText={formError.restaurantPhoneError}
            />
          </Grid>
          <Grid item xs={3.9}>
            <TextField
              fullWidth
              required
              id="email"
              label="E-mail"
              value={formData.restaurantEmail}
              onChange={handleTextFieldChange("restaurantEmail")}
              error={Boolean(formError.restaurantEmailError)}
              helperText={formError.restaurantEmailError}
            />
          </Grid>
          <Grid item xs={3.85}>
            <DatePicker
              sx={{ width: "100%" }}
              label="Opening date of your restaurant *"
              slotProps={{
                textField: {
                  helperText: formError.openingDateError,
                  error: Boolean(formError.openingDateError),
                },
              }}
              value={formData.openingDate}
              onChange={handleTextFieldChange("openingDate")}
              disabled={restrictedFields.openingDate}
            />
          </Grid>
          <Grid item xs={0.35} style={{ marginLeft: "-10" }}>
            <Tooltip
              title={
                "The opening date of your restaurant needs to be within the last six months or within the next three weeks. Please understand that this requirement is necessary, " +
                "because we aim to provide a platform exclusively for newly opened restaurants or those that have been part of FreshBites for at least a year. " +
                "This means that if your restaurant already exists for more than six months, we regret to inform you that you cannot register your restaurant on FreshBites."
              }
            >
              <HelpOutline fontSize="5" />
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="website"
              label="Website URL (optional)"
              value={formData.websiteURL}
              onChange={handleTextFieldChange("websiteURL")}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <MultiSelectComponent
                label="Cuisine Type *"
                selectedItems={formData.cuisineType}
                handleChange={handleCuisineChange}
                itemList={cuisineTypesList}
                error={Boolean(formError.cuisineTypeError)}
                helperText={formError.cuisineTypeError}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              id="description"
              label="Description to be displayed on restaurant entry"
              inputProps={{ maxLength: 400 }}
              value={formData.description}
              onChange={handleTextFieldChange("description")}
              error={Boolean(formError.descriptionError)}
              helperText={formError.descriptionError}
            />
          </Grid>
          <Grid item>
            <OpeningHoursComponent
              formData={formData}
              setFormData={setFormData}
              formError={formError}
              setFormError={setFormError}
            />
          </Grid>
          <Grid item xs={12}>
            <MultiSelectComponent
              label="Additional dietry offerings (optional)"
              selectedItems={formData.requirements}
              handleChange={handleSpecialRequirementsChange}
              itemList={specialRequirementsList}
            />
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
}
