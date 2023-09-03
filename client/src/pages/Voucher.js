import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { CheckCircleOutline, Error, HelpOutline } from "@mui/icons-material";
import { AuthContext } from "../utils/AuthProvider";

export default function Voucher() {
  const theme = useTheme();
  const { restaurantId } = useParams();
  const {
    isAuthenticated,
    fetchWithToken,
    loading: authLoading,
    user,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        navigate("/voucher");
      } else {
        checkLoyaltyVoucher();
        checkPremiumVoucher();
        setStatusLoading(false);
      }
    }
  }, [authLoading, isAuthenticated]);

  const [tiers, setTiers] = useState([
    {
      title: "Premium",
      available: false,
      benefits: [
        "Available for all restaurants",
        "Monthly renewable",
        "25% discount",
      ],
      voucherMessage: "",
      buttonText: "Get Premium Voucher",
      buttonVariant: "outlined",
    },

    {
      title: "Loyalty",
      available: false,
      benefits: [
        "Available for one restaurant of your choice",
        "Granted per three written reviews",
        "Get 2 - Pay 1",
      ],
      voucherMessage: "",
      buttonText: "Get Loyalty Voucher",
      buttonVariant: "outlined",
    },
  ]);

  const [premiumVoucherLoading, setPremiumVoucherLoading] = useState(false);
  const [loyaltyVoucherLoading, setLoyaltyVoucherLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  const [openVoucherResponse, setOpenVoucherResponse] = useState(false);
  const [voucherResponseMessage, setVoucherResponseMessage] = useState("");

  const checkPremiumVoucher = async () => {
    const params = new URLSearchParams({
      restaurantId: restaurantId,
    });
    const response = await fetchWithToken(
      `http://localhost:3001/voucher/premiumVoucherStatus?${params}`
    );
    if (response) {
      const data = await response.json();

      setTiers((prevTiers) =>
        prevTiers.map((tier) =>
          tier.title === "Premium"
            ? {
                ...tier,
                available: data.premiumVoucherAvailable,
              }
            : tier
        )
      );
    }
  };

  const checkLoyaltyVoucher = async () => {
    const response = await fetchWithToken(
      `http://localhost:3001/voucher/loyaltyVoucherStatus`
    );
    if (response) {
      const data = await response.json();
      setTiers((prevTiers) =>
        prevTiers.map((tier) =>
          tier.title === "Loyalty"
            ? {
                ...tier,
                available: data.loyaltyVoucherAvailable,
              }
            : tier
        )
      );
    }
  };

  const handleGetLoyaltyVoucher = async () => {
    setLoyaltyVoucherLoading(true);
    const response = await fetchWithToken(
      "http://localhost:3001/voucher/issueLoyaltyVoucher",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurantId,
        }),
      }
    );
    if (response) {
      setVoucherResponseMessage(`Your voucher was sent to your email address!`);
      setOpenVoucherResponse(true);
    }
    setLoyaltyVoucherLoading(false);
  };

  const handleGetPremiumVoucher = async () => {
    setPremiumVoucherLoading(true);
    const response = await fetchWithToken(
      "http://localhost:3001/voucher/issuePremiumVoucher",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurantId,
        }),
      }
    );
    if (response) {
      setVoucherResponseMessage(`Your voucher was sent to your email address!`);
      setOpenVoucherResponse(true);
    }
    setPremiumVoucherLoading(false);
  };

  function VoucherCard({ tier }) {
    return (
      <Grid item key={tier.title} xs={6} sx={{ marginBottom: 5 }}>
        {statusLoading ? (
          <Skeleton animation="wave" />
        ) : (
          <Card>
            <CardHeader
              title={<Typography variant={"h2"}>{tier.title}</Typography>}
              titleTypographyProps={{ align: "center" }}
              action={
                <Tooltip
                  title={
                    tier.title === "Premium"
                      ? "As a premium user, you are eligible to receive monthly vouchers for all our partner restaurants. Vouchers are limited to one per restaurant per month."
                      : "FreshBites offers you a free voucher for a restaurant of your choice per three written reviews. You can view your progress in your account settings."
                  }
                >
                  <HelpOutline />
                </Tooltip>
              }
              subheaderTypographyProps={{
                align: "center",
              }}
              sx={{
                backgroundColor: theme.palette.background,
              }}
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                  mb: 2,
                }}
              >
                {tier.available ? (
                  <Grid container direction="column" alignItems="center">
                    <Grid item>
                      <CheckCircleOutline
                        style={{
                          color: theme.palette.primary.main,
                          fontSize: "30px",
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography
                        align="center"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Available
                      </Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container direction="column" alignItems="center">
                    <Grid item>
                      <Tooltip title={tier.voucherMessage}>
                        <Error
                          style={{
                            color: theme.palette.warning.main,
                            fontSize: "30px",
                          }}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Typography
                        align="center"
                        style={{ color: theme.palette.warning.main }}
                      >
                        {tier.title === "Premium" &&
                        user &&
                        user.role === "PREMIUM"
                          ? "Already used in the past 30 days."
                          : tier.title === "Loyalty"
                          ? "Not enough reviews"
                          : "Not eligible"}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Box>
              <ul>
                {tier.benefits.map((line) => (
                  <Typography variant="body2" align="center" key={line}>
                    {line}
                  </Typography>
                ))}
              </ul>
            </CardContent>
            <CardActions>
              <LoadingButton
                fullWidth
                key={tier.title}
                disabled={!tier.available}
                loading={
                  tier.title === "Premium"
                    ? premiumVoucherLoading
                    : tier.title === "Loyalty"
                    ? loyaltyVoucherLoading
                    : false
                }
                variant="contained"
                onClick={() =>
                  tier.title === "Premium"
                    ? handleGetPremiumVoucher()
                    : tier.title === "Loyalty"
                    ? handleGetLoyaltyVoucher()
                    : null
                }
              >
                {tier.buttonText}
              </LoadingButton>
            </CardActions>
          </Card>
        )}
      </Grid>
    );
  }

  function VoucherResponseDialog() {
    return (
      <Dialog
        open={openVoucherResponse}
        onClose={() => {
          setOpenVoucherResponse(false);
          checkPremiumVoucher();
          checkLoyaltyVoucher();
        }}
      >
        <DialogTitle>
          <Typography variant={"h5"}>
            Congratulations to your Voucher!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant={"body2"}>{voucherResponseMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenVoucherResponse(false);
              checkPremiumVoucher();
              checkLoyaltyVoucher();
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  function InfoHeader() {
    return (
      <Container disableGutters component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          sx={{ marginTop: -5 }}
        >
          Choose your Voucher
        </Typography>
        <Typography variant="body1" align="center" component="p">
          Saving money when eating out has never been so easy! There are two
          ways to get vouchers for our partner restaurants: get your premium
          subscription now to receive monthly vouchers for all restaurants! Or
          tell us about your experiences by writing reviews. We grant you a
          totally free voucher per three written reviews.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <InfoHeader />
      <Container component="main">
        <Grid container spacing={2} justifyContent="center">
          {tiers.map((tier) => (
            <VoucherCard tier={tier} />
          ))}
        </Grid>
      </Container>
      <Container>
        <VoucherResponseDialog />
      </Container>
    </Container>
  );
}
