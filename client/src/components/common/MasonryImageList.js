import * as React from "react";
import { Box, IconButton, ImageList, ImageListItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function MasonryImageList({
  itemData,
  showCloseButton,
  handleRemoveImage,
}) {
  const isBlobURL = (url) => {
    return url.startsWith("blob:");
  };

  return (
    <Box sx={{ height: "10%", overflowY: "scroll" }}>
      <ImageList variant="masonry" cols={4} gap={8}>
        {itemData.map((item, index) => (
          <ImageListItem key={item}>
            {showCloseButton && (
              <IconButton
                aria-label="Remove"
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 1,
                  color: "#fff",
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
            {isBlobURL(item) ? (
              <img src={item} loading="lazy" />
            ) : (
              <img
                src={`${item}?w=248&fit=crop&auto=format`}
                srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                loading="lazy"
              />
            )}
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
