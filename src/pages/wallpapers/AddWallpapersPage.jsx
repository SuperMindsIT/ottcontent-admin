import { useState } from "react";
import { Box, Card, CardMedia, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import InputBox from "../../components/InputBox";
import * as yup from "yup";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import useWallpapersApi from "../../api/useWallpapersApi";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  name: yup.string("Enter the name of wallpaper").required("Name is required"),
});

const AddWallpapersPage = () => {
  const { postData, isLoading, hasApiErrors } = useWallpapersApi();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);

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
      await postData(data, formData);
      {
        // Navigate only if loading is finished and there are no API errors
        if (
          !isLoading &&
          !hasApiErrors() &&
          (selectedFile !== "Not available" || selectedFile !== null)
        ) {
          navigate("/wallpapers");
        }
      }
    },
  });
  const handleCancel = () => {
    navigate("/wallpapers");
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
        + Add Wallpaper
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
            <UploadFile
              label="Upload Wallpaper (max 10 mb)*"
              sx={{ mt: "22px", mb: "51px" }}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
            {selectedFile && (
              <Card sx={{ maxWidth: 400, mb: "50px" }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={URL.createObjectURL(selectedFile)}
                  alt="Uploaded Image"
                />
              </Card>
            )}
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

export default AddWallpapersPage;
