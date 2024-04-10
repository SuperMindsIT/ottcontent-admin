import { useEffect, useState } from "react";
import { Box, Stack, Typography, Card, CardMedia } from "@mui/material";
import { useFormik } from "formik";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import InputBox from "../../components/InputBox";
import * as yup from "yup";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import useRecipesApi from "../../api/useRecipesApi";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useNavigate, useParams } from "react-router-dom";
import Dropdown from "../../components/Dropdown";

const validationSchema = yup.object({
  title_en: yup.string().required("Title in English is required"),
  content_en: yup.string().required("Content in English is required"),
});

const AddRecipesInCategoryPage = () => {
  const { recipeId } = useParams();
  const { postCategoryData, isLoading, hasApiErrors } = useRecipesApi();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    // Convert ContentState to raw format
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    // Convert rawContentState to HTML
    const htmlContent = draftToHtml(rawContentState);
    // console.log(editorState);
    formik.setFieldValue(`content_${language}`, htmlContent);
  };

  const [selectedCover, setSelectedCover] = useState(null);

  const updateValuesForLanguages = (values, language) => {
    const data = {
      title_en: values.title_en,
      content_en: values.content_en,
      title_es: values.title_es,
      content_es: values.content_es,
      title_gr: values.title_gr,
      content_gr: values.content_gr,
    };

    // Update values for the selected language
    data[`title_${language}`] = values[`title_${language}`];
    data[`content_${language}`] = values[`content_${language}`];
    return data;
  };

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
      await postCategoryData(recipeId, data, selectedCover);
      {
        // Navigate only if loading is finished and there are no API errors
        if (!isLoading && !hasApiErrors()) {
          navigate(`/recipes/${recipeId}`);
        }
      }
    },
  });

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

  const handleValueUpdate = (fieldName, value) => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  // Use useEffect to update formik values when the language changes
  useEffect(() => {
    const newTitle = formik.values[`title_${language}`] || "";
    const newcontent = formik.values[`content_${language}`] || "";

    formik.setFieldValue(`title_${language}`, newTitle);
    formik.setFieldValue(`content_${language}`, newcontent);
  }, [language]);

  const handleCancel = () => {
    navigate(`/recipes/${recipeId}`);
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
        + Add Recipe SubCategory
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

export default AddRecipesInCategoryPage;
