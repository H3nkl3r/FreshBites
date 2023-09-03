import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { AuthContext } from "../../utils/AuthProvider";
import { ReactComponent as LogoSVG } from "../../assets/images/FreshBitesLogoWeiß.svg";
import PersonIcon from "@mui/icons-material/Person";
import { LoginContext } from "../../utils/LoginProvider";

const pages = [
  { url: "/restaurants", label: "Restaurants" },
  { url: "/blog", label: "Blog" },
  { url: "/voucher", label: "Information" },
  { url: "/owners", label: "For Restaurant Owners" },
];

const buttonStyle = {
  fontSize: "1rem",
  color: "white",
  display: "block",
  "&:hover": {
    bgcolor: "primary.light",
  },
};

export default function Header() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const { handleLogout, isAuthenticated, user } = useContext(AuthContext);
  const { handleClickOpenLogin } = useContext(LoginContext);

  useEffect(() => {
    setAnchorElUser(null);
  }, [isAuthenticated]);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  const openFavorites = () => {
    navigate("/favorites");
    setAnchorElUser(false);
  };

  const handleUserManagement = () => {
    navigate("/userManagement");
    setAnchorElUser(false);
  };

  return (
    <Box sx={{ marginBottom: "1%" }}>
      <AppBar position="static">
        <Container maxWidth="xl" style={{ height: 100 }}>
          <Toolbar disableGutters>
            <Box
              sx={{
                my: 2,
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  width: 70,
                  display: "flex",
                }}
              >
                <LogoSVG />
              </Box>
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  fontFamily: "BlinkMacSystemFont",
                  fontWeight: 400,
                  color: "white",
                  textDecoration: "none",
                  fontSize: "2rem",
                  marginLeft: 2,
                }}
              >
                FreshBites
              </Typography>
              <Box
                sx={{
                  display: { md: "flex" },
                  marginLeft: 2,
                }}
              >
                {pages.map((page) => (
                  <Button
                    variant={"outlined"}
                    key={page.url}
                    component={Link}
                    to={page.url}
                    sx={buttonStyle}
                  >
                    {page.label}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box>
              {isAuthenticated() ? (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      sx={{
                        width: 55,
                        height: 55,
                        bgcolor: "primary.main",
                        border: 1,
                        borderColor: "primary.background",
                      }}
                    >
                      <PersonIcon sx={{ width: 50, height: 50 }} />
                    </Avatar>
                  </IconButton>
                </Tooltip>
              ) : (
                <Button sx={buttonStyle} onClick={handleClickOpenLogin}>
                  Login
                </Button>
              )}
              {isAuthenticated() ? (
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {user.role !== "OWNER" ? (
                    <MenuItem key={"favorites"} onClick={openFavorites}>
                      <Typography variant={"body2"} textAlign="center">
                        Favorites
                      </Typography>
                    </MenuItem>
                  ) : null}
                  <MenuItem key={"manageUser"} onClick={handleUserManagement}>
                    <Typography variant={"body2"} textAlign="center">
                      User profile
                    </Typography>
                  </MenuItem>
                  <MenuItem key={"logout"} onClick={handleLogout}>
                    <Typography variant={"body2"} textAlign="center">
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              ) : (
                <></>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
