import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "../../src/assets/search.svg";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useState } from "react";

export default function DataTable(props) {
  const { rows, columns, isLoading, searchFields } = props;
  // State to hold the search query
  const [searchQuery, setSearchQuery] = useState("");

  // Filter rows based on the search query and fields
  const filteredRows = rows.filter((row) =>
    searchFields.some((field) =>
      String(row[field]).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div style={{ height: 525, width: "100%" }}>
      {isLoading ? (
        <div
          style={{
            height: "50%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Loading ...
        </div>
      ) : (
        <>
          <Box>
            <TextField
              sx={{
                backgroundColor: "#403E4C",
                borderRadius: "68px",
                mb: 2,
                maxWidth: 250, // Set the max-width to 250px
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 0,
                },
                "& .MuiInputBase-root": {
                  color: "#fff", // Ensure text color is white
                  fontSize: 14,
                  letterSpacing: 0,
                  lineHeight: "92.8%",
                  fontFamily: "Hanken Grotesk, sans-serif",
                  height: "46px",
                },
                "& .MuiInputBase-input": {
                  padding: "18px 12px 18px 0px",
                  height: 0,
                },
                "& .MuiFormHelperText-root": {
                  position: "absolute",
                },
                "& .MuiInputLabel-root": {
                  color: "#fff", // Make label text white
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.7)", // Change focus border color to white
                    borderRadius: "68px", // Maintain the border-radius on focus
                    border: "0px",
                  },
                },
                "& ::placeholder": {
                  opacity: 0.7,
                  color: "#fff", // Ensure placeholder text is also white
                },
              }}
              // label="Search..."
              variant="outlined"
              placeholder="Search..."
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={SearchIcon} alt="Search" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#fff" },
              }}
            />
          </Box>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 15 },
              },
            }}
            pageSizeOptions={[15, 20, 25]}
            rowHeight={40}
            autoHeight
            getRowId={(row) => row.id}
            rowSelection={false}
            sx={{
              borderRadius: "30px",
              borderWidth: "1px",
              borderColor: "#2C2C2C",
              backgroundColor: "#1A1A1A",
              overflow: "hidden",
              px: 7,
              py: 6,
              "& .MuiDataGrid-container--top [role=row]": {
                background: "transparent",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-columnHeader .MuiDataGrid-menuIcon": {
                display: "none",
              },
              "& .css-jmgi9p::after": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                height: 0,
              },
              "&, [class^=MuiDataGrid]": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: 16,
                fontWeight: 700,
                color: "white",
              },
              "& .MuiDataGrid-cell": {
                fontSize: 14,
                color: "white",
                opacity: 0.7,
              },
              "& .MuiTablePagination-root": {
                fontSize: 12,
                color: "white",
              },
              "& .MuiTablePagination-selectLabel": {
                fontSize: 12,
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
              "& .MuiTablePagination-displayedRows": {
                fontSize: 12,
              },
            }}
          />
        </>
      )}
    </div>
  );
}

DataTable.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  isLoading: PropTypes.bool,
  searchFields: PropTypes.arrayOf(PropTypes.string),
};
