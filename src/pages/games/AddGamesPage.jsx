import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Box, Stack, Typography, Card, CardMedia } from "@mui/material";
import useGamesApi from "../../api/useGamesApi";
import InputBox from "../../components/InputBox";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string("Enter the name of game").required("Name is required"),
  iframe: yup.string("Enter the link of game").required("Iframe is required"),
});

const AddGamesPage = () => {
  const navigate = useNavigate();
  const { postData, isLoading, hasApiErrors } = useGamesApi();

  const [selectedFile, setSelectedFile] = useState(null);

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

      if (selectedFile) {
        await postData(data, formData);
        if (!isLoading && !hasApiErrors()) {
          navigate("/games");
        }
      } else {
        toast.error("Upload the image too");
      }
    },
  });

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
        + Add Game
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
            <UploadFile
              label="Upload Game Icon (440x280)*"
              sx={{ mt: "22px", mb: "50px" }}
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
                onClick={() => navigate("/games")}
              />
            </Stack>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default AddGamesPage;
