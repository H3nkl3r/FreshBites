import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  Tab,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import moment from "moment";
import UploadStepperRestaurant from "../components/restaurant/UploadStepperRestaurant";
import {
  validateContent,
  validationRestaurant,
  validationUploads,
} from "../components/restaurant/FrontendInputValidation";
import RestaurantInformationStepperRestaurant from "../components/restaurant/RestaurantInformationStepperRestaurant";
import CreateBlogpost from "./CreateBlogpost";
import MyBlogpost from "../components/restaurant/MyBlogpost";

import { AuthContext } from "../utils/AuthProvider";

const API_BASE_URL = "http://localhost:3001";

export default function RestaurantManagement() {
  const theme = useTheme();
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const {
    fetchWithToken,
    loading: authLoading,
    setError,
    user,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openDeleteInfo, setOpenDeleteInfo] = useState(false);
  const [updateSuccessful, setUpdateSuccessful] = useState(false);
  const [value, setValue] = useState("1");
  const [blogpostExists, setBlogpostExists] = useState(false);
  const [blogpost, setBlogpost] = useState("");
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [restaurantInfoErrors, setRestaurantInfoErrors] = useState({
    restaurantNameError: "",
    address: {
      street: "",
      houseNumber: "",
      zip: "",
      city: "",
      country: "",
      latitude: 0,
      longitude: 0,
    },
    restaurantPhoneError: "",
    restaurantEmailError: "",
    openingDateError: "",
    cuisineTypeError: "",
    descriptionError: "",
    openingHoursError: "",
    closedDaysError: "",
  });

  // Upload state
  const [uploads, setUploads] = useState({
    selectedImages: [],
    selectedMenu: [], // Wrap the menu into an array to facilitate validation with Yup library
  });

  // Validation of uploads state
  const [uploadErrors, setUploadErrors] = useState({
    selectedImagesError: "",
    selectedMenuError: "",
  });

  useEffect(() => {
    setLoading(true);
    if (!authLoading) {
      checkEligibilityToEdit().then((eligible) => {
        if (eligible) {
          loadRestaurant()
            .then(() => loadBlogpost())
            .then(() => setLoading(false));
        } else {
          setError("You do not have permission to do this.");
        }
      });
    }
  }, [authLoading, user]);

  const checkEligibilityToEdit = async () => {
    const params = new URLSearchParams({ restaurantId });
    const response = await fetchWithToken(
      `${API_BASE_URL}/user/restaurantPermission?${params}`
    );
    if (response) {
      const jsonData = await response.json();
      return jsonData.eligibleToEdit;
    } else {
      return false;
    }
  };

  const loadRestaurant = async () => {
    const params = new URLSearchParams({ restaurantId });
    const response = await fetchWithToken(
      `${API_BASE_URL}/restaurant/get?${params}`
    );

    if (response) {
      const jsonData = await response.json();
      setRestaurantInfo({
        restaurantName: jsonData.name,
        address: {
          label: `${jsonData.address.street} ${jsonData.address.houseNumber}, ${jsonData.address.zip} ${jsonData.address.city}, ${jsonData.address.country}`,
          street: jsonData.address.street,
          houseNumber: jsonData.address.houseNumber,
          zip: jsonData.address.zip,
          city: jsonData.address.city,
          country: jsonData.address.country,
          latitude: jsonData.address.latitude,
          longitude: jsonData.address.longitude,
        },
        restaurantPhone: jsonData.phone,
        restaurantEmail: jsonData.email,
        openingDate: moment(jsonData.openingDate),
        websiteURL: jsonData.website,
        cuisineType: jsonData.cuisineType,
        description: jsonData.description,
        requirements: jsonData.specialRequirements,
        closedDays: {
          closedMonday:
            !jsonData.openingHours.openMonday &&
            !jsonData.openingHours.closeMonday,
          closedTuesday:
            !jsonData.openingHours.openTuesday &&
            !jsonData.openingHours.closeTuesday,
          closedWednesday:
            !jsonData.openingHours.openWednesday &&
            !jsonData.openingHours.closeWednesday,
          closedThursday:
            !jsonData.openingHours.openThursday &&
            !jsonData.openingHours.closeThursday,
          closedFriday:
            !jsonData.openingHours.openFriday &&
            !jsonData.openingHours.closeFriday,
          closedSaturday:
            !jsonData.openingHours.openSaturday &&
            !jsonData.openingHours.closeSaturday,
          closedSunday:
            !jsonData.openingHours.openSunday &&
            !jsonData.openingHours.closeSunday,
        },
        openingHours: {
          openMonday: jsonData.openingHours.openMonday,
          closeMonday: jsonData.openingHours.closeMonday,
          openTuesday: jsonData.openingHours.openTuesday,
          closeTuesday: jsonData.openingHours.closeTuesday,
          openWednesday: jsonData.openingHours.openWednesday,
          closeWednesday: jsonData.openingHours.closeWednesday,
          openThursday: jsonData.openingHours.openThursday,
          closeThursday: jsonData.openingHours.closeThursday,
          openFriday: jsonData.openingHours.openFriday,
          closeFriday: jsonData.openingHours.closeFriday,
          openSaturday: jsonData.openingHours.openSaturday,
          closeSaturday: jsonData.openingHours.closeSaturday,
          openSunday: jsonData.openingHours.openSunday,
          closeSunday: jsonData.openingHours.closeSunday,
        },
      });

      const menuResponse = await fetch(jsonData.menuURL);
      const menuBlob = await menuResponse.blob();

      let imageBlobs = [];
      jsonData.images.map(async (imageURL) => {
        const imageReponse = await fetch(imageURL);
        const imageBlob = await imageReponse.blob();
        imageBlobs.push(imageBlob);
      });
      // Assuming you have a newSelectedImages array with the updated selected images
      setUploads((prevState) => ({
        ...prevState,
        selectedImages: imageBlobs,
        selectedMenu: [menuBlob],
      }));
    }
  };

  const loadBlogpost = async () => {
    const params = new URLSearchParams({ restaurantId: restaurantId });
    const response = await fetchWithToken(
      `http://localhost:3001/blog/getByRestaurant?${params}`
    );
    if (response) {
      const jsonData = await response.json();
      if (!jsonData.blog) {
        setBlogpostExists(false);
        return false;
      }
      setBlogpostExists(true);
      setBlogpost(jsonData.blog);
      return jsonData.blog;
    }
  };
  const handleDeleteBlogpost = async () => {
    setSubmitting(true);
    const deleteResponse = await fetchWithToken(`${API_BASE_URL}/blog/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blogpostId: blogpost._id,
        restaurantId: restaurantId,
      }),
    });
    if (deleteResponse) {
      setBlogpostExists(false);
    }
    setSubmitting(false);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const submit = async () => {
      const informationResponse = await fetchWithToken(
        `${API_BASE_URL}/restaurant/updateInformation`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: restaurantId,
            phone: restaurantInfo.restaurantPhone,
            website: restaurantInfo.websiteURL,
            cuisineType: restaurantInfo.cuisineType,
            name: restaurantInfo.restaurantName,
            address: restaurantInfo.address,
            description: restaurantInfo.description,
            openingHours: restaurantInfo.openingHours,
            specialRequirements: restaurantInfo.requirements,
            email: restaurantInfo.restaurantEmail,
            openingDate: restaurantInfo.openingDate,
          }),
        }
      );

      // Image Upload
      const imageForm = new FormData();
      imageForm.append("restaurantId", restaurantId);
      uploads.selectedImages.forEach((image) => {
        imageForm.append("images", image);
      });

      const imageResponse = await fetchWithToken(
        `${API_BASE_URL}/restaurant/uploadImages`,
        {
          method: "POST",
          body: imageForm,
        }
      );

      // Menu Upload
      const menuForm = new FormData();
      menuForm.append("restaurantId", restaurantId);
      menuForm.append("menu", uploads.selectedMenu[0]); // We guarantee that there is only 1 file stored in the array. Remember that we needed to wrap this inside an array
      const menuResponse = await fetchWithToken(
        `${API_BASE_URL}/restaurant/uploadMenu`,
        {
          method: "POST",
          body: menuForm,
        }
      );
      setSubmitting(false);
      if (informationResponse && imageResponse && menuResponse) {
        setUpdateSuccessful(true);
      }
    };

    await validateContent(
      restaurantInfo,
      validationRestaurant,
      restaurantInfoErrors,
      setRestaurantInfoErrors,
      () =>
        validateContent(
          uploads,
          validationUploads,
          uploadErrors,
          setUploadErrors,
          submit,
          undefined,
          undefined
        ),
      () => setSubmitting(false),
      undefined
    );
  };

  const handleDeleteRestaurant = async () => {
    setSubmitting(true);
    setOpenDeleteInfo(false);
    const deleteResponse = await fetchWithToken(
      `${API_BASE_URL}/restaurant/delete`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurantId,
        }),
      }
    );
    if (deleteResponse) {
      navigate("/userManagement");
      window.location.reload();
    }
    setSubmitting(false);
  };

  const handleCancel = () => {
    window.location.reload();
  };

  const DeleteInfoDialog = () => {
    return (
      <Dialog open={openDeleteInfo} onClose={() => setOpenDeleteInfo(false)}>
        <DialogTitle>
          <Typography variant={"h5"}>Please confirm your action.</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item>
              <Alert style={{ width: "100%" }} severity="warning">
                You are about to delete your restaurant.
              </Alert>
            </Grid>
            <Grid item>
              <Typography variant={"body2"}>
                Proceeding with this action will delete your restaurant and all
                related data (reviews, blogposts, vouchers, ...) from
                FreshBites. Your subscription for this restaurant will be
                cancelled.
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={"body2"}>
                After deletion, your account will transform into a regular free
                account for restaurant visitors.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Button onClick={() => setOpenDeleteInfo(false)}>Cancel</Button>
            <LoadingButton
              loading={submitting}
              variant="outlined"
              onClick={handleDeleteRestaurant}
              style={{
                color: theme.palette.error.main,
                borderColor: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: theme.palette.error.main,
                },
              }}
            >
              Delete Restaurant
            </LoadingButton>
          </Box>
        </DialogActions>
      </Dialog>
    );
  };

  return loading ? (
    <Skeleton animation="wave" height={150} />
  ) : (
    <Container>
      <TabContext value={value}>
        <Grid container>
          <Grid item>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleTabChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Restaurant Information" value="1" />
                <Tab label="Uploads" value="2" />
                <Tab label="Blogpost" value="3" />
              </TabList>
            </Box>
          </Grid>
          <Grid item>
            <Grid container direction="column" marginTop="3%">
              <TabPanel value="1">
                <Grid item>
                  <RestaurantInformationStepperRestaurant
                    formData={restaurantInfo}
                    setFormData={setRestaurantInfo}
                    formError={restaurantInfoErrors}
                    setFormError={setRestaurantInfoErrors}
                    restrictedFields={{ openingDate: true }}
                  />
                </Grid>
                <Grid item>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                    }}
                  >
                    <Button variant="outlined" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <LoadingButton
                      loading={submitting}
                      variant="outlined"
                      style={{
                        color: theme.palette.error.main,
                        borderColor: theme.palette.error.main,
                        "&:hover": {
                          backgroundColor: theme.palette.error.main,
                        },
                      }}
                      onClick={() => setOpenDeleteInfo(true)}
                    >
                      Delete Restaurant
                    </LoadingButton>
                    <LoadingButton
                      variant="outlined"
                      loading={submitting}
                      onClick={handleSubmit}
                    >
                      Submit
                    </LoadingButton>
                  </Box>
                </Grid>
              </TabPanel>
              <TabPanel value="2">
                <Grid item>
                  <UploadStepperRestaurant
                    formData={uploads}
                    setFormData={setUploads}
                    formError={uploadErrors}
                    setFormError={setUploadErrors}
                  />
                </Grid>
                <Grid item>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                    }}
                  >
                    <Button variant="outlined" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <LoadingButton
                      loading={submitting}
                      variant="outlined"
                      style={{
                        color: theme.palette.error.main,
                        borderColor: theme.palette.error.main,
                        "&:hover": {
                          backgroundColor: theme.palette.error.main,
                        },
                      }}
                      onClick={() => setOpenDeleteInfo(true)}
                    >
                      Delete Restaurant
                    </LoadingButton>
                    <LoadingButton
                      variant="outlined"
                      loading={submitting}
                      onClick={handleSubmit}
                    >
                      Submit
                    </LoadingButton>
                  </Box>
                </Grid>
              </TabPanel>
              <TabPanel value="3">
                <Grid item>
                  {!blogpostExists ? (
                    <CreateBlogpost />
                  ) : (
                    <Grid container alignItems="center" direction="column">
                      <Grid item xs={12}>
                        <MyBlogpost blogpost={blogpost} />
                      </Grid>
                      <Grid item>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "1rem",
                          }}
                        >
                          <LoadingButton
                            loading={submitting}
                            variant="outlined"
                            onClick={handleDeleteBlogpost}
                            color="error"
                          >
                            delete blogpost
                          </LoadingButton>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </TabPanel>
              <Grid item>
                {updateSuccessful && (
                  <Grid item>
                    <Alert severity="success">
                      Your restaurant update has been successful.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </TabContext>
      <DeleteInfoDialog />
    </Container>
  );
}
