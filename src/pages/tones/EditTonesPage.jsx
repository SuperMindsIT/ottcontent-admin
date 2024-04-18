import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Box, Stack, Typography } from "@mui/material";
import useTonesApi from "../../api/useTonesApi";
import InputBox from "../../components/InputBox";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string("Enter the name of tone").required("Tone is required"),
});

const EditTonesPage = () => {
  const navigate = useNavigate();
  const { toneId } = useParams();

  const {
    putData,
    getDataById,
    deleteToneById,
    hasApiErrors,
    toneById,
    isLoading,
  } = useTonesApi();

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    getDataById(toneId);
  }, []);

  useEffect(() => {
    if (toneById) {
      formik.setValues({
        name: toneById.title || "",
      });
      if (toneById.audio) {
        setSelectedFile(toneById.audio);
      }
    }
  }, [toneById]);

  useEffect(() => {
    console.log(isLoading, "is loading in edit");
    if (submitAttempted && !isLoading && !hasApiErrors()) {
      navigate("/tones");
    }
  }, [submitAttempted, isLoading, hasApiErrors]);

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
      formData.append("audio", selectedFile);

      const toneIntId = parseInt(toneId, 10);

      if (selectedFile && selectedFile !== "Not available") {
        await putData(toneIntId, data, formData);
        setSubmitAttempted(true);
      } else {
        toast.error("Upload the audio too");
      }
    },
  });

  const handleDeleteConfirm = async () => {
    const toneIntId = parseInt(toneId, 10);

    if (selectedFile !== null && selectedFile !== "Not available") {
      await deleteToneById(toneIntId);
    } else {
      toast.error("no audio to delete");
    }
    setSelectedFile(null);
    setOpen(false);
  };

  const handleCancel = () => {
    if (selectedFile && selectedFile !== "Not available") {
      navigate("/tones");
    } else {
      toast.error("Upload the audio too");
    }
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
              placeholder="Name*"
            />
            {selectedFile && selectedFile !== "Not available" ? (
              <Box sx={{ mt: "22px", mb: "20px" }}>
                {typeof selectedFile === "string" ? (
                  <Box sx={{ mt: 2, mb: "50px" }}>
                    <audio
                      controls
                      src={selectedFile}
                      style={{ width: "100%" }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </Box>
                ) : (
                  <Box sx={{ mt: 2, mb: "50px" }}>
                    <audio
                      controls
                      src={URL.createObjectURL(selectedFile)}
                      style={{ width: "100%" }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </Box>
                )}
                <CustomButton
                  btn="secondary"
                  label="Delete Tone"
                  onClick={() => setOpen(true)}
                />
              </Box>
            ) : (
              <UploadFile
                label="Upload Tone (max 10mb)*"
                sx={{ mt: "22px", mb: "151px" }}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            )}
            <DeleteConfirmationDialog
              open={open}
              onClose={() => setOpen(false)}
              onConfirm={handleDeleteConfirm}
              deleteItem={"Delete Audio?"}
              deleteMessage={"Are you sure you want to delete this Audio?"}
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

export default EditTonesPage;
