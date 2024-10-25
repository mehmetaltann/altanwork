import CustomNoRowsOverlay from "./CustomNoRowsOverlay";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { trTR } from "@mui/x-data-grid/locales";

const DataTableFrame = (props: any) => {
  const {
    columns,
    data,
    sxProps = {},
    slotsProps = {},
    slotPropsOverrides = {},
    ...rest
  } = props;

  return (
    <DataGrid
      columns={columns}
      rows={data}
      localeText={trTR.components.MuiDataGrid.defaultProps.localeText || {}}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 30 } },
        ...data?.initialState,
      }}
      pageSizeOptions={[30, 60, 90]}
      slots={{
        noRowsOverlay: CustomNoRowsOverlay,
        toolbar: GridToolbar,
        ...slotsProps,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
        ...slotPropsOverrides,
      }}
      sx={{
        boxShadow: 2,
        "& .MuiDataGrid-cell:hover": {
          color: "primary.main",
        },
        "& .boldandcolorcell": {
          color: "primary.main",
          fontWeight: "600",
        },
        "& .header": {
          color: "primary.main",
          fontWeight: "600",
        },
        ".highlight": {
          bgcolor: "#DDDDDD",
          "&:hover": {
            bgcolor: "#EEEEEE",
          },
        },
        "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
          py: 1,
        },
        "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
          py: "9px",
        },
        "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
          py: "22px",
        },
        ...sxProps,
      }}
      disableRowSelectionOnClick
      disableColumnSelector
      disableColumnMenu
      {...rest}
    />
  );
};

export default DataTableFrame;
