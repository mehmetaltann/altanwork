"use client";
import PrjDataTable from "./PrjDataTable";
import AltanSelect from "@/components/Ui/AltanSelect";
import { DataTableWrapper } from "@/components/Layouts/Wrappers";
import { useEffect, useState } from "react";
import { Typography, Paper, Stack } from "@mui/material";
import { DisplayProjects } from "@/lib/types/types";
import { fetchProjeler } from "@/app/actions/fetchData";
import { Loader } from "@/components/Ui/Loader";

interface ProjeDurum {
  value: string;
  label: string;
}

export const projeDurumsData: ProjeDurum[] = [
  { value: "Devam Ediyor", label: "Devam Ediyor" },
  { value: "Başarıyla Tamamlandı", label: "Başarıyla Tamamlandı" },
  { value: "Başarısız Tamamlandı", label: "Başarısız Tamamlandı" },
  { value: "Durduruldu", label: "Durduruldu" },
  { value: "Bilgi Yok", label: "Bilgi Yok" },
  { value: "Tümü", label: "Tümü" },
];

const PrjTableContainer: React.FC = () => {
  const [projeDurum, setProjeDurum] = useState<string>("Devam Ediyor");
  const [projeler, setProjeler] = useState<DisplayProjects[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProjeler(projeDurum);
        setProjeler(response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    const timeoutId = setTimeout(fetchData, 200);

    return () => clearTimeout(timeoutId);
  }, [projeDurum]);

  return (
    <Paper>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ p: 1, ml: 2, mr: 2 }}
      >
        <Typography variant="h6" color="info.main">
          Projeler
        </Typography>
        <AltanSelect
          id="projeDurum"
          defaultValue={"Devam Ediyor"}
          value={projeDurum}
          minWidth="30ch"
          onChange={setProjeDurum}
          data={projeDurumsData}
          dataTextAttr="label"
          dataValueAttr="value"
        />
      </Stack>
      {!projeler || projeler?.length < 1 ? (
        <Loader />
      ) : (
        <DataTableWrapper tableHeight={"78vh"} sx={{ p: { xs: 1, md: 2 } }}>
          <PrjDataTable projeDurum={projeDurum} projeler={projeler} />
        </DataTableWrapper>
      )}
    </Paper>
  );
};

export default PrjTableContainer;
