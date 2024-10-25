"use client";
import Grid from "@mui/material/Grid2";
import { useState, useEffect, Fragment } from "react";
import { fetchIsletme } from "@/app/actions/fetchData";
import { PageWrapper } from "../../components/Layouts/Wrappers";
import TableSection from "./TableSection";
import Transections from "./Transections";
import InfoSection from "./InfoSection";
import HomeSearchBar from "./HomeSearchBar";

interface SearchData {
  unvan: string;
  vergiNo: string;
  firmaId: string;
}

const Main = () => {
  const [searchData, setSearchData] = useState<SearchData>({
    unvan: "",
    vergiNo: "",
    firmaId: "",
  });
  const [isletme, setIsletme] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const { unvan, vergiNo, firmaId } = searchData;
      if (unvan !== "") {
        const response = await fetchIsletme(unvan, "unvan");
        console.log(response);
      } else if (vergiNo !== "") {
        const response = await fetchIsletme(vergiNo, "vergino");
        console.log(response);
      } else if (firmaId !== "") {
        const response = await fetchIsletme(firmaId, "id");
        console.log(response);
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [searchData, fetchIsletme]);

  return (
    <PageWrapper>
      <Grid container alignItems={"center"} justifyContent={"center"}>
        {isletme ? (
          <HomeSearchBar
            searchData={searchData}
            setSearchData={setSearchData}
            isletme={isletme}
          />
        ) : (
          <HomeSearchBar
            searchData={searchData}
            setSearchData={setSearchData}
          />
        )}
      </Grid>
    </PageWrapper>
  );
};

export default Main;
