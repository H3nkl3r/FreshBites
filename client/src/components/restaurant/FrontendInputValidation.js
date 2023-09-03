import * as Yup from "yup";
import { addWeeks, isAfter, isBefore, subMonths } from "date-fns";

export const checkIfEmailExists = async (email) => {
  try {
    const response = await fetch(
      `http://localhost:3001/user/checkExisting/?email=${email}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.userExists; // Assuming the response contains a property "exists" indicating if the email exists
    } else {
      throw new Error("Failed to fetch");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const validationUserAccount = Yup.object().shape({
  lastname: Yup.string().required("Lastname is required"),
  firstname: Yup.string().required("Firstname is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Please use a valid email address.")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address.")
    .test("unique-email", "Email already exists", async function (value) {
      const emailExists = await checkIfEmailExists(value); // Function to query the database
      return !emailExists; // Return true if email does not exist
    }),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password needs to have at least 8 characters"),
  repeatPassword: Yup.string()
    .required("Repeat password is required")
    .oneOf([Yup.ref("password"), null], "Passwords do not match"),
  agreedToTermsOfUse: Yup.boolean()
    .required("Required")
    .oneOf([true], "Required"),
});

const sixMonthsAgo = subMonths(new Date(), 6);

export const validationRestaurant = Yup.object()
  .shape({
    restaurantName: Yup.string().required("Please enter a restaurant name"),
    address: Yup.object().shape({
      street: Yup.string().required("Please enter a street"),
      houseNumber: Yup.string().required("Please enter a number"),
      zip: Yup.string().required("Please enter a zip code"),
      city: Yup.string().required("Please enter a city"),
      country: Yup.string().required("Please enter a country"),
    }),
    restaurantPhone: Yup.string().required("Please enter a phone number"),
    restaurantEmail: Yup.string()
      .required("Please enter a valid email address")
      .email("Please enter a valid email address"),
    description: Yup.string().required("Please enter a restaurant description"),
    cuisineType: Yup.array().min(1, "Please select your cuisine type(s)"),
    openingDate: Yup.string()
      .required("Please enter the opening date of your restaurant")
      .test(
        "validate-opening-date",
        "Opening date must not be longer than 6 months ago and not more than 3 weeks in the future",
        function (value) {
          const openingDate = new Date(value); // Convert openingDate to a Date object
          const sixMonthsAgo = subMonths(new Date(), 6); // Calculate the date 6 months ago
          const currentDate = new Date(); // Current date
          const maxDate = addWeeks(currentDate, 3); // Calculate the date 3 weeks from now

          if (
            isBefore(openingDate, sixMonthsAgo) ||
            isAfter(openingDate, maxDate)
          ) {
            if (isBefore(openingDate, sixMonthsAgo)) {
              return this.createError({
                path: "openingDate",
                message: "Opening date must not be more than 6 months ago",
              });
            } else {
              return this.createError({
                path: "openingDate",
                message: "Opening date must be within the next 3 weeks",
              });
            }
          }

          return true; // validation passes
        }
      ),
  })
  .test(
    "validate-opening-hours",
    "Please select opening or closing hours",
    function (value) {
      const { closedDays, openingHours } = value;
      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      for (let day of daysOfWeek) {
        const isClosed = closedDays[`closed${day}`];
        const openTime = openingHours[`open${day}`];
        const closeTime = openingHours[`close${day}`];

        if (!isClosed && (!openTime || !closeTime)) {
          return this.createError({
            path: "openingHours",
            message: `Please select opening hours for ${day}`,
          });
        }
      }

      return true; // validation passes
    }
  );

export const validationUploads = Yup.object().shape({
  selectedImages: Yup.array().min(
    1,
    "Upload at least 1 image of your restaurant"
  ),
  selectedMenu: Yup.array().min(1, "Upload your restaurant menu"),
});

export const validateContent = (
  formData,
  validationSchema,
  formErrors,
  setFormErrors,
  onSuccess = () => null,
  onFailure = () => null,
  executeFinally = () => null
) => {
  validationSchema
    .validate(formData, { abortEarly: false })
    .then(() => {
      onSuccess();
    })
    .catch((errors) => {
      const updatedErrors = JSON.parse(JSON.stringify(formErrors));

      // Clear existing errors
      for (let key in updatedErrors) {
        if (
          typeof updatedErrors[key] === "object" &&
          updatedErrors[key] !== null
        ) {
          for (let nestedKey in updatedErrors[key]) {
            updatedErrors[key][nestedKey] = "";
          }
        } else {
          updatedErrors[key] = "";
        }
      }

      // Set new errors
      errors.inner.forEach((error) => {
        const pathParts = error.path.split(".");
        if (
          pathParts.length > 1 &&
          typeof updatedErrors[pathParts[0]] === "object" &&
          updatedErrors[pathParts[0]] !== null
        ) {
          updatedErrors[pathParts[0]][pathParts[1] + "Error"] = error.message;
        } else {
          updatedErrors[error.path + "Error"] = error.message;
        }
      });
      setFormErrors(updatedErrors);
      onFailure();
    })
    .finally(executeFinally);
};
