import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import * as React from "react";
import { AuthContext } from "../../utils/AuthProvider";

export default function ErrorDialog() {
  const { error, setError } = React.useContext(AuthContext);

  const handleClose = async () => {
    setError("");
  };

  return (
    <Dialog open={Boolean(error)} onClose={handleClose}>
      <DialogTitle>An error occurred.</DialogTitle>
      <DialogContent>
        <Alert severity="error">{error}</Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
