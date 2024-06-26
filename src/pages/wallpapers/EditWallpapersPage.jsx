import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Box, Stack, Typography, Card, CardMedia } from "@mui/material";
import useWallpapersApi from "../../api/useWallpapersApi";
import InputBox from "../../components/InputBox";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string("Enter the name of wallpaper").required("Name is required"),
});

const EditWallpapersPage = () => {
  const navigate = useNavigate();
  const { wallpaperId } = useParams();

  const {
    putData,
    getDataById,
    deleteImageById,
    hasApiErrors,
    wallpaperById,
    isLoading,
  } = useWallpapersApi();

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileBackend, setSelectedFileBackend] = useState(null);
  const [deleteItemConfirm, setDeleteItemConfirm] = useState(false);

  useEffect(() => {
    getDataById(wallpaperId);
  }, []);

  useEffect(() => {
    if (wallpaperById) {
      formik.setValues({
        name: wallpaperById.title || "",
      });
      if (wallpaperById.image) {
        setSelectedFile(wallpaperById.image);
      }
      setSelectedFileBackend(wallpaperById.image);
    }
  }, [wallpaperById]);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = {
        title: values.name,
      };
      const formData = new FormData();
      formData.append("image", selectedFile);
      const wallpaperIntId = parseInt(wallpaperId, 10);
      if (
        deleteItemConfirm &&
        selectedFileBackend !== null &&
        selectedFileBackend !== "Not available"
      ) {
        await handleDeleteImage(wallpaperIntId);
        setDeleteItemConfirm(!deleteItemConfirm);
      }
      if (selectedFile === null && selectedFile === "Not available") {
        toast.error("image is necessary");
        return;
      }
      await putData(wallpaperIntId, data, formData), selectedFileBackend;

      console.log(
        !isLoading &&
          !hasApiErrors() &&
          (selectedFile !== "Not available" || selectedFile !== null)
      );
      if (
        !isLoading &&
        !hasApiErrors() &&
        (selectedFile !== "Not available" || selectedFile !== null)
      ) {
        navigate("/wallpapers");
      }
    },
  });

  const handleDeleteImage = async (id) => {
    try {
      await deleteImageById(id);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleCancel = () => {
    navigate("/wallpapers");
  };

  // for delete dialog
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteClick = () => {
    setOpen(true);
  };
  const handleDeleteConfirm = () => {
    setSelectedFile(null);
    setDeleteItemConfirm(true);
    setOpen(false);
  };

  return (
    <div>
      <Typography
        sx={{
          fontSize: 24,
          color: "#fff",
          fontWeight: 800,
          mb: 5,
        }}
      >
        Edit Wallpaper
      </Typography>
      <Box
        sx={{
          backgroundColor: "#1A1A1A",
          borderWidth: 1,
          borderColor: "#2C2C2C",
          borderRadius: "30px",
          px: 7,
          py: 6,
        }}
      >
        <Box sx={{ maxWidth: "400px" }}>
          <form onSubmit={formik.handleSubmit}>
            <InputBox
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name}
              errors={formik.errors.name}
              placeholder="Name*"
            />
            {selectedFile && selectedFile !== "Not available" ? (
              <Box sx={{ mt: "22px", mb: "20px" }}>
                <Card sx={{ maxWidth: 404, mb: "20px" }}>
                  {typeof selectedFile === "string" ? (
                    <CardMedia
                      component="img"
                      height={200}
                      image={selectedFile}
                      alt="Uploaded Image"
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height={200}
                      image={URL.createObjectURL(selectedFile)}
                      alt="Uploaded Image"
                    />
                  )}
                </Card>
                <CustomButton
                  btn="secondary"
                  label="Delete Image"
                  onClick={() => handleDeleteClick(wallpaperId)}
                />
              </Box>
            ) : (
              <UploadFile
                label="Upload wallpaper Icon (440x280)*"
                sx={{ mt: "22px", mb: "20px" }}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            )}
            <DeleteConfirmationDialog
              open={open}
              onClose={handleClose}
              onConfirm={handleDeleteConfirm}
              deleteItem={"Delete Image?"}
              deleteMessage={"Are you sure you want to delete this Image?"}
            />
            <Stack direction="row" spacing={2} sx={{ mt: "150px" }}>
              <CustomButton btn="primary" label="save" type="submit" />
              <CustomButton
                btn="secondary"
                label="cancel"
                onClick={handleCancel}
              />
            </Stack>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default EditWallpapersPage;
