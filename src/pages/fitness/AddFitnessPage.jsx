import { useState } from "react";
import { Box, Card, CardMedia, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { EditorState, RichUtils } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import * as yup from "yup";
import Dropdown from "../../components/Dropdown";
import InputBox from "../../components/InputBox";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import useFitnessApi from "../../api/useFitnessApi";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { values } from "draft-js/lib/DefaultDraftBlockRenderMap";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  title_en: yup.string().required("Title in English is required"),
  description_en: yup.string().required("Description in English is required"),
  content_en: yup.string().required("Content in English is required"),
});

const AddFitnessPage = () => {
  const { postData, isLoading, hasApiErrors } = useFitnessApi();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [language, setLanguage] = useState("en");

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    // console.log(editorState, "editor state");
    // Convert ContentState to raw format
    const rawContentState = convertToRaw(editorState.getCurrentContent());

    // Convert rawContentState to HTML
    const htmlContent = draftToHtml(rawContentState);
    // console.log(editorState);
    formik.setFieldValue(`content_${language}`, htmlContent);
  };

  const updateValuesForLanguages = (values, language) => {
    const data = {
      title_en: values.title_en,
      description_en: values.description_en,
      content_en: values.content_en,
      title_es: values.title_es,
      description_es: values.description_es,
      content_es: values.content_es,
      title_gr: values.title_gr,
      description_gr: values.description_gr,
      content_gr: values.content_gr,
    };

    // Update values for the selected language
    data[`title_${language}`] = values[`title_${language}`];
    data[`description_${language}`] = values[`description_${language}`];
    data[`content_${language}`] = values[`content_${language}`];

    return data;
  };

  const formik = useFormik({
    initialValues: {
      title_en: "",
      description_en: "",
      content_en: "",
      title_es: "",
      description_es: "",
      content_es: "",
      title_gr: "",
      description_gr: "",
      content_gr: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = updateValuesForLanguages(values, language);
      // console.log("Form submitted with values:", values);
      const formData = new FormData();
      formData.append("image", selectedFile);
      // console.log(data, "data in fitness");
      await postData(data, formData);
      {
        if (
          !isLoading &&
          !hasApiErrors() &&
          (selectedFile !== "Not available" || selectedFile !== null)
        ) {
          navigate("/fitness");
        }
      }
    },
  });

  const toggleBlockType = (blockType) => {
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    if (newState) {
      setEditorState(newState);
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
      // onClick: toggleBlockType,
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

  const handleCancel = () => {
    navigate("/fitness");
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
        + Add Fitness
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
        <UploadFile
          label="Upload Cover (1920x756)*"
          sx={{ mb: 2 }}
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
        <Dropdown
          language={language}
          setLanguage={setLanguage}
          handleValueUpdate={handleValueUpdate}
        />

        <form onSubmit={formik.handleSubmit}>
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
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={onEditorStateChange}
              toolbar={customToolbarOptions}
            />
            {/* <textarea
              id="content"
              name={`content_${language}`}
              value={formik.values[`content_${language}`]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Content*"
              style={{
                width: "100%",
                minHeight: "200px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                marginTop: "10px",
              }}
            /> */}
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
    </div>
  );
};

export default AddFitnessPage;
