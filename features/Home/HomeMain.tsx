"use client";
import Grid from "@mui/material/Grid2";
import HomeInfoSection from "./HomeInfoSection";
import HomeSearchBar from "./HomeSearchBar";
import HomeTransections from "./HomeTransections";
import HomeTableSection from "./HomeTableSection";
import { useState, useEffect, Fragment } from "react";
import { fetchIsletme } from "@/app/actions/fetchData";
import { PageWrapper } from "../../components/Layouts/Wrappers";
import { handleResponseMsg } from "@/utils/toast-helper";
import { Loader } from "@/components/Ui/Loader";
import { Stack } from "@mui/material";

interface SearchData {
  unvan: string;
  vergiNo: string;
  firmaId: string;
}

const initialSearchData: SearchData = {
  unvan: "",
  vergiNo: "",
  firmaId: "",
};

const HomeMain = () => {
  const [searchData, setSearchData] = useState<SearchData>(initialSearchData);
  const [isletme, setIsletme] = useState<any>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  useEffect(() => {
    const handleResponse = (res: any) => {
      if (res.status) {
        setIsletme(res.data);
      } else {
        handleResponseMsg(res);
        setSearchData(initialSearchData);
        setIsLoading(false);
      }
    };

    const fetchData = async () => {
      const { unvan, vergiNo, firmaId } = searchData;

      const key = unvan || vergiNo || firmaId;
      const type = unvan ? "unvan" : vergiNo ? "vergiNo" : "id";

      if (key) {
        setIsLoading(true);
        const res = await fetchIsletme(key, type);
        handleResponse(res);
      }
    };

    const timeoutId = setTimeout(fetchData, 600);

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
            {isletme.projeler?.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <HomeTableSection
                  setSearchData={setSearchData}
                  isletme={isletme}
                />
              </Grid>
            )}
          </Fragment>
        ) : (
          <Grid size={{ xs: 12 }}>
            {isLoading ? (
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  xs: 12,
                }}
              >
                <HomeSearchBar
                  searchData={searchData}
                  setSearchData={setSearchData}
                />
                <Loader />
              </Stack>
            ) : (
              <HomeSearchBar
                searchData={searchData}
                setSearchData={setSearchData}
              />
            )}
          </Grid>
        )}
      </Grid>
    </PageWrapper>
  );
};

export default HomeMain;
