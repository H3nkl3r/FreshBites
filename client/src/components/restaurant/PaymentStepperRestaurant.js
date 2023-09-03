import React from "react";
import {
  Box,
  Card,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

const feesFirst12Months = [
  {
    name: "Base fee",
    desc: "Monthly",
    price: "79,00€",
  },
  {
    name: "Pay-per-click",
    desc: "Monthly billed",
    price: "0,49€",
  },
];

const feesAfter12Months = [
  {
    name: "Base fee",
    desc: "",
    price: { not: "79,00€", real: "0,00€" },
  },
  {
    name: "Pay-per-click",
    desc: "Monthly billed",
    price: { not: "", real: "0,49€" },
  },
];
export default function PaymentStepperRestaurant() {
  function CheckoutOverview() {
    return (
      <React.Fragment>
        <Grid container spacing={4} direction="column">
          <Grid item>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              First 12 months
            </Typography>
            <List disablePadding>
              {feesFirst12Months.map((product) => (
                <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2">{product.name}</Typography>
                    }
                    secondary={
                      <Typography variant="subtitle2">
                        {product.desc}
                      </Typography>
                    }
                  />
                  <Typography variant="body2">{product.price}</Typography>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              After 12 months
            </Typography>
            <List disablePadding>
              {feesAfter12Months.map((product) => (
                <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2">{product.name}</Typography>
                    }
                    secondary={
                      <Typography variant="subtitle2">
                        {product.desc}
                      </Typography>
                    }
                  />
                  <div>
                    <Typography
                      variant="body3"
                      style={{ textDecoration: "line-through" }}
                    >
                      {product.price.not}
                    </Typography>
                    <Typography variant="body2">
                      {product.price.real}
                    </Typography>
                  </div>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <Container component="main" sx={{ mb: 4, width: "50%" }}>
      <Card
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography variant="h3" align="center">
          Checkout
        </Typography>
        <Box sx={{ p: 4 }}>
          <CheckoutOverview />
        </Box>
      </Card>
    </Container>
  );
}
