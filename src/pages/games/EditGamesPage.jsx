import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Box, Stack, Typography, Card, CardMedia } from "@mui/material";
import useGamesApi from "../../api/useGamesApi";
import InputBox from "../../components/InputBox";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string("Enter the name of game").required("Name is required"),
  iframe: yup.string("Enter the link of game").required("Iframe is required"),
});

const EditGamesPage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();

  const {
    putData,
    getDataById,
    deleteImageById,
    hasApiErrors,
    gameById,
    isLoading,
  } = useGamesApi();

  const [open, setOpen] = useState(false);
  const [deleteItemConfirm, setDeleteItemConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileBackend, setSelectedFileBackend] = useState(null);

  useEffect(() => {
    getDataById(gameId);
  }, []);

  useEffect(() => {
    if (gameById) {
      formik.setValues({
        name: gameById.title || "",
        iframe: gameById.iframe || "",
      });
      if (gameById.thumbnail) {
        setSelectedFile(gameById.thumbnail);
      }
      setSelectedFileBackend(gameById.thumbnail);
    }
  }, [gameById]);

  const formik = useFormik({
    initialValues: {
      name: "",
      iframe: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = {
        title: values.name,
        iframe: values.iframe,
      };
      const formData = new FormData();
      formData.append("thumbnail", selectedFile);
      const gameIdInt = parseInt(gameId, 10);
      if (
        deleteItemConfirm &&
        selectedFileBackend !== null &&
        selectedFileBackend !== "Not available"
      ) {
        await handleDeleteImage(gameIdInt);
        setDeleteItemConfirm(!deleteItemConfirm);
      }
      if (selectedFile === null && selectedFile === "Not available") {
        toast.error("image is necessary");
        return;
      }
      await putData(gameIdInt, data, formData), selectedFileBackend;

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
        navigate("/games");
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
    navigate("/games");
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
        Edit Game
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
            <InputBox
              id="iframe"
              name="iframe"
              type="url"
              value={formik.values.iframe}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.iframe}
              errors={formik.errors.iframe}
              placeholder="iframe link*"
            />
            {selectedFile && selectedFile !== "Not available" ? (
              <Box sx={{ mt: "22px", mb: "120px" }}>
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
                  onClick={() => handleDeleteClick(gameId)}
                />
              </Box>
            ) : (
              <UploadFile
                label="Upload Game Icon (440x280)*"
                sx={{ mt: "22px", mb: "120px" }}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            )}
            <DeleteConfirmationDialog
              open={open}
              onClose={handleClose}
              onConfirm={handleDeleteConfirm}
              deleteItem={"Delete Image?"}
              deleteMessage={"Are you sure you want to delete this image?"}
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

export default EditGamesPage;
