import DataTableFrame from "@/components/Tables/DataTableFrame";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmBox from "@/components/Forms/ConfirmBox";
import { dateFormatNormal } from "@/utils/helpers";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { IconButton, Typography } from "@mui/material";
import { handleResponseMsg } from "@/utils/toast-helper";
import { DisplayProjects } from "@/lib/types/types";
import { updateProje } from "@/app/actions/updateData";
import { deleteProje } from "@/app/actions/deleteData";
import {
  stringColumn,
  actionColumn,
  dateColumn,
} from "@/components/Tables/columns";



interface OnayBoxInf {
  isOpen: boolean;
  content: string;
  onClickHandler: () => Promise<void>;
  functionData: { [key: string]: any };
}

interface PrjDataTableProps {
  projeDurum: string;
  projeler: DisplayProjects[];
}

const useFakeMutation = () => {
  return useCallback(
    (item: DisplayProjects) =>
      new Promise<DisplayProjects>((resolve, reject) => {
        setTimeout(() => {
          if (item.vergiNo?.trim() === "") {
            reject(new Error("Vergi No Boş Olamaz"));
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

const PrjDataTable: React.FC<PrjDataTableProps> = ({ projeler }) => {
  const [onayBoxInf, setOnayBoxInf] = useState<OnayBoxInf>({
    isOpen: false,
    content: "",
    onClickHandler: async () => {},
    functionData: {},
  });

  const mutateRow = useFakeMutation();

  const processRowUpdate = useCallback(
    async (newRow: DisplayProjects) => {
      const newRecord = {
        sure: newRow.sure,
        baslamaTarihi: dateFormatNormal(newRow.baslamaTarihi || ""),
        tamamlanmaTarihi: dateFormatNormal(newRow.tamamlanmaTarihi || ""),
        takipTarihi: dateFormatNormal(newRow.takipTarihi || ""),
        durum: newRow.durum,
      };

      try {
        const res = await updateProje(newRow.isletmeId, newRow.id, newRecord);
        handleResponseMsg(res);
        const res2 = await mutateRow(newRow);
        return res2;
      } catch (error) {
        toast.error("Güncelleme sırasında hata oluştu.");
        throw error;
      }
    },
    [mutateRow]
  );

  const projeDeleteHandler = async ({
    isletmeId,
    projeId,
  }: {
    isletmeId: string;
    projeId: string;
  }) => {
    try {
      const res = await deleteProje(isletmeId, projeId);
      handleResponseMsg(res);
      setOnayBoxInf((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast.error(`Proje Silinemedi, Bir hata oluştu : ${error}`);
    }
  };

  const handleProcessRowUpdateError = useCallback((error: Error) => {
    toast.error(error.message);
  }, []);

  const columns = [
    stringColumn("unvan", "Unvan", 360),
    stringColumn("vergiNo", "Vergi No", 110, {
      cellClassName: "boldandcolorcell",
      filterable: false,
    }),
    stringColumn("program", "Proje", 330),
    dateColumn("baslamaTarihi", "Başlangıç Tarihi", 100, {
      cellClassName: "boldandcolorcell",
      editable: true,
    }),
    {
      field: "sure",
      headerName: "Süre",
      width: 70,
      filterable: false,
      headerClassName: "header",
      preProcessEditCellProps: (params: any) => {
        const hasError = params.props.value.length < 1;
        return { ...params.props, error: hasError };
      },
      headerAlign: "left",
      align: "left",
      editable: true,
      renderCell: (params: any) => `${params.value} ay`,
    },
    dateColumn("tamamlanmaTarihi", "Tamamlanma Tarih", 100, {
      editable: true,
    }),
    dateColumn("takipTarihi", "Takip Tarih", 100, {
      cellClassName: "boldandcolorcell",
      editable: true,
    }),
    {
      field: "gecenGunsayisi",
      headerName: "Gün",
      width: 100,
      editable: true,
      headerClassName: "header",
      headerAlign: "left",
      cellClassName: "boldandcolorcell",
      align: "left",
      renderCell: (params: any) => {
        return (
          <Typography
            variant="body1"
            color={params.row.gecenGunsayisi < 5 ? "error" : "inherit"}
          >
            {params.row.gecenGunsayisi} Gün
          </Typography>
        );
      },
    },
    {
      field: "durum",
      headerName: "Durum",
      width: 120,
      editable: true,
      headerClassName: "header",
      headerAlign: "left",
      cellClassName: "boldandcolorcell",
      align: "left",
      type: "singleSelect",
      valueOptions: [
        "Devam Ediyor",
        "Başarıyla Tamamlandı",
        "Başarısız Tamamlandı",
        "Durduruldu",
        "Bilgi Yok",
      ],
    },
    actionColumn({
      align: "center",
      renderCell: (params: any) => {
        const isletmeId = params.row.isletmeId;
        const id = params.row.id;
        if (params.row.numberOfOdeme) {
          return null;
        } else {
          return (
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setOnayBoxInf({
                  isOpen: true,
                  content: "Proje silinsin mi?",
                  onClickHandler: () =>
                    projeDeleteHandler({ isletmeId, projeId: id }),
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
    <div style={{ height: "100%", width: "100%" }}>
      {onayBoxInf.isOpen && (
        <ConfirmBox onayBoxInf={onayBoxInf} setOnayBoxInf={setOnayBoxInf} />
      )}
      <DataTableFrame
        getRowHeight={() => "auto"}
        getEstimatedRowHeight={() => 100}
        density="standard"
        columns={columns}
        data={projeler}
        disableColumnResize
        disableDensitySelector
        disableColumnFilter
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />
    </div>
  );
};

export default PrjDataTable;
