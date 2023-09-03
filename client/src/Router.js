import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Route,
} from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import RestaurantSearch from "./pages/RestaurantSearch";
import RestaurantInformation from "./pages/RestaurantInformation";
import { Typography } from "@mui/material";
import ReviewVsPremium from "./pages/ReviewVsPremium";
import Voucher from "./pages/Voucher";
import VoucherValidation from "./pages/VoucherValidation";
import RestaurantBenefits from "./pages/RestaurantBenefits";
import CreateRestaurant from "./pages/CreateRestaurant";
import Blog from "./pages/Blog";
import CreateBlogpost from "./pages/CreateBlogpost";
import Favorite from "./pages/Favorite";
import React from "react";
import RestaurantManagement from "./pages/RestaurantManagement";
import NotFound from "./pages/NotFound";
import TermsOfUse from "./pages/TermsOfUse";
import UserManagement from "./pages/UserManagement";
import DiscloseBlogpost from "./pages/DiscloseBlogpost";
import SuccessPaymentRestaurant from "./pages/SuccessPaymentRestaurant";
import SuccessPaymentUser from "./pages/SuccessPaymentUser";
import CancelPaymentRestaurant from "./pages/CancelPaymentRestaurant";
import CancelPaymentUser from "./pages/CancelPaymentUser";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route
        path="restaurants"
        element={<RestaurantSearch />}
        handle={{
          crumb: () => <Typography variant={"body2"}> Restaurants </Typography>,
        }}
      />
      <Route
        path="restaurants/:id"
        element={<RestaurantInformation />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}>
              <Link to={"/restaurants"}>Restaurants</Link> / Detail
            </Typography>
          ),
        }}
      />
      <Route
        path="voucher"
        element={<ReviewVsPremium />}
        handle={{
          crumb: () => <Typography variant={"body2"}> Voucher </Typography>,
        }}
      />
      <Route
        path="voucher/:restaurantId"
        element={<Voucher />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}>
              <Link to={"/voucher"}>Voucher</Link> / Choose
            </Typography>
          ),
        }}
      />
      <Route
        path="vouchervalidation/:voucherId"
        element={<VoucherValidation />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}>
              <Link to={"/voucher"}>Voucher</Link> / Validation
            </Typography>
          ),
        }}
      />
      <Route
        path="owners"
        element={<RestaurantBenefits />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}> Restaurant Owners </Typography>
          ),
        }}
      />
      <Route
        path="restaurants/create"
        element={<CreateRestaurant />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}>
              <Link to={"/restaurants"}>Restaurants</Link> / Create
            </Typography>
          ),
        }}
      />
      <Route
        path="restaurants/successPaymentRestaurant/:restaurantId"
        element={<SuccessPaymentRestaurant />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}>
              <Link to={"/restaurants"}>Restaurants</Link> / Registration
            </Typography>
          ),
        }}
      />
      <Route
        path="restaurants/cancelPaymentRestaurant/:restaurantId"
        element={<CancelPaymentRestaurant />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}>
              <Link to={"/restaurants"}>Restaurants</Link> / Registration
              cancelled
            </Typography>
          ),
        }}
      />
      <Route
        path="successPaymentUser/:userId"
        element={<SuccessPaymentUser />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}> Premium Subscription</Typography>
          ),
        }}
      />
      <Route
        path="cancelPaymentUser/:userId"
        element={<CancelPaymentUser />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}> Premium Subscription </Typography>
          ),
        }}
      />
      <Route
        path="blog"
        element={<Blog />}
        handle={{
          crumb: () => <Typography variant={"body2"}> Blog </Typography>,
        }}
      />
      <Route
        path="blog/create/:restaurantId"
        element={<CreateBlogpost />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}>
              <Link to={"/blog"}>Blog</Link> / Create Blogpost
            </Typography>
          ),
        }}
      />
      <Route
        path="blog/:blogpostId"
        element={<DiscloseBlogpost />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}>
              <Link to={"/blog"}>Blog</Link> / Blogpost
            </Typography>
          ),
        }}
      />
      <Route
        path="favorites"
        element={<Favorite />}
        handle={{
          crumb: () => <Typography variant={"body2"}> Favorites </Typography>,
        }}
      />
      <Route
        path="userManagement/"
        element={<UserManagement />}
        handle={{
          crumb: () => <Typography variant={"body2"}> My profile </Typography>,
        }}
      />
      <Route
        path="managerestaurant/:restaurantId"
        element={<RestaurantManagement />}
        handle={{
          crumb: () => (
            <Typography variant={"body2"}> My Restaurant </Typography>
          ),
        }}
      />
      <Route path={"*"} element={<NotFound />} />
      <Route path={"terms-of-use"} element={<TermsOfUse />} />
    </Route>
  )
);
