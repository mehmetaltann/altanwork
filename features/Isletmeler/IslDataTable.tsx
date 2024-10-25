import DataTableFrame from "../../components/Tables/DataTableFrame";
import DeleteIcon from "@mui/icons-material/Delete";
import OnayBox from "@/components/Ui/Onaybox";
import { useState } from "react";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import { stringColumn, actionColumn } from "@/components/Tables/columns";
import { deleteIsletme } from "@/app/actions/deleteData";

const IslDataTable = ({ isletmeler }: any) => {
  const [onayBoxInf, setOnayBoxInf] = useState({
    isOpen: false,
    content: "",
    onClickHandler: "",
    functionData: {},
  });

  const isletmeDeleteHandler = async ({ isletmeId }) => {
    const response = await deleteIsletme(isletmeId)
    toast.success(response.msg);
    setOnayBoxInf((prevFormData) => ({
      ...prevFormData,
      isOpen: false,
    }));
  };

  const columns = [
    stringColumn("unvan", "Unvan", 500),
    stringColumn("vergiNo", "Vergi No", 120, {
      cellClassName: "boldandcolorcell",
    }),
    stringColumn("naceKodu", "Sektör", 400),
    stringColumn("mail", "E-Mail", 250),
    stringColumn("notlar", "Notlar", 200),
    actionColumn({
      align: "center",
      renderCell: (params:any, index:any) => {
        const isletmeId = params.row.id;
        if (params.row.numberOfProje) {
          return null;
        }
        return (
          <IconButton
          key={index}
          size="small"
          color="error"
          onClick={() => isletmeDeleteHandler(isletmeId)}
        >
          <DeleteIcon />
        </IconButton>
        );
      },
    }),
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataTableFrame
        getRowHeight={() => "auto"}
        getEstimatedRowHeight={() => 100}
        density="compact"
        columns={columns}
        data={isletmeler}
        disableColumnResize
        disableDensitySelector
        disableColumnFilter
      />
    </div>
  );
};

export default IslDataTable;
