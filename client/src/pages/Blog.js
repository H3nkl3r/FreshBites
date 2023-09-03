import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import SearchAutocomplete from "../components/common/SearchAutocomplete";

export default function Blog() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLearnMore = async (id) => {
    navigate(`/blog/${id}`);
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading indicator

  useEffect(() => {
    fetchData();
  }, [location.search]);

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const areaParam = queryParams.get("area");

      const params = new URLSearchParams({ type: "blog" });

      if (areaParam) {
        params.append("area", areaParam);
      }

      const response = await fetch(`http://localhost:3001/blog/get?${params}`);
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  function BlogItems() {
    return (
      <Container>
        <SearchAutocomplete page={"blog"} />
        <Box margin={"3%"} />
        <Grid container rowSpacing={4} columnSpacing={{ xs: 8 }}>
          {(loading ? Array.from(new Array(6)) : data).map((blog, index) => (
            <Grid item xs={6} key={index}>
              {loading ? (
                <Skeleton animation="wave" height={500} width={500} />
              ) : (
                <Card
                  sx={{
                    height: 500,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  key={index}
                >
                  <CardMedia
                    sx={{ height: 250, width: 1 }}
                    image={blog.image}
                  />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Grid item xs={12}>
                      <Typography variant="h3" style={{ marginBottom: 10 }}>
                        {blog.title.length > 40
                          ? blog.title
                              .substring(0, 40)
                              .split(/\s/)
                              .slice(0, -1)
                              .join(" ") + "..."
                          : blog.title}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        {blog.text.length > 100
                          ? blog.text
                              .substring(0, 100)
                              .split(/\s/)
                              .slice(0, -1)
                              .join(" ") + "..."
                          : blog.text}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        component="p"
                        style={{ justifyContent: "center" }}
                      >
                        by {blog.restaurantId.name}
                      </Typography>
                    </Grid>
                  </CardContent>
                  <CardActions
                    style={{
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleLearnMore(blog._id)}
                    >
                      Learn more
                    </Button>
                  </CardActions>
                </Card>
              )}
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="space-evenly"
      >
        <Grid item xs={12}>
          <Typography variant="h1">Get to know the new food spots</Typography>
        </Grid>
        <Grid item xs={12}>
          <BlogItems />
        </Grid>
      </Grid>
    </Container>
  );
}
