import * as React from "react";
import { useEffect, useState } from "react";
import { Container, Grid, Typography, useTheme } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import MasonryImageList from "../common/MasonryImageList";
import DropZone from "./DropZone";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "2%",
  },
};

export default function UploadStepperRestaurant({
  formData,
  setFormData,
  formError,
  setFormError,
}) {
  const theme = useTheme();
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    handleImagePreview();
  }, [formData.selectedImages]);

  const handleImagePreview = async () => {
    try {
      const previewUrls = formData.selectedImages.map((blobImage) =>
        URL.createObjectURL(blobImage)
      );
      setImagePreview(previewUrls);
    } catch (error) {
      // Handle any errors that occurred during blob conversion
      console.error("Failed to convert blob images:", error);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedImages = [...prev.selectedImages];
      updatedImages.splice(index, 1);
      return { ...prev, selectedImages: updatedImages };
    });
  };

  const handleRemoveMenu = () => {
    setFormData((prev) => {
      return { ...prev, selectedMenu: [] };
    });
  };

  const handleAddImages = (acceptedFiles) => {
    setFormData((prev) => ({
      ...prev,
      selectedImages: [...prev.selectedImages, ...acceptedFiles],
    }));
    setFormError((prev) => ({
      ...prev,
      imageError: "",
    }));
  };

  const handleAddMenu = (acceptedFile) => {
    setFormData((prev) => ({
      ...prev,
      selectedMenu: acceptedFile,
    }));
    setFormError((prev) => ({
      ...prev,
      imageError: "",
      menuError: "",
    }));
  };

  return (
    <Container style={styles.container}>
      <Grid container spacing={2} direction="column" sx={{ width: 1000 }}>
        <Grid item>
          <Typography variant="h6">
            Upload your Restaurant images here
          </Typography>
        </Grid>
        <Grid item>
          <DropZone
            setFormData={setFormData}
            setFormError={setFormError}
            onDrop={handleAddImages}
            fileType={"image/jpeg, image/png"}
            multipleAllowed={true}
            error={!!formError.selectedImagesError}
          />
        </Grid>
        <Grid item>
          <Typography
            sx={{ color: theme.palette.error.main }}
            variant={"body2"}
          >
            {formError.selectedImagesError}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant={"body2"}>Selected Images:</Typography>
          <MasonryImageList
            itemData={imagePreview}
            showCloseButton={true} // Set to true to show the close button
            handleRemoveImage={handleRemoveImage}
          />
        </Grid>
        <Grid item>
          <Typography variant="h6">Upload your Menu here</Typography>
        </Grid>
        <Grid item xs={12}>
          <DropZone
            setFormData={setFormData}
            setFormError={setFormError}
            onDrop={handleAddMenu}
            fileType={"application/pdf"}
            multipleAllowed={false}
            error={!!formError.selectedMenuError}
          />
        </Grid>
        <Grid item>
          <Typography
            sx={{ color: theme.palette.error.main }}
            variant={"body2"}
          >
            {formError.selectedMenuError}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container>
            <Typography variant={"body2"}>
              {formData.selectedMenu.length} file(s) selected.
            </Typography>
            {formData.selectedMenu.length > 0 ? (
              <ClearIcon
                sx={{ color: theme.palette.error.main }}
                onClick={handleRemoveMenu}
              />
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
