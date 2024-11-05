import * as Yup from "yup";
import FormTextField from "./ui/FormTextField";
import SendIcon from "@mui/icons-material/Send";
import FormSelect from "./ui/FormSelect";
import { Form, Formik, Field } from "formik";
import { Stack, MenuItem, Button } from "@mui/material";
import { useEffect, useCallback, useState } from "react";
import { Isletme, Sektor } from "@/lib/types/types";
import { fetchSectors } from "@/app/actions/fetchData";

interface IsletmeFormProps {
  initialData: Isletme;
  submitHandler: (values: Isletme) => void;
  buttonName?: string;
}

const IsletmeForm: React.FC<IsletmeFormProps> = ({
  initialData,
  submitHandler,
  buttonName = "EKLE",
}) => {
  const [sektorler, setSektorler] = useState<Sektor[]>([]);

  const fetchSektorData = useCallback(async () => {
    try {
      const response = await fetchSectors();
      setSektorler(response);
    } catch (error) {
      console.error("Sektör verileri yüklenirken hata oluştu:", error);
    }
  }, []);

  useEffect(() => {
    fetchSektorData();
  }, [fetchSektorData]);

  const validateSchema = Yup.object().shape({
    unvan: Yup.string().required("Gerekli").min(2, "En az 2 karakter"),
    sistemId: Yup.string().required("Boş Olamaz"),
    vergiNo: Yup.string().required("Boş Olamaz").min(10, "En az 10 karakter"),
    naceKodu: Yup.string().required("Boş Olamaz"),
    yetkili: Yup.string().required("Boş Olamaz"),
    adres: Yup.string().required("Boş Olamaz"),
    mail: Yup.string().email("Geçersiz e-posta").required("Boş Olamaz"),
  });

  return (
    <Formik
      initialValues={initialData}
      onSubmit={submitHandler}
      validationSchema={validateSchema}
    >
      {({ values }) => (
        <Form>
          <Stack spacing={2} sx={{ pl: 1 }}>
            <FormTextField
              sx={{ width: "100%" }}
              name="unvan"
              label="Firma İsmi"
              size="small"
            />
            <Stack direction={"row"} spacing={1}>
              <FormTextField
                sx={{ width: "100%" }}
                name="vergiNo"
                label="Vergi No"
                size="small"
              />
              <FormTextField
                sx={{ width: "100%" }}
                name="sistemId"
                label="Sistem ID"
                size="small"
              />
            </Stack>
            <Field name="naceKodu" component={FormSelect} label="Sektör">
              {sektorler?.map(({ isim }, index) => (
                <MenuItem value={isim} key={index}>
                  {isim}
                </MenuItem>
              ))}
            </Field>
            <Stack direction={"row"} spacing={1}>
              <FormTextField
                sx={{ width: "100%" }}
                name="mail"
                label="E-Mail"
                size="small"
              />
              <FormTextField
                sx={{ width: "100%" }}
                name="yetkili"
                label="Yetkili"
                size="small"
              />
            </Stack>
            <Stack direction={"row"} spacing={1}>
              <FormTextField
                sx={{ width: "100%" }}
                name="tel1"
                label="Telefon 1"
                size="small"
              />
              <FormTextField
                sx={{ width: "100%" }}
                name="tel2"
                label="Telefon 2"
                size="small"
              />
            </Stack>
            <FormTextField
              sx={{ width: "100%" }}
              name="adres"
              label="Adres"
              size="small"
            />
            <FormTextField
              sx={{ width: "100%" }}
              name="notlar"
              label="Notlar"
              size="small"
            />
            <FormTextField
              sx={{ width: "100%" }}
              name="uets"
              label="UETS Adresi"
              size="small"
            />
            <Button
              type="submit"
              sx={{ width: "100%" }}
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
            >
              {buttonName}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default IsletmeForm;
