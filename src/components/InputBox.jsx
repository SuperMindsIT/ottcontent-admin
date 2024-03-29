import PropTypes from "prop-types";
import { TextField } from "@mui/material";

const InputBox = (props) => {
  const {
    id,
    name,
    type,
    value,
    onChange,
    onBlur,
    error,
    errors,
    placeholder,
  } = props;

  return (
    <TextField
      fullWidth
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error && Boolean(errors)}
      helperText={error && errors}
      placeholder={placeholder}
      sx={{
        backgroundColor: "#403E4C",
        borderRadius: "68px",
        mb: error ? 4 : 2,
        "& .MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
        "& .MuiInputBase-root": {
          color: "#fff",
          fontSize: 14,
          letterSpacing: 0,
          lineHeight: "92.8%",
          fontFamily: "Hanken Grotesk, sans-serif",
          height: "46px",
        },
        "& .MuiInputBase-input": {
          padding: "18px 21px",
          height: 0,
        },
        "& .MuiFormHelperText-root": {
          position: "absolute",
          bottom: "-24px",
        },
        "& ::placeholder": {
          opacity: 0.7,
        },
      }}
    />
  );
};

InputBox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  errors: PropTypes.string,
  placeholder: PropTypes.string,
};

export default InputBox;
