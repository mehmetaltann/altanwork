import DataTableFrame from "../../components/Tables/DataTableFrame";
import DeleteIcon from "@mui/icons-material/Delete";
import OnayBox from "@/components/Ui/OnayBox";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import { stringColumn, actionColumn } from "@/components/Tables/columns";
import { deleteIsletme } from "@/app/actions/deleteData";
import { DisplayIsletmes } from "@/lib/types/types";
import { handleResponseMsg } from "@/utils/toast-helper";
import { useState } from "react";

interface OnayBoxInf {
  isOpen: boolean;
  content: string;
  onClickHandler: (data: any) => void;
  functionData: { [key: string]: any };
}

const IslDataTable = ({ isletmeler }: { isletmeler: DisplayIsletmes[] }) => {
  const [onayBoxInf, setOnayBoxInf] = useState<OnayBoxInf>({
    isOpen: false,
    content: "",
    onClickHandler: async () => {},
    functionData: {},
  });

  const isletmeDeleteHandler = async ({ isletmeId }: { isletmeId: string }) => {
    try {
      const res = await deleteIsletme(isletmeId);
      handleResponseMsg(res);
      setOnayBoxInf((prev) => ({
        ...prev,
        isOpen: false,
      }));
    } catch (error) {
      toast.error("İşletme Silinemedi, bir hata oluştu");
    }
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
      renderCell: (params: GridRenderCellParams, index: number) => {
        const isletmeId = params.row._id;
        if (params.row.numberOfProje) {
          return null;
        } else {
          return (
            <IconButton
              key={index}
              size="small"
              color="error"
              onClick={() => {
                setOnayBoxInf({
                  isOpen: true,
                  content: "İlgili İşletme Silinecek Onaylıyor musunuz?",
                  onClickHandler: isletmeDeleteHandler,
                  functionData: { isletmeId },
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          );
        }
      },
    }),
  ];

  return (
    <>
      {onayBoxInf.isOpen && (
        <OnayBox onayBoxInf={onayBoxInf} setOnayBoxInf={setOnayBoxInf} />
      )}
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
    </>
  );
};

export default IslDataTable;
