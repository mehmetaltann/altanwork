import DataTableFrame from "@/components/Tables/DataTableFrame";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmBox from "@/components/Forms/ConfirmBox";
import { toast } from "react-toastify";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { dateFormatNormal } from "@/utils/helpers";
import { IconButton } from "@mui/material";
import { deleteOdeme } from "@/app/actions/deleteData";
import { DisplayOdemes } from "@/lib/types/types";
import { handleResponseMsg } from "@/utils/toast-helper";
import { updateOdeme } from "@/app/actions/updateData";
import {
  stringColumn,
  actionColumn,
  dateColumn,
  priceColumn,
} from "@/components/Tables/columns";

interface OnayBoxInf {
  isOpen: boolean;
  content: string;
  onClickHandler: () => Promise<void>;
  functionData: { [key: string]: any };
}

interface OdmDataTableProps {
  odemeler: DisplayOdemes[];
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const useFakeMutation = () => {
  return useCallback(
    (item: DisplayOdemes) =>
      new Promise<DisplayOdemes>((resolve, reject) => {
        setTimeout(() => {
          if (item.karekod?.trim() === "") {
            reject(new Error("Karekod No Boş Olamaz"));
          } else {
            resolve({
              ...item,
            });
          }
        }, 200);
      }),
    []
  );
};

const OdmDataTable: React.FC<OdmDataTableProps> = ({ odemeler, setUpdate }) => {
  const [onayBoxInf, setOnayBoxInf] = useState<OnayBoxInf>({
    isOpen: false,
    content: "",
    onClickHandler: async () => {},
    functionData: {},
  });

  const mutateRow = useFakeMutation();

  const processRowUpdate = useCallback(
    async (newRow: DisplayOdemes) => {
      const newRecord = {
        _id: newRow.id,
        karekod: newRow.karekod,
        tarih: dateFormatNormal(newRow.tarih),
        tutar: newRow.tutar,
        durum: newRow.durum,
      };
      try {
        const res = await updateOdeme(newRow.isletmeId, newRecord);
        handleResponseMsg(res);
        const res2 = await mutateRow(newRow);
        setUpdate(true);
        return res2;
      } catch (error) {
        toast.error("Güncelleme sırasında hata oluştu.");
        throw error;
      }
    },
    [mutateRow]
  );

  const odemeDeleteHandler = async ({
    isletmeId,
    projeId,
    odemeId,
  }: {
    isletmeId: string;
    projeId: string;
    odemeId: string;
  }) => {
    try {
      const response = await deleteOdeme(isletmeId, projeId, odemeId);
      handleResponseMsg(response);
      setOnayBoxInf((prev) => ({ ...prev, isOpen: false }));
      setUpdate(true);
    } catch (error) {
      toast.error(`Ödeme Silinemedi, Bir hata oluştu : ${error}`);
    }
  };

  const handleProcessRowUpdateError = useCallback((error: Error) => {
    toast.error(error.message);
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
        const odemeId = params.row.id;
        return (
          <IconButton
            key={index}
            size="small"
            color="error"
            onClick={() => {
              setOnayBoxInf({
                isOpen: true,
                content: "İlgili Ödeme Silinecek Onaylıyor musunuz ?",
                onClickHandler: () =>
                  odemeDeleteHandler({ isletmeId, projeId, odemeId }),
                functionData: { isletmeId },
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
        {onayBoxInf.isOpen && (
          <ConfirmBox onayBoxInf={onayBoxInf} setOnayBoxInf={setOnayBoxInf} />
        )}
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
    </>
  );
};

export default OdmDataTable;
