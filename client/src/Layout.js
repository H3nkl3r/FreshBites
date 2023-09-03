import * as React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Box from "@mui/material/Box";
import { MyBreadcrumb } from "./components/common/Breadcrumbs";
import ErrorDialog from "./components/common/ErrorDialog";
import LoginProvider from "./utils/LoginProvider";
import { Container, ThemeProvider } from "@mui/material";
import { theme } from "./styles/ThemeProvider";

export default function Layout() {
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <LoginProvider>
          <Header />
          <Container maxWidth="xl">
            <MyBreadcrumb />
          </Container>
          <Outlet />
          <ErrorDialog />
          <Footer />
        </LoginProvider>
      </ThemeProvider>
    </Box>
  );
}
