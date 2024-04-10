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
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

const validationSchema = yup.object({
  title_en: yup.string().required("Title in English is required"),
  content_en: yup.string().required("content in English is required"),
});

const EditRecipeInCategory = () => {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();

  // for delete dialog cover
  const [openCover, setOpenCover] = useState(false);
  const [deleteCoverConfirm, setDeleteCoverConfirm] = useState(false);

  const {
    putCategoryData,
    isLoading,
    subCategoryDetails,
    hasApiErrors,
    deleteSubcategoryCoverById,
    fetchSubCategoryData,
  } = useRecipesApi();

  const [selectedCover, setSelectedCover] = useState(null);
  const [language, setLanguage] = useState("en");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    // Convert ContentState to raw format
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    // Convert rawContentState to HTML
    const htmlContent = draftToHtml(rawContentState);
    formik.setFieldValue(`content_${language}`, htmlContent);
  };

  const updateValuesForLanguages = (values, language) => {
    const data = {
      title_en: values.title_en,
      content_en: values.content_en,
      title_es: values.title_es,
      content_es: values.content_es,
      title_gr: values.title_gr,
      content_gr: values.content_gr,
      visible: 1,
    };

    // Update values for the selected language
    data[`title_${language}`] = values[`title_${language}`];
    data[`content_${language}`] = values[`content_${language}`];
    return data;
  };

  useEffect(() => {
    if (subcategoryId) {
      fetchSubCategoryData(subcategoryId);
      // getDataDetailsById(subcategoryId);
      console.log(
        subCategoryDetails,
        "sub-category details in edit category page"
      );

      console.log(language, "language in edit page");
    }
  }, [subcategoryId]);

  useEffect(() => {
    if (subCategoryDetails) {
      const htmlContent = subCategoryDetails[`content_${language}`] || "";
      const blocksFromHTML = convertFromHTML(htmlContent);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [subCategoryDetails, language]);

  const formik = useFormik({
    initialValues: {
      title_en: "",
      content_en: "",
      title_es: "",
      content_es: "",
      title_gr: "",
      content_gr: "",
      visible: 1,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = updateValuesForLanguages(values, language);
      const subcategoryIdInt = parseInt(subcategoryId);
      console.log(subcategoryIdInt, "int id subcategory");
      if (
        deleteCoverConfirm &&
        (selectedCover !== "not available" || selectedCover !== null)
      ) {
        await handleDeleteCover(subcategoryIdInt);
      }

      await putCategoryData(subcategoryIdInt, data, selectedCover);
      {
        // Navigate only if loading is finished and there are no API errors
        if (
          !isLoading &&
          !hasApiErrors() &&
          (selectedCover !== "Not available" || selectedCover !== null)
        ) {
          navigate(`/recipes/${subCategoryDetails?.parent_id}`);
        }
      }
    },
  });

  useEffect(() => {
    if (subCategoryDetails) {
      // Update form values and files if data is loaded
      formik.setValues({
        title_en: subCategoryDetails.title_en || "",
        content_en: subCategoryDetails.content_en || "",
        title_es: subCategoryDetails.title_es || "",
        content_es: subCategoryDetails.content_es || "",
        title_gr: subCategoryDetails.title_gr || "",
        content_gr: subCategoryDetails.content_gr || "",
      });
      setSelectedCover(subCategoryDetails.cover);
    }
  }, [subCategoryDetails]);

  const handleValueUpdate = (fieldName, value) => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleCancel = () => {
    navigate(`/recipes/${subCategoryDetails?.parent_id}`);
  };

  const handleDeleteCover = async (id) => {
    try {
      await deleteSubcategoryCoverById(id);
      setSelectedCover(null);
    } catch (error) {
      console.error("Error deleting Cover:", error);
    }
  };

  const customToolbarOptions = {
    options: ["inline", "blockType", "list"], // Include list options
    inline: {
      options: ["bold"], // Show only bold and italic options
    },
    blockType: {
      inDropdown: true, // Ensure blockType selection is in a dropdown
      options: ["Normal", "H1", "H2"], // Specify block types you want
    },
    list: {
      options: ["unordered", "ordered"],
      className: undefined,
      dropdownClassName: undefined,
    },
  };

  // for delete dialog cover
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
        Edit SubCategory
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
                      alt="Uploaded Cover"
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height={200}
                      image={URL.createObjectURL(selectedCover)}
                      alt="Uploaded Cover"
                    />
                  )}
                </Card>
                <CustomButton
                  btn="secondary"
                  label="Delete Image"
                  onClick={() => handleDeleteCoverClick(subcategoryId)}
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
              <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
                toolbar={customToolbarOptions}
              />
            </Box>
            <DeleteConfirmationDialog
              open={openCover}
              onClose={handleCloseCover}
              onConfirm={handleDeleteCoverConfirm}
              deleteItem={"Delete Cover?"}
              deleteMessage={"Are you sure you want to delete this Cover?"}
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

export default EditRecipeInCategory;
