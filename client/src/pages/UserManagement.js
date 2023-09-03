import * as React from "react";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Paper,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import MyRestaurants from "../components/owner/MyRestaurants";
import MySubscription from "../components/visitor/MySubscription";
import { AuthContext } from "../utils/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import PersonalInformation from "../components/user/PersonalInformation";

const API_BASE_URL = "http://localhost:3001";

export default function UserManagement() {
  const theme = useTheme();
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [savedUserAccount, setSavedUserAccount] = useState({
    lastname: "",
    firstname: "",
    email: "",
    userId: "",
    reviewCounter: 0,
    role: "",
  });
  const [submitting, setSubmitting] = useState(false);
  // Validation User Account
  const [userAccountErrors, setUserAccountErrors] = useState({
    firstnameError: "",
    lastnameError: "",
    emailError: "",
  });
  const {
    fetchWithToken,
    isAuthenticated,
    loading: authLoading,
    user,
    setError,
    handleLogout,
  } = useContext(AuthContext);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [userAccount, setUserAccount] = useState({
    lastname: "",
    firstname: "",
    email: "",
    userId: "",
    reviewCounter: 0,
    role: "",
  });
  const [edit, setEdit] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    repeatPassword: "",
  });
  const [passwordDataErrors, setPasswordDataErrors] = useState({
    newPasswordError: "",
    repeatPasswordError: "",
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        navigate("/");
      } else {
        loadUser();
        if (user.role === "OWNER") {
          loadRestaurant();
        }
      }
    }
  }, [authLoading, isAuthenticated]);

  const loadUser = async () => {
    try {
      const response = await fetchWithToken(`http://localhost:3001/user/get`);
      const jsonData = await response.json();
      const userData = jsonData.user;
      setUserAccount({
        lastname: userData.lastName,
        firstname: userData.firstName,
        email: userData.email,
        userId: userData._id,
        reviewCounter: userData.reviewCounter,
        role: userData.role,
      });
      setSavedUserAccount({
        lastname: userData.lastName,
        firstname: userData.firstName,
        email: userData.email,
        userId: userData._id,
        reviewCounter: userData.reviewCounter,
        role: userData.role,
      });
      if (user.role !== "OWNER") {
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const loadRestaurant = async () => {
    const paramsRestaurant = new URLSearchParams({ ownerId: user._id });
    const restaurant = await fetchWithToken(
      `${API_BASE_URL}/restaurant/get?${paramsRestaurant}`
    );

    try {
      const jsonData = await restaurant.json();
      setRestaurantInfo({
        restaurantId: jsonData._id,
        restaurantName: jsonData.name,
        restaurantImage: jsonData.images[0],
      });
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  function ReviewCounter() {
    const reviewProgress =
      userAccount.reviewCounter < 3
        ? (userAccount.reviewCounter * 100) / 3
        : 100;
    return (
      <Paper elevation={3}>
        <Container sx={{ display: "flex", flexDirection: "column" }}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              sx={{ textAlign: "center", marginBottom: 2, marginTop: 2 }}
            >
              Your Review Counter
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography ariant="h5" sx={{ textAlign: "center" }}>
              {userAccount.reviewCounter}/3
            </Typography>
          </Grid>
          <Grid item sx={{ textAlign: "center" }}>
            <CircularProgress
              variant="determinate"
              sx={{ color: theme.palette.primary.main }}
              value={reviewProgress}
            />
          </Grid>

          {userAccount.reviewCounter < 3 ? (
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <Typography variant="body2" sx={{ textAlign: "center" }}>
                Write {3 - userAccount.reviewCounter} more review(s) to receive
                a free discount for a restaurant of your choice.
              </Typography>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} sx={{ marginBottom: 2, textAlign: "center" }}>
                <Typography variant="body2">
                  {" "}
                  Get your free discount now!
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  component={Link}
                  to={`/restaurants`}
                  sx={{ justifyContent: "center", marginBottom: 2 }}
                >
                  Search for restaurants
                </Button>
              </Grid>
            </>
          )}
        </Container>
      </Paper>
    );
  }

  function DeleteAccount() {
    return (
      <Container sx={{ display: "flex" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              variant="outlined"
              sx={{
                color: theme.palette.error.main,
                borderColor: theme.palette.error.main,
                "&:hover": {
                  borderColor: theme.palette.error.main,
                },
              }}
              onClick={() => setOpenDelete(true)}
            >
              Delete your account
            </Button>
          </Grid>
          <Grid item>
            <DeleteDialog />
          </Grid>
        </Grid>
      </Container>
    );
  }

  function DeleteDialog() {
    const handleDelete = async () => {
      try {
        await fetchWithToken(`http://localhost:3001/user/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        handleLogout();
        window.location.reload();
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    const handleClose = () => {
      setOpenDelete(false);
    };
    return (
      <Dialog open={openDelete} onClose={handleClose}>
        {userAccount.role === "OWNER" ? (
          <>
            <DialogTitle sx={{ textAlign: "center" }}>
              You need to delete your restaurant before deleting your user
              account.
            </DialogTitle>
            <DialogActions sx={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                component={Link}
                to={`/managerestaurant/${restaurantInfo.restaurantId}`}
              >
                Edit restaurant
              </Button>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ marginLeft: 1, width: 170 }}
              >
                Cancel
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle sx={{ textAlign: "center" }}>
              Are you sure you want to leave FreshBites?
            </DialogTitle>
            <DialogActions
              sx={{ justifyContent: "center", flexDirection: "column" }}
            >
              <Button
                variant="contained"
                onClick={handleClose}
                sx={{ width: 350 }}
              >
                No, I want to stay with Freshbites
              </Button>
              <Button
                variant="outlined"
                onClick={handleDelete}
                sx={{ marginTop: 2, width: 350 }}
              >
                Yes, I want to leave
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        {loading ? (
          <Skeleton
            animation="wave"
            style={{ width: "900px", height: "300px" }}
          />
        ) : (
          <>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="h1">
                {" "}
                Hello {savedUserAccount.firstname}!
              </Typography>
            </Grid>
            <Grid item>
              <Container
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Grid container spacing={4}>
                  {userAccount.role !== "OWNER" ? (
                    <Grid item xs={12}>
                      <ReviewCounter />
                    </Grid>
                  ) : null}
                  <Grid item xs={12}>
                    <PersonalInformation
                      userAccount={userAccount}
                      edit={edit}
                      userAccountErrors={userAccountErrors}
                      setSavedUserAccount={setSavedUserAccount}
                      savedUserAccount={savedUserAccount}
                      setEdit={setEdit}
                      changePassword={changePassword}
                      submitting={submitting}
                      setSubmitting={setSubmitting}
                      setUserAccount={setUserAccount}
                      setUserAccountErrors={setUserAccountErrors}
                      setChangePassword={setChangePassword}
                      fetchWithToken={fetchWithToken}
                      passwordData={passwordData}
                      setPasswordData={setPasswordData}
                      passwordDataErrors={passwordDataErrors}
                      setPasswordDataErrors={setPasswordDataErrors}
                      setError={setError}
                    />
                  </Grid>
                  {userAccount.role !== "OWNER" ? (
                    <Grid item xs={12}>
                      <MySubscription
                        userRole={userAccount.role}
                        userId={userAccount.userId}
                      />
                    </Grid>
                  ) : null}
                  {userAccount.role === "OWNER" ? (
                    <Grid item xs={12}>
                      <MyRestaurants restaurantInfo={restaurantInfo} />
                    </Grid>
                  ) : null}
                  <Grid item xs={12}>
                    <DeleteAccount />
                  </Grid>
                </Grid>
              </Container>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}
