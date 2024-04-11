import { useEffect, useState } from "react";
import { Box, Stack, Typography, Card, CardMedia } from "@mui/material";
import { useFormik } from "formik";
import InputBox from "../../components/InputBox";
import * as yup from "yup";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import useRecipesApi from "../../api/useRecipesApi";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  title_en: yup.string().required("Title in English is required"),
  description_en: yup.string().required("Description in English is required"),
});

const AddRecipesPage = () => {
  const { postData, isLoading, hasApiErrors } = useRecipesApi();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");

  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  const updateValuesForLanguages = (values, language) => {
    const data = {
      title_en: values.title_en,
      description_en: values.description_en,
      title_es: values.title_es,
      description_es: values.description_es,
      title_gr: values.title_gr,
      description_gr: values.description_gr,
    };

    // Update values for the selected language
    data[`title_${language}`] = values[`title_${language}`];
    data[`description_${language}`] = values[`description_${language}`];
    return data;
  };

  const formik = useFormik({
    initialValues: {
      title_en: "",
      description_en: "",
      title_es: "",
      description_es: "",
      title_gr: "",
      description_gr: "",
      visible: 1,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = updateValuesForLanguages(values, language);
      if (selectedCover === "Not available" || selectedCover === null) {
        toast.error(
          "Cover is necessary , if uploaded please save your changes"
        );
        return;
      }
      if (selectedThumbnail === "Not available" || selectedThumbnail === null) {
        toast.error(
          "Thumbnail is necessary , if uploaded please save your changes"
        );
        return;
      }
      await postData(data, selectedCover, selectedThumbnail);
      {
        if (!isLoading && !hasApiErrors()) {
          navigate("/recipes");
        }
      }
    },
  });

  const handleValueUpdate = (fieldName, value) => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  // Use useEffect to update formik values when the language changes
  useEffect(() => {
    const newTitle = formik.values[`title_${language}`] || "";
    const newDescription = formik.values[`description_${language}`] || "";

    formik.setFieldValue(`title_${language}`, newTitle);
    formik.setFieldValue(`description_${language}`, newDescription);
  }, [language]);

  const handleCancel = () => {
    navigate("/recipes");
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
        + Add Recipe Category
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
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <UploadFile
              label="Upload Cover (1920x756)*"
              sx={{ mt: "22px", mb: "50px" }}
              selectedFile={selectedCover}
              setSelectedFile={setSelectedCover}
            />
            {selectedCover && (
              <Card sx={{ maxWidth: 400, mb: "50px" }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={URL.createObjectURL(selectedCover)}
                  alt="Uploaded Image"
                />
              </Card>
            )}
            <UploadFile
              label="Upload Thumbnail (460x303)*"
              sx={{ mt: "22px", mb: "50px" }}
              selectedFile={selectedThumbnail}
              setSelectedFile={setSelectedThumbnail}
            />
            {selectedThumbnail && (
              <Card sx={{ maxWidth: 400, mb: "50px" }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={URL.createObjectURL(selectedThumbnail)}
                  alt="Uploaded Image"
                />
              </Card>
            )}
            <Dropdown
              language={language}
              setLanguage={setLanguage}
              handleValueUpdate={handleValueUpdate}
            />
            <Box
              sx={{
                backgroundColor: "rgba(63, 63, 63, 0.30)",
                borderRadius: "23px",
                px: "26px",
                pt: "26px",
                pb: "10px",
                mb: "77px",
              }}
            >
              <InputBox
                id="title"
                name={`title_${language}`}
                type="text"
                value={formik.values[`title_${language}`]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched[`title_${language}`]}
                errors={formik.errors[`title_${language}`]}
                placeholder="Title*"
              />
              <InputBox
                id="description"
                name={`description_${language}`}
                type="text"
                value={formik.values[`description_${language}`]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched[`description_${language}`]}
                errors={formik.errors[`description_${language}`]}
                placeholder="Description*"
              />
            </Box>
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

export default AddRecipesPage;
