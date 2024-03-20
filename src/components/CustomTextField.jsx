import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

const CustomTextField = ({
  placeholder,
  type,
  name,
  value,
  onChange,
  onBlur,
  helperText,
  ...rest
}) => {
  return (
    <>
      <TextField
        placeholder={placeholder}
        variant="outlined"
        fullWidth
        margin="none"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        sx={{
          backgroundColor: "#403E4C",
          borderRadius: "68px",
          mb: helperText ? 1 : 2,
          "& fieldset": { border: "none" },
          "& input": {
            color: "white",
            padding: "22px 30px 22px 30px",
            fontSize: 14,
            lineHeight: "92.8%",
          },
          "& input::placeholder": {
            color: "white",
            opacity: 0.7,
          },
        }}
        {...rest}
      />
      {helperText && (
        <Typography sx={{ fontSize: 12, color: "red", mb: helperText ? 2 : 0 }}>
          {helperText}
        </Typography>
      )}
    </>
  );
};

CustomTextField.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  helperText: PropTypes.string,
};

export default CustomTextField;
