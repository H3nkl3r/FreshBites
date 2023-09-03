import {
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
import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SuccessStories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading indicator

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({ type: "successStory" });
      const response = await fetch(`http://localhost:3001/blog/get?${params}`);
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography variant="h2">Success Stories</Typography>
        </Grid>
        {(loading ? Array.from(new Array(3)) : data.slice(0, 3)).map(
          (story, index) => (
            <Grid item xs={4} key={index}>
              {loading ? (
                <Skeleton animation="wave" height={400} />
              ) : (
                <Card
                  sx={{
                    height: 500,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  key={index}
                >
                  <CardMedia sx={{ height: 140 }} image={story.image} />
                  <CardContent>
                    <Typography variant={"h3"} style={{ marginTop: "3%" }}>
                      {story.title.length > 40
                        ? story.title.slice(0, 40) + "..."
                        : story.title}
                    </Typography>
                    <Typography variant="body2" style={{ margin: "3%" }}>
                      {story.text.slice(0, 183) + "..."}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ textAlign: "center", justifyContent: "center" }}
                  >
                    <Button
                      size="small"
                      component={Link}
                      to={`/blog/${story._id}`}
                    >
                      Learn more
                    </Button>
                  </CardActions>
                </Card>
              )}
            </Grid>
          )
        )}
      </Grid>
    </Container>
  );
}
