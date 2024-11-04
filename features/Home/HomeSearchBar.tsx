import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalButton from "@/components/modals/ModalButton";
import IsletmeForm from "@/components/Forms/IsletmeForm";
import OnayBox from "@/components/Ui/Onaybox";
import { toast } from "react-toastify";
import { useState, ChangeEvent } from "react";
import { addIsletme } from "@/app/actions/insertData";
import { deleteIsletme } from "@/app/actions/deleteData";
import { handleResponseMsg } from "@/utils/toast-helper";
import {
  Card,
  TextField,
  Typography,
  Box,
  Stack,
  IconButton,
} from "@mui/material";

interface HomeSearchBarProps {
  searchData: {
    unvan: string;
    vergiNo: string;
    firmaId: string;
  };
  setSearchData: React.Dispatch<
    React.SetStateAction<{
      unvan: string;
      vergiNo: string;
      firmaId: string;
    }>
  >;
  isletme?: {
    id: string;
    projeler: any[];
    [key: string]: any;
  };
}

interface OnayBoxInfo {
  isOpen: boolean;
  content: string;
  onClickHandler: (data: { isletmeId: string }) => Promise<void>;
  functionData: { isletmeId: string };
}

const HomeSearchBar: React.FC<HomeSearchBarProps> = ({
  searchData,
  setSearchData,
  isletme,
}) => {
  const [openAddIsletmeModal, setOpenAddIsletmeModal] = useState(false);
  const [onayBoxInf, setOnayBoxInf] = useState<OnayBoxInfo>({
    isOpen: false,
    content: "",
    onClickHandler: async () => {},
    functionData: { isletmeId: "" },
  });

  const handleInputsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData((prevFormData) => ({
      ...prevFormData,
      [name]: value.toLocaleUpperCase("tr-TR"),
    }));
  };

  const isletmeAddSubmitHandler = async (values: any) => {
    const isletmeId = "id" + Math.random().toString(20).slice(2);
    try {
      const addIsletmeRecord = {
        id: isletmeId,
        unvan: values.unvan.toLocaleUpperCase("tr-TR"),
        vergiNo: values.vergiNo,
        sistemId: values.sistemId,
        naceKodu: values.naceKodu,
        yetkili: values.yetkili,
        notlar: values.notlar,
        adres: values.adres,
        tel1: values.tel1,
        tel2: values.tel2,
        uets: values.uets,
        mail: values.mail,
        projeler: [],
      };
      const response = await addIsletme(addIsletmeRecord);
      handleResponseMsg(response);
      setOpenAddIsletmeModal(false);
    } catch (error) {
      toast.error("İşletme eklenemedi, bir hata oluştu");
    } finally {
      setOnayBoxInf((prevFormData) => ({
        ...prevFormData,
        isOpen: false,
      }));
      setSearchData({
        unvan: "",
        vergiNo: values.vergiNo,
        firmaId: "",
      });
    }
  };

  const isletmeDeleteHandler = async ({ isletmeId }: { isletmeId: string }) => {
    const response = await deleteIsletme(isletmeId);
    setSearchData({
      unvan: "",
      vergiNo: "",
      firmaId: "",
    });
  };

  return (
    <Card>
      {onayBoxInf.isOpen && (
        <OnayBox onayBoxInf={onayBoxInf} setOnayBoxInf={setOnayBoxInf} />
      )}
      <Stack
        sx={{ p: 1 }}
        alignItems={{ md: "center" }}
        justifyContent={"space-between"}
        direction={{ md: "row" }}
      >
        <Grid
          container
          spacing={4}
          sx={{ p: 1 }}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <Grid sx={{ xs: { pr: 1 }, md: { pr: 4 } }}>
            <Stack
              direction="row"
              alignItems={"center"}
              justifyContent={"center"}
            >
              <SearchIcon sx={{ color: "primary.main" }} />
              <Typography sx={{ color: "primary.main" }} variant="h6">
                İşletme Ara
              </Typography>
            </Stack>
          </Grid>

          <Grid container justifyContent={"center"} alignItems={"center"}>
            <Grid>
              <TextField
                disabled={
                  searchData.firmaId !== "" || searchData.vergiNo !== ""
                }
                label="Unvan"
                name="unvan"
                variant="outlined"
                value={searchData.unvan}
                onChange={handleInputsChange}
              />
            </Grid>
            <Grid>
              <TextField
                disabled={searchData.firmaId !== "" || searchData.unvan !== ""}
                label="Vergi Numarası"
                variant="outlined"
                name="vergiNo"
                type="number"
                value={searchData.vergiNo}
                onChange={handleInputsChange}
              />
            </Grid>
            <Grid>
              <TextField
                disabled={searchData.vergiNo !== "" || searchData.unvan !== ""}
                label="Id"
                name="firmaId"
                variant="outlined"
                type="number"
                value={searchData.firmaId}
                onChange={handleInputsChange}
              />
            </Grid>
            {isletme?.projeler.length === 0 && (
              <Grid>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    const isletmeId = isletme._id;
                    console.log(isletmeId);
                    setOnayBoxInf({
                      isOpen: true,
                      content: "İlgili İşletme Silinecek Onaylıyor musunuz ?",
                      onClickHandler: isletmeDeleteHandler,
                      functionData: { isletmeId },
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Box sx={{ pr: { md: 9 }, pt: { xs: 2, md: 0 } }}>
          <ModalButton
            title="İşletme Ekle"
            buttonTitle="Yeni İşletme Kayıt"
            variant="contained"
            modalOpen={openAddIsletmeModal}
            setModalOpen={setOpenAddIsletmeModal}
            size="large"
            endIconLogo="addnew"
          >
            <IsletmeForm
              submitHandler={isletmeAddSubmitHandler}
              initialData={{
                _id: "",
                id: "",
                unvan: "",
                vergiNo: "",
                sistemId: "",
                naceKodu: "",
                yetkili: "",
                notlar: "",
                adres: "",
                tel1: "",
                tel2: "",
                uets: "",
                mail: "",
              }}
            />
          </ModalButton>
        </Box>
      </Stack>
    </Card>
  );
};

export default HomeSearchBar;
