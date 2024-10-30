import OdemeForm from "@/components/Forms/OdemeForm";
import ProjeForm from "@/components/Forms/ProjeForm";
import IsletmeForm from "@/components/Forms/IsletmeForm";
import ModalButton from "@/components/modals/ModalButton";
import { todayDateInput, getChangedValues } from "@/utils/helpers";
import { Card, Stack } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { addOdeme, addProje } from "@/app/actions/insertData";
import { updateIsletme } from "@/app/actions/updateData";
import { Isletme } from "@/lib/types/types";
import { handleResponseMsg } from "@/utils/toast-helper";

interface HomeTransectionsProps {
  isletme: Isletme;
  setSearchData: (data: any) => void;
}

const HomeTransections: React.FC<HomeTransectionsProps> = ({
  isletme,
  setSearchData,
}) => {
  const [openUpdateIsletmeModal, setOpenUpdateIsletmeModal] = useState(false);
  const [openAddProjeModal, setOpenAddProjeModal] = useState(false);
  const [openAddOdemeModal, setOpenAddOdemeModal] = useState(false);

  const isletmeInitialValues = {
    _id: isletme._id,
    unvan: isletme.unvan,
    vergiNo: isletme.vergiNo,
    sistemId: isletme.sistemId,
    naceKodu: isletme.naceKodu,
    yetkili: isletme.yetkili,
    notlar: isletme.notlar ?? "",
    adres: isletme.adres,
    tel1: isletme.tel1 ?? "",
    tel2: isletme.tel2 ?? "",
    uets: isletme.uets ?? "",
    mail: isletme.mail ?? "",
  };

  const isletmeUpdatesubmitHandler = async (values: any) => {
    try {
      const editIsletmeRecord = getChangedValues(values, isletmeInitialValues);
      const res = await updateIsletme(
        isletmeInitialValues._id,
        editIsletmeRecord
      );
      handleResponseMsg(res);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        id: values.isletmeId,
      }));
    } catch (error) {
      toast.error("An error occurred while updating isletme.");
    } finally {
      setOpenUpdateIsletmeModal(false);
    }
  };

  const projeAddSubmitHandler = async (values: any) => {
    try {
      const projeId = "id" + Math.random().toString(16).slice(2);
      const addProjeRecord = {
        _id: projeId,
        id: projeId,
        isletmeId: isletme.id,
        baslamaTarihi: values.baslamaTarihi,
        tamamlanmaTarihi: values.tamamlanmaTarihi,
        takipTarihi: values.takipTarihi,
        notlar: values.notlar,
        sure: values.sure,
        program: values.program,
        izleyici: values.izleyici,
        durum: "Devam Ediyor",
        odemeler: [],
      };
      const res = await addProje(addProjeRecord);
      handleResponseMsg(res);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        id: values.isletmeId,
      }));
    } catch (error) {
      toast.error("An error occurred while adding the project.");
    } finally {
      setOpenAddProjeModal(false);
    }
  };

  const odemeAddSubmitHandler = async (values: any) => {
    try {
      const odemeId = "id" + Math.random().toString(16).slice(2);
      const addOdemeRecord = {
        _id: odemeId,
        isletmeId: isletme.id,
        id: odemeId,
        projeId: values.projeId,
        karekod: values.karekod,
        tarih: values.tarih,
        tutar: values.tutar,
        destek: values.destek,
        durum: "BEKLEMEDE",
      };
      const res = await addOdeme(addOdemeRecord);
      handleResponseMsg(res);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        id: values.isletmeId,
      }));
    } catch (error) {
      toast.error("An error occurred while adding the payment.");
    } finally {
      setOpenAddOdemeModal(false);
    }
  };

  return (
    <Card sx={{ mt: 1, p: 1 }}>
      <Stack
        direction={{ sm: "row" }}
        justifyContent={"space-around"}
        alignItems={"center"}
      >
        <ModalButton
          modalOpen={openUpdateIsletmeModal}
          setModalOpen={setOpenUpdateIsletmeModal}
          title="İsletme Bilgileri Güncelle"
          buttonTitle="Firma Bilgisi Güncelle"
          color="primary"
          maxW="33%"
          minW="33%"
          size="medium"
          maxh="4vh"
          endIconLogo="editnote"
        >
          <IsletmeForm
            submitHandler={isletmeUpdatesubmitHandler}
            initialData={isletmeInitialValues}
            buttonName="GÜNCELLE"
          />
        </ModalButton>

        <ModalButton
          title="Proje Ekle"
          buttonTitle="Proje Ekle"
          modalOpen={openAddProjeModal}
          setModalOpen={setOpenAddProjeModal}
          size="medium"
          maxW="33%"
          minW="33%"
          maxh="4vh"
          endIconLogo="project"
        >
          <ProjeForm
            submitHandler={projeAddSubmitHandler}
            initialData={{
              program: "",
              baslamaTarihi: todayDateInput,
              tamamlanmaTarihi: todayDateInput,
              takipTarihi: todayDateInput,
              sure: "",
              notlar: "",
              izleyici: "",
            }}
          />
        </ModalButton>

        <ModalButton
          title="Ödeme Ekle"
          buttonTitle="Ödeme Ekle"
          maxW="33%"
          minW="33%"
          maxh="4vh"
          modalOpen={openAddOdemeModal}
          setModalOpen={setOpenAddOdemeModal}
          size="medium"
          endIconLogo="payment"
        >
          <OdemeForm
            submitHandler={odemeAddSubmitHandler}
            isletme={isletme}
            initialData={{
              projeId: "",
              karekod: "",
              destek: "",
              tarih: todayDateInput,
              tutar: 0,
            }}
          />
        </ModalButton>
      </Stack>
    </Card>
  );
};

export default HomeTransections;
