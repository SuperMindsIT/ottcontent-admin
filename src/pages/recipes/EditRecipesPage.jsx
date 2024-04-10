import { useEffect, useState } from "react";
import { Box, Stack, Typography, Card, CardMedia } from "@mui/material";
import { useFormik } from "formik";
import InputBox from "../../components/InputBox";
import * as yup from "yup";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import useRecipesApi from "../../api/useRecipesApi";
import Dropdown from "../../components/Dropdown";

const validationSchema = yup.object({
  title_en: yup.string().required("Title in English is required"),
  description_en: yup.string().required("Description in English is required"),
});

const EditRecipesPage = () => {
  const { recipeId } = useParams();
  const {
    putData,
    isLoading,
    categoryDetails,
    hasApiErrors,
    deleteCoverById,
    deleteThumbnailById,
    fetchCategoryData,
    // getDataDetailsById,
  } = useRecipesApi();

  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [language, setLanguage] = useState("en");

  const navigate = useNavigate();

  const updateValuesForLanguages = (values, language) => {
    const data = {
      title_en: values.title_en,
      description_en: values.description_en,
      title_es: values.title_es,
      description_es: values.description_es,
      title_gr: values.title_gr,
      description_gr: values.description_gr,
      visible: 1,
    };

    // Update values for the selected language
    data[`title_${language}`] = values[`title_${language}`];
    data[`description_${language}`] = values[`description_${language}`];
    return data;
  };

  useEffect(() => {
    if (recipeId) {
      fetchCategoryData(recipeId);
      // getDataDetailsById(recipeId);
      console.log(categoryDetails, "category details in edit category page");

      // console.log(language, "language in edit page");
    }
  }, []);

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
      const recipeIdInt = parseInt(recipeId, 10);
      if (
        deleteCoverConfirm &&
        (selectedCover !== "not available" || selectedCover !== null)
      ) {
        await handleDeleteCover(recipeIdInt);
      }
      if (
        deleteThumbnailConfirm &&
        (selectedThumbnail !== "not available" || selectedThumbnail !== null)
      ) {
        await handleDeleteThumbnail(recipeIdInt);
      }
      await putData(recipeIdInt, data, selectedCover, selectedThumbnail);
      {
        // Navigate only if loading is finished and there are no API errors
        if (
          !isLoading &&
          !hasApiErrors() &&
          (selectedCover !== "Not available" || selectedCover !== null) &&
          (selectedThumbnail !== "Not available" || selectedThumbnail !== null)
        ) {
          navigate("/recipes");
        }
      }
    },
  });

  useEffect(() => {
    if (categoryDetails) {
      // Update form values and files if data is loaded
      formik.setValues({
        title_en: categoryDetails.title_en || "",
        description_en: categoryDetails.description_en || "",
        title_es: categoryDetails.title_es || "",
        description_es: categoryDetails.description_es || "",
        title_gr: categoryDetails.title_gr || "",
        description_gr: categoryDetails.description_gr || "",
      });
      if (categoryDetails.cover) {
        setSelectedCover(categoryDetails.cover);
      }
      if (categoryDetails.thumbnail) {
        setSelectedThumbnail(categoryDetails.thumbnail);
      }
    }
  }, [categoryDetails]);

  const handleValueUpdate = (fieldName, value) => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/recipes");
  };

  const handleDeleteCover = async (id) => {
    try {
      await deleteCoverById(id);
      setSelectedCover(null);
    } catch (error) {
      console.error("Error deleting Cover:", error);
    }
  };
  const handleDeleteThumbnail = async (id) => {
    try {
      await deleteThumbnailById(id);
      setSelectedCover(null);
    } catch (error) {
      console.error("Error deleting Cover:", error);
    }
  };

  // for delete dialog cover
  const [openCover, setOpenCover] = useState(false);
  const [deleteCoverConfirm, setDeleteCoverConfirm] = useState(false);
  const handleCloseCover = () => {
    setOpenCover(false);
  };
  const handleDeleteCoverClick = () => {
    setOpenCover(true);
  };
  const handleDeleteCoverConfirm = () => {
    setSelectedCover(null);
    setDeleteCoverConfirm(true);
    setOpenCover(false);
  };

  // for delete dialog thumbnail
  const [openThumbnail, setOpenThumbnail] = useState(false);
  const [deleteThumbnailConfirm, setDeleteThumbnailConfirm] = useState(false);
  const handleCloseThumbnail = () => {
    setOpenThumbnail(false);
  };
  const handleDeleteThumbnailClick = () => {
    setOpenThumbnail(true);
  };
  const handleDeleteThumbnailConfirm = () => {
    setSelectedThumbnail(null);
    setDeleteThumbnailConfirm(true);
    setOpenThumbnail(false);
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
        Edit Category
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
            {selectedCover && selectedCover !== "Not available" ? (
              <Box sx={{ mt: "22px", mb: "120px" }}>
                <Card sx={{ maxWidth: 404, mb: "20px" }}>
                  {typeof selectedCover === "string" ? (
                    <CardMedia
                      component="img"
                      height={200}
                      image={selectedCover}
                      alt="Uploaded Image"
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height={200}
                      image={URL.createObjectURL(selectedCover)}
                      alt="Uploaded Image"
                    />
                  )}
                </Card>
                <CustomButton
                  btn="secondary"
                  label="Delete Image"
                  onClick={() => handleDeleteCoverClick(recipeId)}
                />
              </Box>
            ) : (
              <UploadFile
                label="Upload Cover(1920x756)*"
                sx={{ mt: "22px", mb: "120px" }}
                selectedFile={selectedCover}
                setSelectedFile={setSelectedCover}
              />
            )}
            {selectedThumbnail && selectedThumbnail !== "Not available" ? (
              <Box sx={{ mt: "22px", mb: "120px" }}>
                <Card sx={{ maxWidth: 404, mb: "20px" }}>
                  {typeof selectedThumbnail === "string" ? (
                    <CardMedia
                      component="img"
                      height={200}
                      image={selectedThumbnail}
                      alt="Uploaded Image"
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height={200}
                      image={URL.createObjectURL(selectedThumbnail)}
                      alt="Uploaded Image"
                    />
                  )}
                </Card>
                <CustomButton
                  btn="secondary"
                  label="Delete Image"
                  onClick={() => handleDeleteThumbnailClick(recipeId)}
                />
              </Box>
            ) : (
              <UploadFile
                label="Upload Thumbnail(440x280)*"
                sx={{ mt: "22px", mb: "120px" }}
                selectedFile={selectedThumbnail}
                setSelectedFile={setSelectedThumbnail}
              />
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
            <DeleteConfirmationDialog
              open={openCover}
              onClose={handleCloseCover}
              onConfirm={handleDeleteCoverConfirm}
              deleteItem={"Delete Cover?"}
              deleteMessage={"Are you sure you want to delete this Cover?"}
            />
            <DeleteConfirmationDialog
              open={openThumbnail}
              onClose={handleCloseThumbnail}
              onConfirm={handleDeleteThumbnailConfirm}
              deleteItem={"Delete Thumbnail?"}
              deleteMessage={"Are you sure you want to delete this Thumbnail?"}
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

export default EditRecipesPage;
