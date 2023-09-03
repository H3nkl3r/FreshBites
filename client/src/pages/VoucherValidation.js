import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { AuthContext } from "../utils/AuthProvider";
import LoadingButton from "@mui/lab/LoadingButton";

const API_BASE_URL = "http://localhost:3001";

export default function VoucherValidation() {
  const { voucherId } = useParams();
  const theme = useTheme();
  const {
    fetchWithToken,
    loading: authLoading,
    setError,
    user,
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [voucherData, setVoucherData] = useState({
    restaurant: "",
    valid: "",
    amount: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!authLoading) {
      checkEligibilityToValidate().then((eligible) => {
        if (eligible) {
          getVoucherData().then(() => setLoading(false));
        } else {
          setError(
            "You do not have permission to view details of this voucher as you are not the owner of the restaurant it belongs to."
          );
        }
      });
    }
  }, [authLoading, user]);

  const checkEligibilityToValidate = async () => {
    const params = new URLSearchParams({ voucherId });
    const response = await fetchWithToken(
      `${API_BASE_URL}/user/voucherPermission?${params}`
    );
    if (response) {
      const jsonData = await response.json();
      return jsonData.eligibleToEdit;
    } else {
      return false;
    }
  };

  const getVoucherData = async () => {
    const paramsVoucher = new URLSearchParams({ voucherId });
    const voucher = await fetchWithToken(
      `${API_BASE_URL}/voucher/get?${paramsVoucher}`
    );

    if (voucher) {
      const jsonData = await voucher.json();
      setVoucherData({
        restaurant: jsonData.restaurant,
        valid: jsonData.valid,
        amount: jsonData.amount,
      });
    } else {
      setError(
        "An error occurred when trying to load the voucher data. Please try again later."
      );
    }
    setLoading(false); // Set loading to false once data is fetched
  };

  const handleInvalidate = async () => {
    setSubmitting(true);
    const response = await fetchWithToken(
      "http://localhost:3001/voucher/invalidate/",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherId }),
      }
    );
    if (response) {
      setVoucherData({ ...voucherData, valid: false });
    }
    setSubmitting(false);
  };

  return loading ? (
    <Skeleton animation="wave" height={150} />
  ) : (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography variant="h2">Invalidate the voucher here</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Container sx={{ display: "flex", flexDirection: "column" }}>
              {voucherData.valid ? (
                <>
                  <Grid
                    container
                    spacing={4}
                    direction={"column"}
                    alignItems={"center"}
                  >
                    <Grid item xs={12}>
                      <Typography
                        variant="h3"
                        sx={{
                          color: theme.palette.primary.main,
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        This voucher is valid for your restaurant!
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        It is a {voucherData.amount} voucher
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <LoadingButton
                        variant="contained"
                        loading={submitting}
                        onClick={handleInvalidate}
                        sx={{ marginBottom: 5 }}
                      >
                        Invalidate Voucher
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.warning.main,
                      textAlign: "center",
                      marginBottom: 5,
                      marginTop: 5,
                    }}
                  >
                    This voucher has already been used and is invalid!
                  </Typography>
                </Grid>
              )}
            </Container>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
