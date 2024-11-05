"use client";
import OdmDataTable from "./OdmDataTable";
import AltanSelect from "@/components/Ui/AltanSelect";
import { DataTableWrapper } from "@/components/Layouts/Wrappers";
import { useEffect, useState } from "react";
import { Typography, Paper, Stack } from "@mui/material";
import { DisplayOdemes } from "@/lib/types/types";
import { fetchOdemeler } from "@/app/actions/fetchData";
import { Loader } from "@/components/Ui/Loader";

interface OdemeDurum {
  value: string;
  label: string;
}

export const odemeDurumsData: OdemeDurum[] = [
  { value: "ÖDENDİ", label: "Ödendi" },
  { value: "BEKLEMEDE", label: "Beklemede" },
];

const OdmTableContainer: React.FC = () => {
  const [odemeDurum, setOdemeDurum] = useState<string>("BEKLEMEDE");
  const [odemeler, setOdemeler] = useState<DisplayOdemes[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOdemeler(odemeDurum);
        setOdemeler(response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    const timeoutId = setTimeout(fetchData, 200);

    return () => clearTimeout(timeoutId);
  }, [odemeDurum]);

  console.log(odemeler)

  return (
    <Paper>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ p: 1, ml: 2, mr: 2 }}
      >
        <Typography variant="h6" color="info.main">
          Ödemeler
        </Typography>
        <AltanSelect
          id="tarih"
          value={odemeDurum}
          minWidth="30ch"
          onChange={setOdemeDurum}
          data={odemeDurumsData}
          dataTextAttr="label"
          dataValueAttr="value"
        />
      </Stack>
      {!odemeler || odemeler?.length < 1 ? (
        <Loader />
      ) : (
        <DataTableWrapper tableHeight={"78vh"} sx={{ p: { xs: 1, md: 2 } }}>
          <OdmDataTable odemeler={odemeler} />
        </DataTableWrapper>
      )}
    </Paper>
  );
};

export default OdmTableContainer;
