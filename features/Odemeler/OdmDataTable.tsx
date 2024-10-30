import DataTableFrame from "@/components/Tables/DataTableFrame";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useCallback, useState } from "react";
import { dateFormatNormal } from "@/utils/helpers";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import {
  stringColumn,
  actionColumn,
  dateColumn,
  priceColumn,
} from "@/components/Tables/columns";
import { deleteOdeme } from "@/app/actions/deleteData";

const useFakeMutation = () => {
  return useCallback(
    (item) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (item.id?.trim() === "") {
            reject(new Error("Karekod Boş Olamaz"));
          } else {
            resolve({
              id: item.id,
              karekod: item.karekod,
              tarih: item.tarih,
              tutar: item.tutar,
              durum: item.durum,
            });
          }
        }, 200);
      }),
    []
  );
};

const OdmDataTable = ({ odemeDurum, odemeler }) => {
  const [onayBoxInf, setOnayBoxInf] = useState<OnayBoxInf>({
    isOpen: false,
    content: "",
    onClickHandler: async () => {},
    functionData: {},
  });
  const mutateRow = useFakeMutation();

  const fetchOdemeData = useCallback(async () => {
    await axiosFetch({
      method: "GET",
      url: "/odemeler/" + odemeDurum,
    });
  }, [odemeDurum]);

  useEffect(() => {
    fetchOdemeData();
  }, [odemeDurum]);

  const processRowUpdate = useCallback(
    async (newRow) => {
      const newRecord = {
        id: newRow.id,
        isletmeId: newRow.isletmeId,
        projeId: newRow.projeId,
        karekod: newRow.karekod,
        tarih: dateFormatNormal(newRow.tarih),
        tutar: newRow.tutar,
        durum: newRow.durum,
      };
      await axiosFetch({
        method: "POST",
        url:
          "/odemeguncelle/" +
          newRecord.isletmeId +
          "/" +
          newRecord.projeId +
          "/" +
          newRecord.id,
        requestConfig: {
          data: newRecord,
        },
      });
      setOpenSnack(true);
      fetchOdemeData();
      const res = await mutateRow(newRow);
      return res;
    },

    [mutateRow]
  );

  const handleDialogClose = () => {
    setOnayBoxInf((prevFormData) => ({
      ...prevFormData,
      isOpen: false,
    }));
  };

  const odemeDeleteHandler = async ({ isletmeId }: { isletmeId: string }) => {
    try {
      const response = await deleteOdeme(id, projeId, isletmeId);
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

  const handleProcessRowUpdateError = useCallback((error) => {
    response.message = error;
  }, []);

  const columns = [
    stringColumn("unvan", "Unvan", 400),
    stringColumn("vergiNo", "Vergi No", 110, {
      cellClassName: "boldandcolorcell",
    }),
    dateColumn("baslamaTarihi", "Proje Başlama", 100),
    stringColumn("program", "Proje", 250),
    stringColumn("karekod", "Karekod", 100, {
      cellClassName: "boldandcolorcell",
      editable: true,
    }),

    dateColumn("tarih", "Tarih", 100, {
      editable: true,
    }),
    priceColumn("tutar", "Tutar", 120, {
      cellClassName: "boldandcolorcell",
      editable: true,
    }),
    {
      field: "durum",
      headerName: "Durum",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: ["ÖDENDİ", "BEKLEMEDE"],
      headerClassName: "header",
      headerAlign: "left",
      align: "left",
    },
    stringColumn("gecenGunsayisi", "Gün", 80),
    actionColumn({
      align: "center",
      renderCell: (params: GridRenderCellParams, index: number) => {
        const isletmeId = params.row.isletmeId;
        const projeId = params.row.projeId;
        const id = params.row.id;
        return (
          <IconButton
            key={index}
            size="small"
            color="error"
            onClick={() => {
              setOnayBoxInf({
                isOpen: true,
                content: "İlgili Ödeme Silinecek Onaylıyor musunuz ?",
                onClickHandler: odemeDeleteHandler,
                functionData: { id, projeId, isletmeId },
              });
            }}
          >
            <DeleteIcon />
          </IconButton>
        );
      },
    }),
  ];

  return (
    <>
      <div style={{ height: "100%", width: "100%" }}>
        <DataTableFrame
          getRowHeight={() => "auto"}
          getEstimatedRowHeight={() => 200}
          density="standard"
          columns={columns}
          data={odemeler}
          disableColumnResize
          disableDensitySelector
          disableColumnFilter
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
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

export default OdmDataTable;
