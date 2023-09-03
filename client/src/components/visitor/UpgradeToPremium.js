import React, { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "../../utils/AuthProvider";

export default function UpgradeToPremiumDialog({ open, onClose }) {
  const [alignment, setAlignment] = useState("monthly");
  const [price, setPrice] = useState(4.99);
  const [time, setTime] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const { user, fetchWithToken } = useContext(AuthContext);
  const theme = useTheme();

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    setSelectedPlan(newAlignment);
    // update price based on the selected plan
    if (newAlignment === "monthly") {
      setPrice(4.99);
      setTime("month");
    } else {
      setPrice(49.99);
      setTime("year");
    }
  };

  const handleUpgradeNow = async () => {
    const paymentResponse = await fetchWithToken(
      "http://localhost:3001/payment/createUserPaymentSession",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user._id,
          plan: selectedPlan,
        }),
      }
    );
    if (paymentResponse) {
      const { url } = await paymentResponse.json();
      window.location.href = url;
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle
        variant="h2"
        style={{ textAlign: "center", fontWeight: "bold" }}
      >
        Get your personal discounts!
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography align="center" marginX={"10%"} variant="h5">
          Getting discounts for new food spots has never been cheaper and
          easier!
        </Typography>
        <Typography
          style={{ marginTop: "6%", marginBottom: "2%" }}
          variant="h3"
        >
          Select your plan
        </Typography>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="plan"
          size="small"
          fullWidth
          color="primary"
        >
          <ToggleButton
            value="monthly"
            aria-label="monthly plan"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            Monthly
          </ToggleButton>
          <ToggleButton
            value="annual"
            aria-label="annual plan"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            Annual
            <Chip label="16,5 % less" size="small" />
          </ToggleButton>
        </ToggleButtonGroup>
        <Typography style={{ marginTop: "6%" }} variant="h3">
          How you benefit
        </Typography>
        <Typography variant="body2" textAlign={"center"}>
          Get monthly renewable discounts of 25 % from every restaurant listed
          on FreshBites. YOU choose where, when and what to eat!
        </Typography>
        <Divider style={{ marginTop: "3%" }} />
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          margin: "3%",
          marginTop: "1%",
        }}
      >
        <Typography
          style={{ fontWeight: "bold", fontSize: "20px" }}
          variant="body2"
        >
          {price}€ / {time}
        </Typography>
        <div>
          <Button onClick={onClose} color="primary">
            Not Now
          </Button>
          <Button
            onClick={handleUpgradeNow}
            variant="contained"
            color="primary"
            disabled={!selectedPlan}
          >
            Upgrade Now
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
