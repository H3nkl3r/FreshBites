import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import * as React from "react";

export default function PricingModel() {
  const theme = useTheme();
  function createRow(item, premium, review) {
    return { item, premium, review };
  }

  const rows = [
    createRow(
      "Restaurant display",
      "Premium display on search site",
      "Listed in 'Established' category"
    ),

    createRow(
      "Duration",
      "First 12 months after registering your restaurant on FreshBites",
      "Unlimited"
    ),

    createRow("Base Fee", "79 € per month", "-"),
    createRow("Pay-per-click", "0,49 € per click", "0,49 € per click"),
  ];

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h2">Your Journey On FreshBites</Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                sx={{
                  backgroundColor: theme.palette.primary.light,
                }}
              >
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      FIRST 12 MONTHS
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      AFTER 12 MONTHS
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.item}>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      component="th"
                      scope="row"
                    >
                      <Typography
                        style={{ fontWeight: "bold" }}
                        variant={"body2"}
                      >
                        {row.item}
                      </Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant={"body2"}>{row.premium}</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant={"body2"}>{row.review}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}
