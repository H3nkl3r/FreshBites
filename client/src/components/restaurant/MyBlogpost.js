import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function MyBlogpost({ blogpost }) {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", marginTop: 2 }}
                >
                  Your Blogpost
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ display: "flex" }}>
                  <CardMedia
                    component="img"
                    src={blogpost.image}
                    alt={blogpost.title}
                    heigth="200"
                    sx={{ width: 280, height: 200 }}
                  />
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1">
                        {blogpost.title}
                      </Typography>
                      <Typography variant="body2"></Typography>
                    </CardContent>
                  </Box>
                  <CardActions
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: 700,
                    }}
                  >
                    {}
                    <Button
                      variant="outlined"
                      component={Link}
                      to={`/blog/${blogpost._id}`}
                    >
                      View blogpost
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center", marginBottom: 2 }}>
                <Tooltip disableFocusListener title="Coming soon" arrow>
                  <span>
                    <Button variant="contained" disabled={true}>
                      Add Blogpost (Feature to come)
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Grid>
    </Grid>
  );
}
