import { dateFormat } from "@/utils/helpers";

interface ColumnConfig {
  field: string;
  headerName: string;
  minWidth?: number;
  headerClassName?: string;
  type?: string;
  headerAlign?: "left" | "right" | "center";
  align?: "left" | "right" | "center";
  renderCell?: (params: any) => any;
  valueFormatter?: (params: any) => any;
  [key: string]: any;
}

export const dateColumn = (
  fieldName: string,
  headerName: string,
  minWidth: number = 100,
  rest?: object
): ColumnConfig => {
  return {
    field: fieldName,
    headerName: headerName,
    minWidth: minWidth,
    headerClassName: "header",
    type: "date",
    headerAlign: "left",
    align: "left",
    valueFormatter: (params) => dateFormat(params?.value) || "N/A",
    renderCell: (params) => dateFormat(params.value) || "N/A",
    ...rest,
  };
};

export const stringColumn = (
  fieldName: string,
  headerName: string,
  width: number,
  rest?: object
): ColumnConfig => {
  return {
    field: fieldName,
    headerName: headerName,
    width: width,
    headerClassName: "header",
    headerAlign: "left",
    align: "left",
    ...rest,
  };
};

export const priceColumn = (
  fieldName: string,
  headerName: string,
  width: number,
  rest?: object
): ColumnConfig => {
  return {
    field: fieldName,
    headerName: headerName,
    width: width,
    headerClassName: "header",
    headerAlign: "left",
    align: "left",
    type: "number",
    renderCell: (params) => {
      const value = params.value !== undefined ? params.value : 0;
      return `${value.toFixed(2)} TL`;
    },
    ...rest,
  };
};

export const numberColumn = (
  fieldName: string,
  headerName: string,
  width: number,
  rest?: object
): ColumnConfig => {
  return {
    field: fieldName,
    headerName: headerName,
    width: width,
    headerClassName: "header",
    headerAlign: "left",
    align: "left",
    type: "number",
    filterable: false,
    valueFormatter: ({ value }) =>
      `${value !== undefined ? value.toFixed() : "N/A"}`,
    ...rest,
  };
};

export const actionColumn = (rest?: object): ColumnConfig => {
  return {
    field: "action",
    headerName: "Ok",
    width: 60,
    headerClassName: "header",
    headerAlign: "center",
    align: "right",
    filterable: false,
    sortable: false,
    ...rest,
  };
};
