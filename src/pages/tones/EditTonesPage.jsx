import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import InputBox from "../../components/InputBox";
import * as yup from "yup";
import UploadFile from "../../components/UploadFile";
import CustomButton from "../../components/CustomButton";
import useTonesApi from "../../api/useTonesApi";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";

const validationSchema = yup.object({
  name: yup.string("Enter the name of tone").required("Tone is required"),
});

const EditTonesPage = () => {
  const { toneId } = useParams();
  const {
    putData,
    getDataById,
    deleteToneById,
    hasApiErrors,
    toneById,
    isLoading,
  } = useTonesApi();

  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDataById(toneId);
    // console.log(toneId, "tone id kudg kefgh ");
    // console.log(toneById, "tone in edit tone");
  }, []);

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
      if (deleteItemConfirm) {
        await handleDeleteTone(toneIntId);
      }
      await putData(toneIntId, data, formData);
      {
        if (
          !isLoading &&
          !hasApiErrors() &&
          (selectedFile !== "Not available" || selectedFile !== null)
        ) {
          navigate("/tones");
        }
      }
    },
  });

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

  const handleCancel = () => {
    navigate("/tones");
  };

  const handleDeleteTone = async (id) => {
    try {
      await deleteToneById(id);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error deleting tone:", error);
    }
  };

  // for delete dialog
  const [open, setOpen] = useState(false);
  const [deleteItemConfirm, setDeleteItemConfirm] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteClick = () => {
    setOpen(true);
  };
  const handleDeleteConfirm = () => {
    setSelectedFile(null);
    setDeleteItemConfirm(true);
    setOpen(false);
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
            {/* <UploadFile
              label="Upload Tone (max 10mb)*"
              sx={{ mt: "22px", mb: "151px" }}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            /> */}
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
                  onClick={() => handleDeleteClick(toneId)}
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
              onClose={handleClose}
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

// {selectedFile && (
//   <Box sx={{ mt: 2, mb: "50px" }}>
//     <audio
//       controls
//       src={URL.createObjectURL(selectedFile)}
//       style={{ width: "100%" }}
//     >
//       Your browser does not support the audio element.
//     </audio>
//   </Box>
// )}
