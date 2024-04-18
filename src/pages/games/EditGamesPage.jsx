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
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

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
    }
  }, [gameById]);

  useEffect(() => {
    // console.log(isLoading, "is loading in edit");
    if (submitAttempted && !isLoading && !hasApiErrors()) {
      navigate("/games");
    }
  }, [submitAttempted, isLoading, hasApiErrors]);

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

      if (selectedFile !== null && selectedFile !== "Not available") {
        await putData(gameIdInt, data, formData);
        setSubmitAttempted(true);
      } else {
        toast.error("Upload the image too");
      }
    },
  });

  const handleDeleteConfirm = async () => {
    const gameIdInt = parseInt(gameId, 10);
    if (selectedFile !== null && selectedFile !== "Not available") {
      await deleteImageById(gameIdInt);
    } else {
      toast.error("no image to delete");
    }
    setSelectedFile(null);
    setOpen(false);
  };

  const handleCancel = () => {
    if (selectedFile && selectedFile !== "Not available") {
      navigate("/games");
    } else {
      toast.error("Upload the image too");
    }
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
                  onClick={() => setOpen(true)}
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
              onClose={() => setOpen(false)}
              onConfirm={handleDeleteConfirm}
              deleteItem={"Delete Image?"}
              deleteMessage={
                "Are you sure you want to delete this image? This action wont be restored."
              }
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
