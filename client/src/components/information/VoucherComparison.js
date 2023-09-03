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

export default function VoucherComparison() {
  const theme = useTheme();
  function createRow(item, premium, review) {
    return { item, premium, review };
  }

  const rows = [
    createRow(
      "Price",
      " 4.99 €/month or 49.99 €/year",
      "Free for every three reviews you have written"
    ),
    createRow("Types of discounts", "25 % discount", "Get 2 - Pay 1 "),
    createRow(
      "Number of discounts",
      "Personalized discounts for all listed restaurants: One per account per month",
      "One personalized voucher for one restaurant of your choice"
    ),
    createRow(
      "When to get it",
      "Subscribe to our premium subscription",
      "Write three reviews on freshbites about listed restaurants you have already visited"
    ),
    createRow(
      "How to get it",
      "If you are signed in, you can request it on the restaurant´s information page. The discount is then sent to you via email ",
      "If you are signed in, you can request it on the restaurant´s information page. The voucher is then sent to you via email"
    ),
  ];
  return (
    <Container style={{ textAlign: "center" }}>
      <Grid container spacing={4} sx={{ textAlign: "center" }}>
        <Grid item xs={12} style={{ textAlign: "center", marginBottom: 100 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                style={{
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
                      variant={"h5"}
                    >
                      PREMIUM SUBSCRIPTION
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: "white",
                      }}
                      variant={"h5"}
                    >
                      LOYALTY
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.item}>
                    <TableCell>
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
