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
  };

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
      await postData(data, formData);
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
