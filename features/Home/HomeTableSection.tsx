import HomeTableRow from "./HomeTableRow.tsx";
import { Fragment } from "react";
import { Isletme } from "@/lib/types/types";
import { Card } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface HomeTableSectionProps {
  isletme: Isletme;
  setSearchData: (data: any) => void;
}

const HomeTableSection: React.FC<HomeTableSectionProps> = ({
  isletme,
  setSearchData,
}) => {
  return (
    <Fragment>
      {isletme && isletme?.projeler?.length !== 0 && (
        <Card sx={{ p: 1, mt: 1 }}>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="project table"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Proje</TableCell>
                  <TableCell align="left">Başlama Tarihi</TableCell>
                  <TableCell align="left">Süre</TableCell>
                  <TableCell align="left">Bitiş Tarihi</TableCell>
                  <TableCell align="left">Takip Tarihi</TableCell>
                  <TableCell align="left">Durum</TableCell>
                  <TableCell align="left">Toplam Ödeme</TableCell>
                  <TableCell align="left">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isletme?.projeler?.toReversed().map((item, index) => (
                  <HomeTableRow
                    data={item}
                    key={item.id}
                    index={index}
                    setSearchData={setSearchData}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Fragment>
  );
};

export default HomeTableSection;
