import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SearchAutocomplete from "../components/common/SearchAutocomplete";

const bgImage =
  "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg";

const styles = {
  boxBg: {
    position: "relative",
    height: "73vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${bgImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "none", // No blur effect applied
      zIndex: -1,
    },
  },
  typographyCenter: {
    textAlign: "center",
    color: "black", // Changes the text color
  },
  flexCenter: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
  },
  milkyRectangle: {
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white
    backdropFilter: "blur(10px)", // Softening the background image
    padding: "1em", // Add some padding so the contents aren't on the edge of the rectangle
    borderRadius: "10px", // Round the corners of the rectangle
  },
};

export default function HomePage() {
  const { boxBg, typographyCenter, flexCenter, milkyRectangle } = styles;

  return (
    <Box sx={boxBg}>
      <Container>
        <Box sx={milkyRectangle}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                variant="h2"
                sx={{ ...typographyCenter, marginTop: "20px" }}
              >
                Welcome to FreshBites!
              </Typography>
              <Typography
                variant="h4"
                sx={{ ...typographyCenter, marginBottom: "20px" }}
              >
                Discover new restaurant openings in your area and enjoy
                exclusive discounts!
              </Typography>
              <SearchAutocomplete />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                sx={{ ...typographyCenter, marginBottom: "20px" }}
              >
                More Information
              </Typography>
              <Stack
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={flexCenter}>
                  <Button
                    variant={"contained"}
                    component={Link}
                    to="/voucher"
                    key="/voucher"
                    sx={{ color: "white", width: "100%" }}
                  >
                    for restaurant visitors
                  </Button>
                </Box>
                <Box sx={flexCenter}>
                  <Button
                    variant={"contained"}
                    component={Link}
                    to="/owners"
                    key="/owners"
                    sx={{ color: "white", width: "100%" }}
                  >
                    for restaurant owners
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
