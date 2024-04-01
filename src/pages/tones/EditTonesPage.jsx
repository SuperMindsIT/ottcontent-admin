import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import InputBox from "../../components/InputBox";
import * as yup from "yup";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import useTonesApi from "../../api/useTonesApi";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  name: yup.string("Enter the name of tone").required("Tone is required"),
});

const EditTonesPage = () => {
  const { toneId } = useParams();
  const { putData, getDataById, toneById, isLoading } = useTonesApi();

  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDataById(toneId);
    console.log(toneId, "tone id kudg kefgh ");
    console.log(toneById, "tone in edit tone");
  }, [toneId]);

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
      formData.append("string", selectedFile);
      await putData(toneId, data, formData);
      {
        !isLoading && navigate("/tones");
      }
    },
  });

  useEffect(() => {
    if (toneById) {
      formik.setValues({
        name: toneById.title || "",
      });
    }
  }, [toneById]);

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
        Edit Tone
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
              placeholder="Tone name*"
            />
            <UploadFile
              label="Upload Tone (max 10mb)*"
              sx={{ mt: "22px", mb: "151px" }}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
            <Stack direction="row" spacing={2}>
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

export default EditTonesPage;
