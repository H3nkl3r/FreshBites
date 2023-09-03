import * as React from "react";
import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import UserAccountStepperRestaurant from "../components/restaurant/UserAccountStepperRestaurant.js";
import RestaurantInformationStepperRestaurant from "../components/restaurant/RestaurantInformationStepperRestaurant.js";
import UploadStepperRestaurant from "../components/restaurant/UploadStepperRestaurant";
import PaymentStepperRestaurant from "../components/restaurant/PaymentStepperRestaurant";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  validateContent,
  validationRestaurant,
  validationUploads,
  validationUserAccount,
} from "../components/restaurant/FrontendInputValidation";
import { AuthContext } from "../utils/AuthProvider";

const steps = ["User Account", "Restaurant Information", "Uploads", "Payment"];

export default function CreateRestaurant() {
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { handleRegister, fetchWithToken, setError, user } =
    useContext(AuthContext);
  const [hideContent, setHideContent] = useState(true);

  useEffect(() => {
    if (user && user.email !== userAccount.email) {
      setHideContent(true);
      setError(
        "It is not possible to register a restaurant with an existing account. Please sign out and try again."
      );
    } else {
      setHideContent(false);
    }
  }, [user]);

  // User Account props
  const [userAccount, setUserAccount] = useState({
    lastname: "",
    firstname: "",
    email: "",
    password: "",
    repeatPassword: "",
    agreedToTermsOfUse: false,
  });

  // Validation User Account
  const [userAccountErrors, setUserAccountErrors] = useState({
    passwordError: "",
    repeatPasswordError: "",
    lastnameError: "",
    firstnameError: "",
    emailError: "",
    agreedToTermsOfUseError: "",
  });

  const [restaurantInfoErrors, setRestaurantInfoErrors] = useState({
    restaurantNameError: "",
    address: {
      streetError: "",
      houseNumberError: "",
      zipError: "",
      cityError: "",
      countryError: "",
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
    imageError: "",
    menuError: "",
  });

  const [restaurantInfo, setRestaurantInfo] = useState({
    restaurantName: "",
    address: {
      street: "",
      houseNumber: "",
      zip: "",
      city: "",
      country: "",
      latitude: 0,
      longitude: 0,
    },
    restaurantPhone: "",
    restaurantEmail: "",
    openingDate: "",
    websiteURL: "",
    cuisineType: [],
    description: "",
    requirements: [],
    closedDays: {
      closedMonday: false,
      closedTuesday: false,
      closedWednesday: false,
      closedThursday: false,
      closedFriday: false,
      closedSaturday: false,
      closedSunday: false,
    },
    openingHours: {
      openMonday: null,
      closeMonday: null,
      openTuesday: null,
      closeTuesday: null,
      openWednesday: null,
      closeWednesday: null,
      openThursday: null,
      closeThursday: null,
      openFriday: null,
      closeFriday: null,
      openSaturday: null,
      closeSaturday: null,
      openSunday: null,
      closeSunday: null,
    },
  });

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <UserAccountStepperRestaurant
            formData={userAccount}
            setFormData={setUserAccount}
            formError={userAccountErrors}
            setFormError={setUserAccountErrors}
            restrictedFields={{}}
          />
        );
      case 1:
        return (
          <RestaurantInformationStepperRestaurant
            formData={restaurantInfo}
            setFormData={setRestaurantInfo}
            formError={restaurantInfoErrors}
            setFormError={setRestaurantInfoErrors}
            restrictedFields={{}}
          />
        );
      case 2:
        return (
          <UploadStepperRestaurant
            formData={uploads}
            setFormData={setUploads}
            formError={uploadErrors}
            setFormError={setUploadErrors}
          />
        );
      case 3:
        return <PaymentStepperRestaurant />;
    }
  };
  const incrementStep = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  const handleNext = async () => {
    switch (activeStep) {
      case 0:
        await validateContent(
          userAccount,
          validationUserAccount,
          userAccountErrors,
          setUserAccountErrors,
          incrementStep
        );
        break;
      case 1:
        await validateContent(
          restaurantInfo,
          validationRestaurant,
          restaurantInfoErrors,
          setRestaurantInfoErrors,
          incrementStep
        );
        break;
      case 2:
        await validateContent(
          uploads,
          validationUploads,
          uploadErrors,
          setUploadErrors,
          incrementStep
        );
        break;
    }
  };

  const finishRegistration = async () => {
    try {
      await setSubmitting(true);
      const role = "OWNER";
      const userAndToken = await handleRegister(
        userAccount.email,
        userAccount.password,
        userAccount.firstname,
        userAccount.lastname,
        role,
        undefined
      );
      const userId = userAndToken.user._id;
      const token = userAndToken.token;

      const restaurantResponse = await fetch(
        "http://localhost:3001/restaurant/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
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
            owner: userId,
          }),
        }
      );

      const restaurantData = await restaurantResponse.json();
      const restaurantId = restaurantData.restaurantId;

      // Image Upload
      const imageForm = new FormData();
      imageForm.append("restaurantId", restaurantId);
      uploads.selectedImages.forEach((image) => {
        imageForm.append("images", image);
      });
      const imageResponse = await fetch(
        "http://localhost:3001/restaurant/uploadImages/",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: imageForm,
        }
      );

      // Menu Upload
      const menuForm = new FormData();
      menuForm.append("restaurantId", restaurantId);
      menuForm.append("menu", uploads.selectedMenu[0]); // We guarantee that there is only 1 file stored in the array. Remember that we needed to wrap this inside an array
      const menuResponse = await fetch(
        "http://localhost:3001/restaurant/uploadMenu/",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: menuForm,
        }
      );

      if (restaurantResponse.ok && imageResponse.ok && menuResponse.ok) {
        // Pay
        const paymentResponse = await fetchWithToken(
          "http://localhost:3001/payment/createRestaurantPaymentSession",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: restaurantId,
            }),
          }
        );

        const { url } = await paymentResponse.json();
        window.location.href = url;
      } else {
        setError(
          "An error occurred when trying to create your restaurant. Please try again later."
        );
      }
    } catch (error) {
      setError("An unknown error occurred.");
    } finally {
      await setSubmitting(false);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return hideContent ? (
    <Skeleton animation="wave" height={150} />
  ) : (
    <Container>
      <Paper sx={{ width: "100%", mb: 2, p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <>
          <Typography variant="body" sx={{ mt: 2, mb: 1 }}>
            {getStepContent(activeStep)}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mt: 1, ml: 1 }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <LoadingButton
                loading={submitting}
                variant="contained"
                color="primary"
                onClick={finishRegistration}
                sx={{ mt: 1, ml: 1 }}
              >
                Subscribe
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ mt: 1, ml: 1 }}
              >
                Next
              </Button>
            )}
          </Box>
        </>
      </Paper>
    </Container>
  );
}
