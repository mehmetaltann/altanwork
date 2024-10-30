import IslTableContainer from "@/features/Isletmeler/IslTableContainer";
import Header from "@/components/Layouts/Header";
import { Isletme } from "@/lib/types/types";
import { fetchIsletmeler } from "../actions/fetchData";
import { Typography } from "@mui/material";
import { PageWrapper } from "@/components/Layouts/Wrappers";

export default async function page() {
  try {
    const isletmeler = (await fetchIsletmeler()) as Isletme[];

    return (
      <>
        <Header />
        <PageWrapper>
          <IslTableContainer isletmeler={isletmeler} />
        </PageWrapper>
      </>
    );
  } catch (error) {
    console.error("Error fetching isletmeler:", error);
    return <Typography>Error loading data</Typography>;
  }
}
