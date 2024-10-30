import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ProjeForm from "@/components/Forms/ProjeForm";
import OdemeForm from "@/components/Forms/OdemeForm";
import ModalIconButton from "@/components/modals/ModalIconButton";
import { toast } from "react-toastify";
import { getChangedValues, dateFormat } from "@/utils/helpers";
import { Fragment, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { updateProje } from "@/app/actions/updateData";
import { deleteOdeme, deleteProje } from "@/app/actions/deleteData";
import { handleResponseMsg } from "@/utils/toast-helper";

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
  if (name === "Devam Ediyor") {
    return (
      <TableCell width="10%" sx={{ color: "success.main", fontWeight: 500 }}>
        {name}
      </TableCell>
    );
  } else if (
    name === "Durduruldu" ||
    name === "Başarısız Tamamlandı" ||
    name === "Bilgi Yok"
  ) {
    return (
      <TableCell width="10%" sx={{ color: "error.main", fontWeight: 500 }}>
        {name}
      </TableCell>
    );
  } else if (name === "Başarıyla Tamamlandı") {
    return (
      <TableCell width="10%" sx={{ color: "info.main", fontWeight: 500 }}>
        {name}
      </TableCell>
    );
  }
  return null; // Farklı bir durum olmadığında null döndür
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
  data: {
    id: string;
    isletmeId: string;
    baslamaTarihi: string;
    tamamlanmaTarihi: string;
    takipTarihi: string;
    notlar: string;
    sure: string;
    program: string;
    izleyici: string;
    durum: string;
    odemeler: Array<{
      id: string;
      karekod: string;
      projeId: string;
      tarih: string;
      tutar: number;
      destek: string;
      durum: string;
    }>;
  };
  index: number;
  setSearchData: (data: any) => void;
}

