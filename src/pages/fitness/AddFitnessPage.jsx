import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { EditorState } from "draft-js";
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

const validationSchema = yup.object({
  name: yup.string("Enter the name of game").required("Name is required"),
  iframe: yup.string("Enter the link of game").required("Iframe is required"),
});

const AddFitnessPage = () => {
  const { postData } = useFitnessApi();

  const [selectedFile, setSelectedFile] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    console.log(editorState, "editor state");
    // Convert ContentState to raw format
    const rawContentState = convertToRaw(editorState.getCurrentContent());

    // Convert rawContentState to HTML
    const htmlContent = draftToHtml(rawContentState);
    console.log(typeof htmlContent);
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
      const formData = new FormData();
      formData.append("thumbnail", selectedFile);
      await postData(data, formData);
    },
  });

  const [showEditor, setShowEditor] = useState(false);

  const handleEditorClick = () => {
    setShowEditor(!showEditor);
    console.log(showEditor, "show editor in fitness");
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
        <Dropdown />
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
              name="title"
              type="text"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title}
              errors={formik.errors.title}
              placeholder="Title*"
            />
            <InputBox
              id="description"
              name="description"
              type="text"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description}
              errors={formik.errors.description}
              placeholder="Description*"
            />
            {/* <div
              dangerouslySetInnerHTML={{
                __html: htmlString,
              }}
            ></div> */}
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={onEditorStateChange}
            />
          </Box>
          <Stack direction="row" spacing={2}>
            <CustomButton btn="primary" label="save" type="submit" />
            <CustomButton btn="secondary" label="cancel" />
          </Stack>
        </form>
      </Box>
    </div>
  );
};

export default AddFitnessPage;
