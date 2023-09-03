import React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";

const visitorsLinks = [
  { url: "/restaurants", label: "Restaurants" },
  { url: "/blog", label: "Blog" },
  { url: "/voucher", label: "Information" },
];

const ownersLinks = [{ url: "/owners", label: "Benefits" }];

const companyLinks = [
  { url: "/about", label: "About" },
  { url: "/jobs", label: "Jobs" },
  { url: "https://www.instagram.com", label: "Instagram" },
  { url: "https://www.twitter.com", label: "Twitter" },
];

const supportLinks = [
  { url: "/contact", label: "Contact" },
  { url: "/terms-of-use", label: "Terms of Use" },
  { url: "/privacy", label: "Privacy Policy" },
  { url: "/cookie", label: "Cookie Policy" },
];

const FooterLinkGroup = ({ title, links }) => (
  <Grid item xs={6} sm={3}>
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {links.map((link) => (
        <Link key={link.label} to={link.url} style={{ textDecoration: "none" }}>
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ marginBottom: "4px" }}
          >
            {link.label}
          </Typography>
        </Link>
      ))}
    </Box>
  </Grid>
);

export default function Footer() {
    const theme = useTheme();
  return (
    <footer
      style={{
        backgroundColor: theme.palette.grey[100],
        padding: "16px",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: "1%",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <FooterLinkGroup title="Visitors" links={visitorsLinks} />
          <FooterLinkGroup title="Owners" links={ownersLinks} />
          <FooterLinkGroup title="Support" links={supportLinks} />
          <FooterLinkGroup title="Company" links={companyLinks} />
        </Grid>
      </Container>
    </footer>
  );
}
