import { createTheme } from "@mui/material/styles";

const palette = {
  primary: {
    main: "#4CAF50", // Green
    light: "#81c784", // light green
    dark: "#2e7d32", // dark green
  },
  secondary: {
    main: "#212121", // Black
    light: "#FFFFFF", // white
    medium: "#616161", // dark grey
  },
  warning: {
    main: "#FFC107", // Light Orange
  },
  error: {
    main: "#FF5722",
  },
  background: {
    default: "#F5F5F5", // Light Grey
  },
  action: {
    main: "#009688", // Teal as an accent color
  },
};

export const theme = createTheme({
  palette: palette,
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: "h1" },
          style: {
            fontSize: "5rem",
            color: palette.primary.main,
            textAlign: "center",
            letterSpacing: 4,
          },
        },
        {
          props: { variant: "h2" },
          style: {
            fontSize: "3rem",
            color: palette.primary.main,
            textAlign: "center",
            letterSpacing: 4,
          },
        },
        {
          props: { variant: "h3" },
          style: {
            fontSize: "2.5rem",
            color: palette.secondary.main,
            textAlign: "center",
          },
        },
        {
          props: { variant: "h4" },
          style: {
            fontSize: "1.8rem",
            color: palette.secondary.main,
            textAlign: "center",
            letterSpacing: 2,
          },
        },
        {
          props: { variant: "h5" },
          style: {
            fontSize: "1.3rem",
            color: palette.secondary.main,
          },
        },
        {
          props: { variant: "h6" },
          style: {
            fontSize: "1.2rem",
            color: palette.secondary.main,
          },
        },
        {
          props: { variant: "body1" },
          style: {
            fontSize: "1.7rem",
            fontWeight: "regular",
            color: palette.secondary.main,
          },
        },
        {
          props: { variant: "body2" },
          style: {
            fontSize: "1.2rem",
            fontWeight: "regular",
            color: palette.secondary.main,
          },
        },
        {
          props: { variant: "subtitle1" },
          style: {
            fontSize: "0.8rem",
            fontWeight: "light",
            color: palette.secondary.medium,
            fontStyle: "italic",
          },
        },
        {
          props: { variant: "subtitle2" },
          style: {
            fontSize: "0.9rem",
            fontWeight: "light",
            color: palette.secondary.medium,
          },
        },
      ],
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            backgroundColor: palette.primary.main,
            "&:hover": {
              backgroundColor: palette.primary.dark,
            },
            fontSize: "0.95rem",
            color: "white",
          },
        },
        {
          props: { variant: "text" },
          style: {
            color: palette.primary.main,
            "&:hover": {
              backgroundColor: palette.secondary.verylight,
            },
            fontSize: "0.95rem",
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            color: palette.primary.main,
            borderColor: palette.primary.main,
            "&:hover": {
              borderColor: palette.primary.main,
              backgroundColor: palette.secondary.verylight,
            },
            fontSize: "0.95rem",
          },
        },
        {
          props: { variant: "smallText" },
          style: {
            color: palette.primary.main,
            "&:hover": {
              backgroundColor: palette.secondary.verylight,
            },
            fontSize: "0.8rem",
          },
        },
      ],
    },
    MuiSelect: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            fontSize: "1rem",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: palette.primary.main,
            },
          },
        },
      ],
    },
  },
});
