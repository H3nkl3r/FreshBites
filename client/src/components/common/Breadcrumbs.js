import { useMatches } from "react-router-dom";
import { Box, Breadcrumbs, Link } from "@mui/material";

export function MyBreadcrumb() {
  let matches = useMatches();

  let crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => match.handle.crumb(match.data));

  const breadcrumbs = crumbs.map((crumb, index) => {
    const notLast = index < crumbs.length - 1;
    if (notLast) {
      return (
        <Link color="inherit" key={index}>
          {crumb}
        </Link>
      );
    } else {
      return <Box key={index}>{crumb}</Box>;
    }
  });

  return <Breadcrumbs aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>;
}
