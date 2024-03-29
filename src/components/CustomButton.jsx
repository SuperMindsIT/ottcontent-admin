import PropTypes from "prop-types";
import { Button } from "@mui/material";

const CustomButton = (props) => {
  const { btn, label, type, onClick } = props;

  if (btn === "primary") {
    return (
      <Button
        sx={{
          backgroundColor: "#0E8BFF",
          borderRadius: "68px",
          padding: "18px 62px",
          color: "white",
          fontSize: 14,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0,
          lineHeight: "92.8%",
          fontFamily: "Hanken Grotesk, sans-serif",
        }}
        onClick={onClick}
        type={type}
      >
        {label}
      </Button>
    );
  }

  if (btn === "secondary") {
    return (
      <Button
        sx={{
          backgroundColor: "rgba(14, 139, 255, 0.20)",
          borderRadius: "68px",
          padding: "18px 62px",
          color: "white",
          fontSize: 14,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0,
          lineHeight: "92.8%",
          fontFamily: "Hanken Grotesk, sans-serif",
        }}
        onClick={onClick}
      >
        {label}
      </Button>
    );
  }
};

CustomButton.propTypes = {
  btn: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default CustomButton;
