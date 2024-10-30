import { Fragment, memo } from "react";
import { Card, Divider, Stack, Typography } from "@mui/material";
import { Isletme, Odeme } from "@/lib/types/types";
import Grid from "@mui/material/Grid2";
import HomeInfoBox from "./HomeInfoBox";

interface HomeInfoSectionProps {
  isletme: Isletme;
}

const HomeInfoSection: React.FC<HomeInfoSectionProps> = ({ isletme }) => {
  let emptyOdemeArray: Odeme[] = [];

  if (isletme && isletme.projeler && isletme.projeler.length > 0) {
    for (const proje of isletme.projeler) {
      if (proje.odemeler) {
        for (const odeme of proje.odemeler) {
          emptyOdemeArray.push(odeme);
        }
      }
    }
  }

  const totalPayment = emptyOdemeArray
    .reduce((n, { tutar }) => n + tutar, 0)
    .toFixed(2);

  return (
    <Fragment>
      {isletme && (
        <Card sx={{ mt: 1 }}>
          <Grid
            container
            sx={{ p: 3 }}
            spacing={{ xs: 4, md: 3 }}
            justifyContent={{ md: "space-between" }}
          >
            <Grid direction={"column"}>
              <Grid>
                <HomeInfoBox data={isletme.unvan} title={"Firma :"} />
              </Grid>
              <Grid>
                <Stack direction={{ md: "row" }} spacing={3}>
                  <HomeInfoBox data={isletme.vergiNo} title={"Vergi No :"} />
                  <HomeInfoBox data={isletme.sistemId} title={"Sistem ID :"} />
                  <HomeInfoBox data={isletme.notlar} title={"Bilgi :"} />
                </Stack>
              </Grid>
              <Grid>
                <HomeInfoBox data={isletme.naceKodu} title={"Sektör :"} />
              </Grid>
            </Grid>

            <Grid direction={"column"}>
              <Grid>
                <Stack direction={{ md: "row" }} spacing={3}>
                  <HomeInfoBox data={isletme.yetkili} title="Yetkili :" />
                  <HomeInfoBox data={isletme.mail} title="Mail :" />
                  <Stack direction={"row"} spacing={1}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "primary.main", fontWeight: 600 }}
                    >
                      Telefon :
                    </Typography>
                    <HomeInfoBox data={isletme.tel1} title={null} />
                    <Divider orientation="vertical" />
                    <HomeInfoBox data={isletme.tel2} title={null} />
                  </Stack>
                </Stack>
              </Grid>
              <Grid>
                <Stack direction={{ md: "row" }} spacing={3}>
                  <HomeInfoBox data={isletme.adres} title="Adres :" />
                  <HomeInfoBox data={isletme.uets} title="UETS :" />
                </Stack>
                <HomeInfoBox
                  data={totalPayment}
                  para="para"
                  title="Toplam Ödeme :"
                />
              </Grid>
            </Grid>
          </Grid>
        </Card>
      )}
    </Fragment>
  );
};

export default memo(HomeInfoSection);
