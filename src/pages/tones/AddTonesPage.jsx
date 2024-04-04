import { useState } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import InputBox from "../../components/InputBox";
import * as yup from "yup";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import useTonesApi from "../../api/useTonesApi";
import { useNavigate } from "react-router-dom";
// import { Audio } from "@mui/material";

const validationSchema = yup.object({
  name: yup.string("Enter the name of tone").required("Name is required"),
});

const AddTonesPage = () => {
  const { postData, isLoading } = useTonesApi();
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
      formData.append("audio", selectedFile);
      // console.log(formData, "form data in tones after posting");
      await postData(data, formData);
      {
        !isLoading && navigate("/tones");
      }
    },
  });

  const handleCancel = () => {
    navigate("/tones");
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
        + Add Tone
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
              label="Upload Tone (max 10mb)*"
              sx={{ mt: "22px", mb: "40px" }}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
            {/* {selectedFile && (
              <Box sx={{ mt: 2, mb: "151px" }}>
                <Typography sx={{ color: "#fff", mb: 1 }}>
                  Selected Audio:
                </Typography>
                <Audio
                  controls
                  src={URL.createObjectURL(selectedFile)}
                  style={{ width: "100%" }}
                />
              </Box>
            )} */}
            {selectedFile && (
              <Box sx={{ mt: 2, mb: "50px" }}>
                <audio
                  controls
                  src={URL.createObjectURL(selectedFile)}
                  style={{ width: "100%" }}
                >
                  Your browser does not support the audio element.
                </audio>
              </Box>
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

export default AddTonesPage;
