import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as React from "react";

export default function DropZone({
  onDrop,
  fileType,
  multipleAllowed,
  error = false,
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: fileType,
    onDrop: (acceptedFiles) => {
      // Filter the accepted files based on their types
      const validFiles = acceptedFiles.filter((file) =>
        fileType.includes(file.type)
      );

      // Invoke the provided onDrop callback with the valid files
      onDrop(validFiles);
    },
    multiple: multipleAllowed,
  });

  return (
    <Box
      sx={{
        height: 400,
        border: "2px dashed",
        borderColor: error ? "error.main" : "primary.main",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
      {...getRootProps()}
      className={isDragActive ? "drag-active" : ""}
    >
      <input {...getInputProps({ accept: fileType })} />{" "}
      <Box>
        <CloudUploadIcon sx={{ fontSize: 52 }} />
      </Box>
      <Typography variant="body2" component="div">
        Drag and drop images here, or click to select files.
      </Typography>
    </Box>
  );
}
