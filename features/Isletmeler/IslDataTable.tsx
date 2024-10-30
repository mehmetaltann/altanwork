import React, { useState } from "react";
import DataTableFrame from "../../components/Tables/DataTableFrame";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { stringColumn, actionColumn } from "@/components/Tables/columns";
import { deleteIsletme } from "@/app/actions/deleteData";
import { Isletme } from "@/lib/types/types";

interface OnayBoxInf {
  isOpen: boolean;
  content: string;
  onClickHandler: (data: { isletmeId: string }) => Promise<void>;
  functionData: {
    isletmeId?: string;
  };
}

const IslDataTable = ({ isletmeler }: { isletmeler: Isletme[] }) => {
  const [onayBoxInf, setOnayBoxInf] = useState<OnayBoxInf>({
    isOpen: false,
    content: "",
    onClickHandler: async () => {},
    functionData: {},
  });

  const handleDialogClose = () => {
    setOnayBoxInf((prevFormData) => ({
      ...prevFormData,
      isOpen: false,
    }));
  };

  const isletmeDeleteHandler = async ({ isletmeId }: { isletmeId: string }) => {
    try {
      const response = await deleteIsletme(isletmeId);
      console.log(response);
      if (response.status) {
        toast.success(response.msg);
        handleDialogClose();
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
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
                  functionData: { isletmeId: isletmeId || "" },
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
      <Dialog open={onayBoxInf.isOpen} onClose={handleDialogClose}>
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>
          <DialogContentText>{onayBoxInf.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            İptal
          </Button>
          <Button
            onClick={() => {
              const { isletmeId } = onayBoxInf.functionData;
              if (isletmeId) {
                onayBoxInf.onClickHandler({ isletmeId });
              }
            }}
            color="error"
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IslDataTable;
