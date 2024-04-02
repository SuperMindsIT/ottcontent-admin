import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { ContentState, EditorState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import InputBox from "../../components/InputBox";
import * as yup from "yup";
import Dropdown from "../../components/Dropdown";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import useFitnessApi from "../../api/useFitnessApi";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const validationSchema = yup.object({
  title_en: yup.string().required("Title in English is required"),
  description_en: yup.string().required("Description in English is required"),
  content_en: yup.string().required("Content in English is required"),
});

const EditFitnessPage = () => {
  const { fitnessId } = useParams();
  const navigate = useNavigate();
  const { putData, getDataById, fitnessById, isLoading } = useFitnessApi();

  const [selectedFile, setSelectedFile] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [language, setLanguage] = useState("en");

  // editor
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

  useEffect(() => {
    getDataById(fitnessId);
    // console.log(fitnessById, "fitness in edit fitness");
  }, [fitnessId]);

  useEffect(() => {
    if (fitnessById) {
      const htmlContent = fitnessById[`content_${language}`] || "";
      const blocksFromHTML = convertFromHTML(htmlContent);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [fitnessById, language]);

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
      //   console.log("Form submitted with values:", values);
      const formData = new FormData();
      formData.append("image", selectedFile);
      //   console.log(data, "data in fitness");
      await putData(fitnessId, data, formData);
      {
        !isLoading && navigate("/fitness");
      }
    },
  });

  useEffect(() => {
    if (fitnessById) {
      formik.setValues({
        title_en: fitnessById.title_en || "",
        description_en: fitnessById.description_en || "",
        content_en: fitnessById.content_en || "",
        title_es: fitnessById.title_es || "",
        description_es: fitnessById.description_es || "",
        content_es: fitnessById.content_es || "",
        title_gr: fitnessById.title_gr || "",
        description_gr: fitnessById.description_gr || "",
        content_gr: fitnessById.content_gr || "",
      });
    }
  }, [fitnessById]);

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
        Edit Fitness
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
          <UploadFile
            label="Upload Cover (1920x756)*"
            sx={{ mb: 2 }}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
          <Dropdown
            language={language}
            setLanguage={setLanguage}
            handleValueUpdate={handleValueUpdate}
          />
          <form onSubmit={formik.handleSubmit}>
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
            />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
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

export default EditFitnessPage;
