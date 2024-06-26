import { useState } from "react";
import { Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectLabels({
  language,
  setLanguage,
  handleValueUpdate,
}) {
  // const [language, setLanguage] = useState("en");

  // const handleChange = (event) => {
  //   setLanguage(event.target.value);
  // };

  // const handleChange = (event) => {
  //   const selectedLanguage = event.target.value;

  //   // Update values for both selected language and default language
  //   setValues((prevValues) => ({
  //     ...prevValues,
  //     [`title_${selectedLanguage}`]: values[`title_${selectedLanguage}`],
  //     [`description_${selectedLanguage}`]: values[`description_${selectedLanguage}`],
  //     [`content_${selectedLanguage}`]: values[`content_${selectedLanguage}`],
  //   }));

  //   setLanguage(selectedLanguage);
  // };

  const handleChange = (event) => {
    const selectedLanguage = event.target.value;

    // Update values for both selected language and default language
    handleValueUpdate(`title_${selectedLanguage}`, "");
    handleValueUpdate(`description_${selectedLanguage}`, "");
    handleValueUpdate(`content_${selectedLanguage}`, "");

    setLanguage(selectedLanguage);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <FormControl sx={{ minWidth: 140, mb: 2 }}>
        <Select
          value={language}
          onChange={handleChange}
          sx={{
            backgroundColor: "#525252",
            outline: "none",
            borderRadius: "19px",
            color: "white",
            fontSize: 14,
            lineHeight: "92.8%",
            letterSpacing: 0,
            "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input.MuiSelect-select":
              {
                minHeight: "38px",
              },
            "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input": {
              padding: 0,
              borderRadius: 0,
            },
            "& .MuiInputBase-input": {
              display: "flex",
              alignItems: "center",
              ml: "20px",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
              right: "10px",
              fontSize: "30px",
            },
          }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="gr">Greek</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
