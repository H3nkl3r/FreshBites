import * as React from "react";
import { useContext, useState } from "react";
import UpgradeToPremium from "./UpgradeToPremium";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { AuthContext } from "../../utils/AuthProvider";
import { LoadingButton } from "@mui/lab";

const API_BASE_URL = "http://localhost:3001";

export default function MySubscription({ userRole, userId }) {
    const theme = useTheme();
    const [openUpgrade, setOpenUpgrade] = useState(false);
    const [openUnsubscribe, setOpenUnsubscribe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetchWithToken } = useContext(AuthContext);

  const handleCloseUpgrade = () => {
    setOpenUpgrade(false);
  };
  const handleSubscribe = async () => {
    setOpenUpgrade(true);
  };

  const handleOpenUnsubscribe = () => {
    setOpenUnsubscribe(true);
  };

  function UnsubscribeDialog() {
    const handleUnsubscribe = async () => {
      setLoading(true);
      const unsubscribeResponse = await fetchWithToken(
        `${API_BASE_URL}/user/unsubscribe`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
          }),
        }
      );
      if (unsubscribeResponse) {
        setLoading(false);
        window.location.reload();
      }
    };

    const handleClose = () => {
      setOpenUnsubscribe(false);
    };

    return (
      <Dialog open={openUnsubscribe} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: "center" }}>
          Are you sure you want to give up your premium status?
        </DialogTitle>
        <DialogActions
          sx={{ justifyContent: "center", flexDirection: "column" }}
        >
          <Button variant="contained" onClick={handleClose} sx={{ width: 350 }}>
            No, I want to keep my premium status
          </Button>
          <LoadingButton
            loading={loading}
            variant="outlined"
            onClick={handleUnsubscribe}
            sx={{ marginTop: 2, width: 350 }}
          >
            Yes, I want to be a free user
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ textAlign: "center" }}>
          <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  variant="h3"
                  sx={{ textAlign: "center", marginTop: 2 }}
                >
                  Your Subscription
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  You are a {userRole} user.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {userRole === "FREE" ? (
                  <Button
                    onClick={handleSubscribe}
                    variant="contained"
                    sx={{ textAlign: "center", marginBottom: 2 }}
                  >
                    Become a PREMIUM user
                  </Button>
                ) : (
                  <Button
                    onClick={handleOpenUnsubscribe}
                    variant="outlined"
                    sx={{
                      textAlign: "center",
                      marginBottom: 2,
                      color: theme.palette.error.main,
                      borderColor: theme.palette.error.main,
                      "&:hover": {
                        borderColor: theme.palette.error.main,
                      },
                    }}
                  >
                    Unsubscribe
                  </Button>
                )}
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Grid>
      <UpgradeToPremium open={openUpgrade} onClose={handleCloseUpgrade} />
      <UnsubscribeDialog />
    </Grid>
  );
}
