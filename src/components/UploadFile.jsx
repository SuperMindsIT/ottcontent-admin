import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const UploadFile = (props) => {
  const { label, sx, setSelectedFile } = props;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <Box sx={sx}>
      <Typography
        sx={{
          color: "#F3F3F3",
          fontSize: 12,
          fontWeight: 300,
          lineHeight: "133%",
          opacity: 0.7,
          mb: "12px",
        }}
      >
        {label}
      </Typography>
      <Button
        component="label"
        role={undefined}
        tabIndex={-1}
        sx={{
          backgroundColor: "rgba(14, 139, 255, 0.20)",
          borderRadius: "68px",
          padding: "18px 49px",
          color: "white",
          fontSize: 14,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0,
          lineHeight: "92.8%",
          fontFamily: "Hanken Grotesk, sans-serif",
        }}
      >
        Upload
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
    </Box>
  );
};

UploadFile.propTypes = {
  label: PropTypes.string,
  sx: PropTypes.any,
  setSelectedFile: PropTypes.any,
};

export default UploadFile;