const HomeTableRow = ({ data, index, setSearchData }: HomeTableRowProps) => {
  const {
    id,
    isletmeId,
    baslamaTarihi,
    tamamlanmaTarihi,
    takipTarihi,
    notlar,
    sure,
    program,
    izleyici,
    durum,
    odemeler,
  } = data;

  const [openArrow, setOpenArrow] = useState<boolean>(false);
  const [openEditProjeModal, setOpenEditProjeModal] = useState<boolean>(false);
  const [initalOdemeData, setInitalOdemeData] = useState<any>(null);
  const [openEditOdemeModal, setOpenEditOdemeModal] = useState<boolean>(false);

  const [onayBoxInf, setOnayBoxInf] = useState<OnayBoxInf>({
    isOpen: false,
    content: "",
    onClickHandler: async () => {},
    functionData: {},
  });

  const totalPayment = odemeler
    .reduce((n, { tutar }) => n + tutar, 0)
    .toFixed(2);

  const projeInitialValues = {
    baslamaTarihi,
    tamamlanmaTarihi,
    takipTarihi,
    notlar,
    sure,
    program,
    izleyici,
    durum,
  };

  const handleDialogClose = () => {
    setOnayBoxInf((prevFormData) => ({
      ...prevFormData,
      isOpen: false,
    }));
  };

  const handleResponse = (res: any) => {
    if (res.status) {
      toast.success(res.msg);
    } else {
      toast.error(res.msg);
    }
  };

  const projeEditSubmitHandler = async (values: any) => {
    const editProjeRecord = getChangedValues(values, projeInitialValues);
    try {
      const res = await updateProje(
        projeInitialValues.projeId,
        editProjeRecord
      );
      handleResponseMsg(res);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        id: values.isletmeId,
      }));
    } catch (error) {
      toast.error("An error occurred while updating isletme.");
    } finally {
      setOpenEditProjeModal(false);
    }
  };

  const odemeEditSubmitHandler = async (values: any) => {
    const editOdemeRecord = {
      id: values.id,
      karekod: values.karekod.toUpperCase(),
      tarih: values.tarih,
      tutar: values.tutar,
      durum: values.durum,
    };
    try {
      const res = await updateProje(
        projeInitialValues.projeId,
        editOdemeRecord
      );
      handleResponseMsg(res);
      setOpenEditOdemeModal(false);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        id: isletmeId,
      }));
      toast.success("Ödeme güncellendi");
    } catch (error) {
      toast.error("An error occurred while updating payment.");
    }
  };

  const projeDeleteHandler = async ({ projeId }: { projeId: string }) => {
    try {
      const res = await deleteProje(isletmeId, projeId);
      handleResponseMsg(res);
      setSearchData((prevFormData:any) => ({
        ...prevFormData,
        id: isletmeId,
      }));
      setOnayBoxInf((prevFormData) => ({
        ...prevFormData,
        isOpen: false,
      }));
    } catch (error) {
      toast.error("An error occurred while deleting project.");
    }
  };

  const odemeDeleteHandler = async ({ projeId, id }: { projeId: string; id: string }) => {
    try {
      const res = await deleteOdeme(isletmeId, projeId, id);
      handleResponseMsg(res);
      setSearchData((prevFormData:any) => ({
        ...prevFormData,
        id: isletmeId,
      }));
      setOnayBoxInf((prevFormData) => ({
        ...prevFormData,
        isOpen: false,
      }));
    } catch (error) {
      toast.error("An error occurred while deleting payment.");
    }
  };

  return (
    <Fragment>
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
          {index + 1}
        </TableCell>
        <TableCell align="left" width="15%">
          {program}
        </TableCell>
        <TableCell align="left" width="8%" sx={{ color: "success.main", fontWeight: 500 }}>
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
        <TableCell align="left" width="10%" sx={{ color: "primary.main", fontWeight: 700 }}>
          {`${new Intl.NumberFormat("tr-TR", {
            minimumFractionDigits: 2,
          }).format(totalPayment)} ₺`}
        </TableCell>
        <TableCell align="right" width="15%">
          <ModalIconButton
            icon={<EditIcon />}
            title="Proje Düzenle"
            onClick={() => setOpenEditProjeModal(true)}
          />
          <ModalIconButton
            icon={<DeleteIcon />}
            title="Proje Sil"
            onClick={() => {
              setOnayBoxInf({
                isOpen: true,
                content: "Proje silinsin mi?",
                onClickHandler: () => projeDeleteHandler({ projeId: id }),
                functionData: { isletmeId },
              });
            }}
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={openArrow} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Ödemeler
              </Typography>
              <Table size="small">
                <TableBody>
                  {odemeler.map((odeme) => (
                    <TableRow key={odeme.id}>
                      <TableCell width="15%">
                        {odeme.karekod}
                      </TableCell>
                      <TableCell width="15%">
                        {dateFormat(odeme.tarih)}
                      </TableCell>
                      <TableCell width="10%">
                        {`${new Intl.NumberFormat("tr-TR", {
                          minimumFractionDigits: 2,
                        }).format(odeme.tutar)} ₺`}
                      </TableCell>
                      <TableCell width="10%">
                        {odeme.durum}
                      </TableCell>
                      <TableCell width="15%">
                        <ModalIconButton
                          icon={<EditIcon />}
                          title="Ödeme Düzenle"
                          onClick={() => {
                            setInitalOdemeData(odeme);
                            setOpenEditOdemeModal(true);
                          }}
                        />
                        <ModalIconButton
                          icon={<DeleteIcon />}
                          title="Ödeme Sil"
                          onClick={() => {
                            setOnayBoxInf({
                              isOpen: true,
                              content: "Ödeme silinsin mi?",
                              onClickHandler: () => odemeDeleteHandler({ projeId: id, id: odeme.id }),
                              functionData: { isletmeId },
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Proje Edit Modal */}
      <Modal
        open={openEditProjeModal}
        onClose={() => setOpenEditProjeModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <ProjeForm
            onSubmit={projeEditSubmitHandler}
            initialValues={projeInitialValues}
            setOpenModal={setOpenEditProjeModal}
          />
        </Box>
      </Modal>

      {/* Ödeme Edit Modal */}
      <Modal
        open={openEditOdemeModal}
        onClose={() => setOpenEditOdemeModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <OdemeForm
            onSubmit={odemeEditSubmitHandler}
            initialValues={initalOdemeData}
            setOpenModal={setOpenEditOdemeModal}
          />
        </Box>
      </Modal>

      {/* Onay Box */}
      <Dialog
        open={onayBoxInf.isOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Onay</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {onayBoxInf.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Hayır</Button>
          <Button
            onClick={() => {
              onayBoxInf.onClickHandler(onayBoxInf.functionData);
            }}
            autoFocus
          >
            Evet
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default HomeTableRow;

