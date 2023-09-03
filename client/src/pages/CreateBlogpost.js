import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import * as yup from "yup";
import MasonryImageList from "../components/common/MasonryImageList";
import LoadingButton from "@mui/lab/LoadingButton";
import DropZone from "../components/restaurant/DropZone.js";
import { AuthContext } from "../utils/AuthProvider";

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  text: yup.string().required("Text is required"),
  image: yup.array().min(1, "Image is required"),
});

export default function CreateBlogpost() {
  const theme = useTheme();
  const { restaurantId } = useParams();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [errors, setErrors] = useState({
    titleError: "",
    textError: "",
    imageError: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const {
    fetchWithToken,
    isAuthenticated,
    setError,
    loading: authLoading,
  } = useContext(AuthContext);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  useEffect(() => {
    if (!authLoading) {
      checkEligibilityToEdit().then((eligible) => {
        if (!eligible) {
          setError("You do not have permission to do this.");
          navigate("/");
        }
      });
    }
  }, [authLoading, isAuthenticated]);

  const checkEligibilityToEdit = async () => {
    const params = new URLSearchParams({ restaurantId });
    const response = await fetchWithToken(
      `http://localhost:3001/user/restaurantPermission?${params}`
    );
    if (response) {
      const jsonData = await response.json();
      return jsonData.eligibleToEdit;
    } else {
      return false;
    }
  };

  useEffect(() => {
    handleImagePreview();
  }, [image]);

  const handleImagePreview = async () => {
    try {
      const previewUrls = image.map((blobImage) =>
        URL.createObjectURL(blobImage)
      );
      setImagePreview(previewUrls);
    } catch (error) {
      // Handle any errors that occurred during blob conversion
      console.error("Failed to convert blob image:", error);
    }
  };

  const handleRemoveImage = () => {
    setImage([]);
    setErrors((prev) => ({
      ...prev,
      imageError: "",
    }));
  };

  const handleAddImage = (acceptedFile) => {
    setImage(acceptedFile);
    setErrors((prev) => ({
      ...prev,
      imageError: "",
    }));
  };

  const navigate = useNavigate();

  const createBlogpost = async (title, text, restaurantId, image) => {
    await setSubmitting(true);
    await setErrors("");
    const response = await fetchWithToken("http://localhost:3001/blog/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        text: text,
        restaurantId: restaurantId,
      }),
    });

    if (response) {
      const blogpostData = await response.json();
      const blogpostId = blogpostData.blogpostId;
      const imageForm = new FormData();
      imageForm.append("blogpostId", blogpostId);
      imageForm.append("image", image[0]);
      const imageResponse = await fetchWithToken(
        "http://localhost:3001/blog/uploadImage/",
        {
          method: "POST",
          body: imageForm,
        }
      );
      if (imageResponse) {
        return blogpostId;
      }
    }
  };

  const handleBlogpostCreation = async () => {
    try {
      await validationSchema.validate(
        { title, text, image },
        { abortEarly: false }
      );

      const blogpostId = await createBlogpost(title, text, restaurantId, image);

      if (blogpostId) {
        navigate(`../blog/${blogpostId}`, { replace: false });
      }
    } catch (error) {
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={styles.container}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Create your Blogpost here</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="title"
            label="Blogpost Title"
            variant="outlined"
            required
            inputProps={{ maxLength: 400 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="text"
            label="Blogpost Text"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            inputProps={{ maxLength: 4000 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            error={!!errors.text}
            helperText={errors.text}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Upload your Blogpost image here</Typography>
          <DropZone
            onDrop={handleAddImage}
            fileType={"image/jpeg, image/png"}
            multipleAllowed={false}
            error={!!errors.image}
          />
        </Grid>
        <Grid item xs={12}>
          {errors.image && (
            <Typography
              variant={"body2"}
              style={{ color: theme.palette.error.main }}
            >
              {" "}
              {errors.image}{" "}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sx={{ height: "fit-content" }}>
          <Typography variant={"h6"}>Selected Image:</Typography>
          {imagePreview && (
            <MasonryImageList
              itemData={imagePreview}
              showCloseButton={true} // Set to true to show the close button
              handleRemoveImage={handleRemoveImage}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Cancel
            </Button>
            <LoadingButton
              loading={submitting}
              variant="contained"
              color="primary"
              onClick={handleBlogpostCreation}
            >
              Create Blogpost
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
