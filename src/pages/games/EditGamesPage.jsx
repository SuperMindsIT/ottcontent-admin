import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import InputBox from "../../components/InputBox";
import * as yup from "yup";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import useGamesApi from "../../api/useGamesApi";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  name: yup.string("Enter the name of game").required("Name is required"),
  iframe: yup.string("Enter the link of game").required("Iframe is required"),
});

const EditGamesPage = () => {
  const { gameId } = useParams();
  const { putData, getDataById, gameById, isLoading } = useGamesApi();

  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDataById(gameId);
    console.log(gameById, "game in edit game");
  }, [gameId]);

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
      await putData(gameId, data, formData);
      {
        !isLoading && navigate("/games");
      }
    },
  });

  useEffect(() => {
    if (gameById) {
      formik.setValues({
        name: gameById.title || "",
        iframe: gameById.iframe || "",
      });
    }
  }, [gameById]);

  const handleCancel = () => {
    navigate("/games");
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
        Edit Game
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
              placeholder="Game name*"
            />
            <InputBox
              id="iframe"
              name="iframe"
              type="url"
              value={formik.values.iframe}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.iframe}
              errors={formik.errors.iframe}
              placeholder="iframe link*"
            />
            <UploadFile
              label="Upload Game Icon (440x280)*"
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

export default EditGamesPage;
