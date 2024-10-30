import OdmTableContainer from "@/features/Odemeler/OdmTableContainer";
import { Odeme } from "@/lib/types/types";
import { fetchOdemeler } from "../actions/fetchData";
import { Typography } from "@mui/material";
import { PageWrapper } from "@/components/Layouts/Wrappers";

export default async function Odemeler() {
  try {
    const odemeler = (await fetchOdemeler("BEKLEMEDE")) as Odeme[];

    return (
      <PageWrapper>
        <OdmTableContainer odemeler={odemeler} />
      </PageWrapper>
    );
  } catch (error) {
    console.error("Error fetching isletmeler:", error);
    return <Typography>Error loading data</Typography>;
  }
}
