import AltanSelect from "@/components/Ui/AltanSelect";
import OdmDataTable from "./OdmDataTable";
import { useState } from "react";
import { DataTableWrapper } from "@/components/Layouts/Wrappers";
import { Typography, Paper, Stack } from "@mui/material";
import { Odeme } from "@/lib/types/types";

export const odemeDurumsData = [
  { value: "ÖDENDİ", label: "Ödendi" },
  { value: "BEKLEMEDE", label: "Beklemede" },
];

interface OdmTableContainerProps {
  odemeler: Odeme[];
}

const OdmTableContainer: React.FC<OdmTableContainerProps> = ({ odemeler }) => {
  const [odemeDurum, setOdemeDurum] = useState("BEKLEMEDE");

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
      <DataTableWrapper tableHeight={"78vh"} sx={{ p: { xs: 1, md: 2 } }}>
        <OdmDataTable odemeDurum={odemeDurum} odemeler={odemeler} />
      </DataTableWrapper>
    </Paper>
  );
};

export default OdmTableContainer;
