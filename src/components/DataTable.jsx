import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function DataTable(props) {
  const { rows, columns, isLoading } = props;

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
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
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
      )}
    </div>
  );
}

DataTable.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  isLoading: PropTypes.bool,
};
