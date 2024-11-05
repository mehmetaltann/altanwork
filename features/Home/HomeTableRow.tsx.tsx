import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ProjeForm from "@/components/Forms/ProjeForm";
import OdemeForm from "@/components/Forms/OdemeForm";
import ModalIconButton from "@/components/modals/ModalIconButton";
import OnayBox from "@/components/Ui/OnayBox";
import { toast } from "react-toastify";
import { getChangedValues, dateFormat } from "@/utils/helpers";
import { Fragment, useState } from "react";
import { updateOdeme, updateProje } from "@/app/actions/updateData";
import { deleteOdeme, deleteProje } from "@/app/actions/deleteData";
import { handleResponseMsg } from "@/utils/toast-helper";
import { Isletme, Odeme, Proje } from "@/lib/types/types";
import {
  Table,
  Typography,
  IconButton,
  TableBody,
  Box,
  TableRow,
  TableCell,
  Collapse,
  Divider,
  Modal,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  height: "35vh",
  width: { xs: "85%", sm: "65%", md: "60%", lg: "40%", xl: "35%" },
  overflow: "auto",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

function Item({ name }: { name: string }) {
  const colorMap: { [key: string]: string } = {
    "Devam Ediyor": "success.main",
    "Başarıyla Tamamlandı": "info.main",
    Durduruldu: "error.main",
    "Başarısız Tamamlandı": "error.main",
    "Bilgi Yok": "error.main",
  };
  const color = colorMap[name] || "inherit";

  return (
    <TableCell width="10%" sx={{ color: color, fontWeight: 500 }}>
      {name}
    </TableCell>
  );
}

interface OnayBoxInf {
  isOpen: boolean;
  content: string;
  onClickHandler: (data: { isletmeId?: string }) => Promise<void>;
  functionData: {
    isletmeId?: string;
  };
}

interface HomeTableRowProps {
  isletme: Isletme;
  proje: Proje;
  projeIndex: number | any;
  setSearchData: (data: any) => void;
}

const HomeTableRow = ({
  proje,
  projeIndex,
  setSearchData,
  isletme,
}: HomeTableRowProps) => {
  const {
    _id,
    baslamaTarihi,
    tamamlanmaTarihi,
    takipTarihi,
    sure,
    program,
    durum,
    odemeler,
  } = proje;

  const [openArrow, setOpenArrow] = useState<boolean>(false);
  const [openEditProjeModal, setOpenEditProjeModal] = useState<boolean>(false);
  const [initalOdemeData, setInitalOdemeData] = useState<Odeme>({
    _id: "",
    destek: "",
    durum: "",
    karekod: "",
    tarih: "",
    tutar: 0,
  });
  const [openEditOdemeModal, setOpenEditOdemeModal] = useState<boolean>(false);

  const [onayBoxInf, setOnayBoxInf] = useState<OnayBoxInf>({
    isOpen: false,
    content: "",
    onClickHandler: async () => {},
    functionData: {},
  });

  const totalPayment = odemeler
    ? odemeler.reduce((n, { tutar }) => n + tutar, 0).toFixed(2)
    : 0;

  const projeEditSubmitHandler = async (values: any) => {
    delete proje.odemeler;
    const editProjeRecord = getChangedValues(values, proje);
    try {
      const res = await updateProje(isletme._id, proje._id, editProjeRecord);
      handleResponseMsg(res);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        _id: isletme._id,
      }));
    } catch (error) {
      toast.error("Proje güncellenmedi, bir hata oluştu");
    } finally {
      setOpenEditProjeModal(false);
    }
  };

  const odemeEditSubmitHandler = async (values: any) => {
    const editOdemeRecord = {
      _id: initalOdemeData._id,
      karekod: values.karekod.toUpperCase(),
      tarih: values.tarih,
      tutar: values.tutar,
      durum: values.durum,
    };
    try {
      const res = await updateOdeme(editOdemeRecord);
      handleResponseMsg(res);
      setSearchData((prev: any) => ({
        ...prev,
        _id: isletme._id,
      }));
    } catch (error) {
      toast.error("Ödeme güncellenemedi, bir hata oluştu");
    } finally {
      setOpenEditOdemeModal(false);
    }
  };

  const projeDeleteHandler = async ({ projeId }: { projeId: string }) => {
    try {
      const res = await deleteProje(isletme._id, projeId);
      handleResponseMsg(res);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        __id: isletme._id,
      }));
      setOnayBoxInf((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast.error("Proje Silinemedi, bir hata oluştu");
    }
  };

  const odemeDeleteHandler = async ({
    projeId,
    odemeId,
  }: {
    projeId: string;
    odemeId: string;
  }) => {
    try {
      const res = await deleteOdeme(isletme._id, projeId, odemeId);
      handleResponseMsg(res);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        _id: isletme._id,
      }));
      setOnayBoxInf((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast.error("Ödeme Silinemedi, bir hata oluştu");
    }
  };

  return (
    <Fragment>
      {onayBoxInf.isOpen && (
        <OnayBox onayBoxInf={onayBoxInf} setOnayBoxInf={setOnayBoxInf} />
      )}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="left" width="1%">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenArrow(!openArrow)}
            color="primary"
          >
            {openArrow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" width="1%">
          {projeIndex + 1}
        </TableCell>
        <TableCell align="left" width="15%">
          {program}
        </TableCell>
        <TableCell
          align="left"
          width="8%"
          sx={{ color: "success.main", fontWeight: 500 }}
        >
          {dateFormat(baslamaTarihi)}
        </TableCell>
        <TableCell align="left" width="5%">
          {sure}
        </TableCell>
        <TableCell align="left" width="7%">
          {dateFormat(tamamlanmaTarihi)}
        </TableCell>
        <TableCell align="left" width="7%">
          {dateFormat(takipTarihi)}
        </TableCell>
        <Item name={durum} />
        <TableCell
          align="left"
          width="10%"
          sx={{ color: "primary.main", fontWeight: 700 }}
        >
          {`${new Intl.NumberFormat("tr-TR", {
            minimumFractionDigits: 2,
          }).format(Number(totalPayment))} ₺`}
        </TableCell>
        <TableCell align="right" width="10%">
          {odemeler?.length === 0 && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                const isletmeId = isletme._id;
                setOnayBoxInf({
                  isOpen: true,
                  content: "Proje silinsin mi ?",
                  onClickHandler: () => projeDeleteHandler({ projeId: _id }),
                  functionData: { isletmeId },
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <ModalIconButton
            modalOpen={openEditProjeModal}
            setModalOpen={setOpenEditProjeModal}
            title={program}
          >
            <ProjeForm
              submitHandler={projeEditSubmitHandler}
              updateForm={1}
              initialData={proje}
              buttonName="GÜNCELLE"
            />
          </ModalIconButton>
        </TableCell>
      </TableRow>
      {odemeler && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={openArrow} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small">
                  <TableBody>
                    {odemeler.map((odeme, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" width="1%">
                          {index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row" width="20%">
                          {odeme.destek}
                        </TableCell>
                        <TableCell width="5%">{odeme.karekod}</TableCell>
                        <TableCell width="10%">
                          {dateFormat(odeme.tarih)}
                        </TableCell>
                        <TableCell
                          sx={{ color: "primary.main", fontWeight: 500 }}
                          width="10%"
                        >{`${new Intl.NumberFormat("tr-TR", {
                          minimumFractionDigits: 2,
                        }).format(odeme.tutar)} TL`}</TableCell>
                        {odeme.durum === "ÖDENDİ" && (
                          <TableCell
                            width="10%"
                            sx={{ color: "success.main", fontWeight: 500 }}
                          >
                            {odeme.durum}
                          </TableCell>
                        )}
                        {odeme.durum === "BEKLEMEDE" && (
                          <TableCell
                            width="10%"
                            sx={{ color: "error.main", fontWeight: 500 }}
                          >
                            {odeme.durum}
                          </TableCell>
                        )}
                        <TableCell width="10%">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              const isletmeId = isletme._id;
                              setOnayBoxInf({
                                isOpen: true,
                                content: "Ödeme silinsin mi?",
                                onClickHandler: () =>
                                  odemeDeleteHandler({
                                    projeId: _id,
                                    odemeId: odeme._id,
                                  }),
                                functionData: { isletmeId },
                              });
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            aria-label="edit"
                            size="small"
                            color="primary"
                            onClick={() => {
                              setOpenEditOdemeModal(true);
                              setInitalOdemeData(odeme);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <Box
                            sx={{
                              outline: 0,
                              border: "none",
                            }}
                          >
                            <Modal
                              open={openEditOdemeModal}
                              onClose={() => setOpenEditOdemeModal(false)}
                              sx={{
                                "& .MuiBackdrop-root": {
                                  backgroundColor: "transparent",
                                },
                              }}
                              aria-labelledby="dataForm"
                              aria-describedby="dataForm-description"
                            >
                              <Box sx={modalStyle}>
                                <Typography variant="h6">
                                  Ödeme Güncelle
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <OdemeForm
                                  submitHandler={odemeEditSubmitHandler}
                                  updateForm={1}
                                  initialData={initalOdemeData}
                                  buttonName="GÜNCELLE"
                                  isletme={isletme}
                                />
                              </Box>
                            </Modal>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
};

export default HomeTableRow;
