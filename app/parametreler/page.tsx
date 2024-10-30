import Header from "@/components/Layouts/Header";
import Grid from "@mui/material/Grid2";
import Programlar from "@/features/Parametreler/Programlar";
import Destekler from "@/features/Parametreler/Destekler";
import { PageWrapper } from "@/components/Layouts/Wrappers";
import { Parameter } from "@/lib/types/types";
import { fetchDesteks, fetchPrograms } from "../actions/fetchData";

export default async function Parametreler() {
  const destekler = (await fetchDesteks()) as Parameter[];
  const programlar = (await fetchPrograms()) as Parameter[];

  return (
    <>
      <Header />
      <PageWrapper>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: 2 }}>
            <Programlar programlar={programlar}/>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: 2 }}>
            <Destekler destekler={destekler}/>
          </Grid>
        </Grid>
      </PageWrapper>
    </>
  );
}
