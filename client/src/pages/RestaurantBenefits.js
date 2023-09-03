import * as React from "react";
import { useContext } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Groups2, Reviews, Search } from "@mui/icons-material/";
import { Link } from "react-router-dom";
import PricingModel from "../components/information/PricingModel";
import SuccessStories from "../components/blog/SuccessStories";
import { AuthContext } from "../utils/AuthProvider";

export default function RestaurantBenefits() {
  const { user } = useContext(AuthContext);

  const benefits = [
    {
      icon: (
        <Groups2
          sx={{
            width: 70,
            height: 70,
          }}
        />
      ),
      title: "Attract target audience",
      text: "FreshBites brings together newly opened restaurants like yours and food enthusiasts looking for new dining experiences.",
    },
    {
      icon: (
        <Search
          sx={{
            width: 70,
            height: 70,
          }}
        />
      ),
      title: "Increase visibility",
      text:
        "With us, your restaurant will not drown in established\n" +
        "                competitor restaurants but receive the visibility it deserves.",
    },
    {
      icon: (
        <Reviews
          sx={{
            width: 70,
            height: 70,
          }}
        />
      ),
      title: "Receive reviews",
      text: "Our Review-Vouchers are a great incentive for customers to write reviews about your restaurant.",
    },
  ];

  function Benefits() {
    return (
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h2">How You Benefit</Typography>
          </Grid>
          {benefits.map((benefit, index) => (
            <Grid item xs={4} style={{ textAlign: "center" }} key={index}>
              <Card
                sx={{
                  height: 350,
                }}
              >
                <CardContent>
                  <Grid item xs={12}>
                    {benefit.icon}
                  </Grid>
                  <Typography variant={"h3"} style={{ marginTop: "3%" }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" style={{ margin: "3%" }}>
                    {benefit.text}
                  </Typography>
                </CardContent>
              </Card>
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
        spacing={6}
        justifyContent="space-evenly"
        alignItems={"center"}
      >
        <Grid item xs={12}>
          <Typography variant="h1">Opening a New Restaurant?</Typography>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography variant="body1">
            FreshBites is the perfect partner to jumpstart your restaurant! Get
            started today and enjoy a growing number of customers.
          </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <Button
            variant={"contained"}
            component={Link}
            to="/restaurants/create"
            key="/restaurants/create"
            disabled={Boolean(user)}
            style={{ fontSize: "1.2rem" }}
          >
            Register your restaurant now!
          </Button>
        </Grid>
        <Grid item>
          {Boolean(user) ? (
            <Alert severity="info" color="warning">
              <Typography variant={"body2"}>
                It is not possible to register a restaurant with an existing
                account.
              </Typography>
            </Alert>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4} alignItems={"center"}>
            <Grid item xs={6}>
              <Card sx={{ height: 400 }}>
                <CardMedia
                  sx={{ height: 150 }}
                  image="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  title="review"
                />
                <CardContent>
                  <Typography variant={"h3"} style={{ marginTop: "3%" }}>
                    Getting Started
                  </Typography>
                  <Typography variant={"body2"} style={{ marginTop: "3%" }}>
                    If you opened your restaurant within the last six months or
                    will open it within the next three weeks, you can join the
                    platform and register your restaurant. During the first year
                    on FreshBites your restaurant will have a premium display on
                    the list of newly opened restaurants.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ height: 400 }}>
                <CardMedia
                  sx={{ height: 150 }}
                  image="https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  title="review"
                />
                <CardContent>
                  <Typography variant={"h3"} style={{ marginTop: "3%" }}>
                    Your Long-Term Success
                  </Typography>
                  <Typography variant={"body2"} style={{ marginTop: "3%" }}>
                    After 12 months, your restaurant will be listed in the
                    "established" category. Through our voucher system, which
                    rewards active users, we ensure a lively community of
                    restaurant visitors. Become part of FreshBites today and
                    register your restaurant.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Benefits />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <SuccessStories />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <PricingModel />
        </Grid>
        <Grid item xs={12}>
          <Typography variant={"h2"}>
            A Strong Partnership for your Success
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ height: 680 }}>
            <CardMedia
              sx={{ height: 200, width: 1 }}
              image="https://images.unsplash.com/photo-1569908420024-c8f709b75700?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              title="voucher"
            />
            <CardContent>
              <Typography variant={"h3"} style={{ marginTop: "3%" }}>
                Our Voucher System
              </Typography>
              <Typography variant="body2" style={{ margin: "3%" }}>
                FreshBites provides a voucher system to promote your restaurant
                and engage customers. Visitors can earn vouchers by writing
                three reviews, exploring diverse restaurants within the
                FreshBites community. Subscribing to our premium plan grants
                access to vouchers for all FreshBites restaurants, with one
                voucher per restaurant per month. By accepting these vouchers,
                restaurant owners attract new customers and drive repeat
                business.
              </Typography>
              <Typography
                variant="body2"
                style={{
                  margin: "3%",
                  fontWeight: "bold",
                }}
              >
                As a FreshBites restaurant owner, it is crucial to accept these
                vouchers as they play a vital role in enticing new customers and
                fostering loyalty.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ height: 680 }}>
            <CardMedia
              sx={{ height: 200, width: 1 }}
              image="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              title="review"
            />
            <CardContent>
              <Typography variant={"h3"} style={{ marginTop: "3%" }}>
                Our Review System
              </Typography>
              <Typography variant={"body2"} style={{ margin: "3%" }}>
                At FreshBites, we value customer feedback. Visitors can write
                reviews, sharing their experiences and recommendations. As a
                restaurant owner, you can leverage these reviews to build
                credibility, reputation and attract more customers. To
                incentivize reviews, we offer a rewarding system. All reviews
                are verified by requiring the users to provide a verification
                code, which is handed out at your site, ensuring a fair, smooth
                and honest platform experience.
              </Typography>
              <Typography
                variant="body2"
                style={{
                  margin: "3%",
                  fontWeight: "bold",
                }}
              >
                To ensure the integrity of the review system, we request you to
                provide customers with our exclusive FreshBites review codes
                during visits.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
