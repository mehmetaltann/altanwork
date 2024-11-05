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
import { Isletme, ProjeWithoutId } from "@/lib/types/types";
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

  const isletmeUpdatesubmitHandler = async (values: any) => {
    try {
      const { projeler, ...filtIsletme } = isletme;
      const editIsletmeRecord: any = getChangedValues(values, filtIsletme);
      const res = await updateIsletme(isletme._id, editIsletmeRecord);
      handleResponseMsg(res);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        firmaId: isletme._id,
      }));
    } catch (error) {
      toast.error("İşletme güncellenirken bir sorun oluştu");
    } finally {
      setOpenUpdateIsletmeModal(false);
    }
  };

  const projeAddSubmitHandler = async (values: ProjeWithoutId) => {
    try {
      const addProjeRecord = {
        ...values,
        durum: "Devam Ediyor",
        odemeler: [],
      };
      const res = await addProje(isletme._id, addProjeRecord);
      handleResponseMsg(res);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        firmaId: isletme._id,
      }));
    } catch (error) {
      toast.error("Proje Eklenirken Bir Hata Oluştu");
    } finally {
      setOpenAddProjeModal(false);
    }
  };

  const odemeAddSubmitHandler = async (values: any) => {
    try {
      const addOdemeRecord = {
        destek: values.destek,
        karekod: values.karekod,
        tarih: values.tarih,
        tutar: values.tutar,
        durum: "BEKLEMEDE",
      };
      const res = await addOdeme(isletme._id, values.projeId, addOdemeRecord);
      handleResponseMsg(res);
      setSearchData((prevFormData: any) => ({
        ...prevFormData,
        firmaId: isletme._id,
      }));
    } catch (error) {
      toast.error("Proje Eklenirken Bir Hata Oluştu");
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
          minHeight={{ md: "30vh", xs: "30vh", lg: "30vh" }}
        >
          <IsletmeForm
            submitHandler={isletmeUpdatesubmitHandler}
            initialData={isletme}
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
          minHeight={{ md: "30vh", xs: "30vh", lg: "30vh" }}
        >
          <ProjeForm
            submitHandler={projeAddSubmitHandler}
            initialData={{
              baslamaTarihi: todayDateInput,
              durum: "",
              izleyici: "",
              notlar: "",
              program: "",
              sure: "",
              takipTarihi: todayDateInput,
              tamamlanmaTarihi: todayDateInput,
              odemeler: [],
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
          minHeight={{ md: "30vh", xs: "30vh", lg: "30vh" }}
        >
          <OdemeForm
            submitHandler={odemeAddSubmitHandler}
            isletme={isletme}
            initialData={{
              karekod: "",
              destek: "",
              tarih: todayDateInput,
              tutar: 0,
              durum: "BEKLEMEDE",
            }}
          />
        </ModalButton>
      </Stack>
    </Card>
  );
};

export default HomeTransections;
