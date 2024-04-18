import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Box, Stack, Typography } from "@mui/material";
import useTonesApi from "../../api/useTonesApi";
import InputBox from "../../components/InputBox";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string("Enter the name of tone").required("Name is required"),
});

const AddTonesPage = () => {
  const navigate = useNavigate();
  const { postData, isLoading, hasApiErrors } = useTonesApi();

  const [selectedFile, setSelectedFile] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (submitAttempted && !isLoading && !hasApiErrors()) {
      navigate("/tones");
    }
  }, [submitAttempted, isLoading, hasApiErrors]);

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

      if (selectedFile) {
        await postData(data, formData);
        setSubmitAttempted(true);
      } else {
        toast.error("Upload the audio file");
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
                onClick={() => navigate("/tones")}
              />
            </Stack>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default AddTonesPage;
