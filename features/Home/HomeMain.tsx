"use client";
import Grid from "@mui/material/Grid2";
import { useState, useEffect, Fragment, SetStateAction } from "react";
import { fetchIsletme } from "@/app/actions/fetchData";
import { PageWrapper } from "../../components/Layouts/Wrappers";
import HomeInfoSection from "./HomeInfoSection";
import HomeSearchBar from "./HomeSearchBar";
import HomeTransections from "./HomeTransections";
import HomeTableSection from "./HomeTableSection";

interface SearchData {
  unvan: string;
  vergiNo: string;
  firmaId: string;
}

const HomeMain = () => {
  const [searchData, setSearchData] = useState<SearchData>({
    unvan: "",
    vergiNo: "",
    firmaId: "",
  });

  const [isletme, setIsletme] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const { unvan, vergiNo, firmaId } = searchData;
      console.log(unvan);
      if (unvan !== "") {
        const response = await fetchIsletme(unvan, "unvan");
        setIsletme(response.data);
      } else if (vergiNo !== "") {
        const response = await fetchIsletme(vergiNo, "vergiNo");
        setIsletme(response.data);
      } else if (firmaId !== "") {
        const response = await fetchIsletme(firmaId, "id");
        setIsletme(response.data);
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [searchData, fetchIsletme]);

  return (
    <PageWrapper>
      <Grid container alignItems={"center"} justifyContent={"center"}>
        {isletme ? (
          <Fragment>
            <Grid size={{ xs: 12 }}>
              <HomeSearchBar
                searchData={searchData}
                setSearchData={setSearchData}
                isletme={isletme}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <HomeInfoSection isletme={isletme} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <HomeTransections
                setSearchData={setSearchData}
                isletme={isletme}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <HomeTableSection
                setSearchData={setSearchData}
                isletme={isletme}
              />
            </Grid>
          </Fragment>
        ) : (
          <Grid size={{ xs: 12 }}>
            <HomeSearchBar
              searchData={searchData}
              setSearchData={setSearchData}
            />
          </Grid>
        )}
      </Grid>
    </PageWrapper>
  );
};

export default HomeMain;
