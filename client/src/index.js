import React from "react";
import ReactDOM from "react-dom/client";
import AuthProvider from "./utils/AuthProvider";
import { RouterProvider } from "react-router-dom";
import { theme } from "./styles/ThemeProvider";
import { ThemeProvider } from "@mui/material";
import { router } from "./Router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </AuthProvider>
);
