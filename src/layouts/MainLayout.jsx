import { Box, Button, Typography } from "@mui/material";
import DataTable from "../components/DataTable";
import PropTypes from "prop-types";

const MainLayout = (props) => {
  const { title, onAddClick, rows, columns, isLoading } = props;
  console.log(rows, "row data");

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.4 }}>
        <Typography sx={{ fontSize: 24, color: "#fff", fontWeight: 800 }}>
          {title}
        </Typography>
        <Button
          variant="contained"
          sx={{
            px: 4,
            py: 2,
            fontSize: 14,
            color: "white",
            fontWeight: 700,
            textTransform: "uppercase",
            borderRadius: 8.4,
            backgroundColor: "#0E8BFF",
          }}
          onClick={onAddClick}
        >
          + Add
        </Button>
      </Box>
      <DataTable rows={rows} columns={columns} isLoading={isLoading} />
    </div>
  );
};

export default MainLayout;

MainLayout.propTypes = {
  title: PropTypes.string,
  onAddClick: PropTypes.func,
  rows: PropTypes.array,
  columns: PropTypes.array,
  isLoading: PropTypes.bool,
};
