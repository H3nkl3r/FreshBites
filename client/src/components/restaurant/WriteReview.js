import * as React from "react";
import { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Rating,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { AuthContext } from "../../utils/AuthProvider";
import LoadingButton from "@mui/lab/LoadingButton";
import { HelpOutline } from "@mui/icons-material";

export default function WriteReview({ onClose, restaurantID, openReview }) {
  const [code, setCode] = useState("");
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [sendingReview, setSendingReview] = useState(false);

  const { fetchWithToken, error } = useContext(AuthContext);

  const handleSubmit = async () => {
    setSendingReview(true);
    const reviewData = {
      numbStars: stars,
      description: text,
      restaurant: restaurantID,
      code: code,
    };

    const response = await fetchWithToken(
      "http://localhost:3001/review/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      }
    );
    if (response) {
      onClose();
      window.location.reload();
    }
    setSendingReview(false);
  };

  return (
    <Dialog open={openReview} onClose={onClose}>
      <DialogTitle>
        <Typography variant={"h5"}>Write a Review</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <DialogContentText>
              <Typography variant={"body2"}>
                Write your review and get closer to your next discount!
              </Typography>
            </DialogContentText>
          </Grid>
          <Grid item xs={11}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="code"
              label="Review Code"
              name="code"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              autoFocus
              {...(error && { error: true, helperText: error })}
              onChange={(e) => setCode(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <Tooltip
              title={
                "Review codes are given out by the restaurant's personnel during your visit. They act as a prove for your actual visit. Please understand that this system is necessary to ensure a fair and honest platform experience."
              }
            >
              <HelpOutline />
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Rating
              id="stars"
              name="stars"
              required
              label="Stars"
              precision={0.5}
              onChange={(e) => setStars(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              required
              fullWidth
              multiline
              rows={4}
              name="text"
              label="Review"
              type="text"
              id="text"
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>
          <Grid item>
            <DialogContentText>
              <Typography variant={"body2"}>
                FreshBites offers you a free voucher for 2 dishes for the price
                of 1 for three written reviews each. Are you curious how to get
                even more vouchers for our partner restaurants?
              </Typography>
              <RouterLink
                to="/voucher"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography variant={"body2"}>Learn More</Typography>
              </RouterLink>
            </DialogContentText>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          loading={sendingReview}
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
