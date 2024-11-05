import * as Yup from "yup";
import FormTextField from "./ui/FormTextField";
import FormDatePicker from "./ui/FormDatePicker";
import SendIcon from "@mui/icons-material/Send";
import FormSelect from "./ui/FormSelect";
import { Form, Formik, Field } from "formik";
import { Stack, MenuItem, Button } from "@mui/material";
import { useEffect, useCallback, useState } from "react";
import { fetchPrograms } from "@/app/actions/fetchData";
import { Parameter, ProjeWithoutId } from "@/lib/types/types";

interface ProjeFormProps {
  initialData: ProjeWithoutId;
  submitHandler: (values: ProjeWithoutId) => void;
  updateForm?: number;
  buttonName?: string;
}

const ProjeForm: React.FC<ProjeFormProps> = ({
  initialData,
  submitHandler,
  updateForm = 0,
  buttonName = "EKLE",
}) => {
  const [programlar, setProgramlar] = useState<Parameter[]>([]);

  const fetchProgramData = useCallback(async () => {
    try {
      const response = await fetchPrograms();
      setProgramlar(response);
    } catch (error) {
      console.error("Program verileri yüklenirken hata oluştu:", error);
    }
  }, []);

  useEffect(() => {
    fetchProgramData();
  }, [fetchProgramData]);

  const validateSchema = Yup.object().shape({
    sure: Yup.string().required("Boş Olamaz"),
  });

  return (
    <Formik
      initialValues={initialData}
      onSubmit={submitHandler}
      validationSchema={validateSchema}
      validateOnChange={false}
    >
      {({ values }) => (
        <Form>
          <Stack spacing={2} sx={{ pl: 1, pt: 1 }}>
            {updateForm === 0 && (
              <Field name="program" component={FormSelect} label="Program">
                {programlar?.map(({ isim }, index) => (
                  <MenuItem value={isim} key={index}>
                    {isim}
                  </MenuItem>
                ))}
              </Field>
            )}
            <Stack direction={"row"} spacing={1}>
              <FormDatePicker
                sx={{ width: "100%" }}
                name="baslamaTarihi"
                label="Başlama Tarihi"
                size="small"
              />
              <FormTextField name="sure" label="Süresi (ay)" size="small" />
              <FormDatePicker
                sx={{ width: "100%" }}
                name="tamamlanmaTarihi"
                label="Tamamalanma Tarihi"
                size="small"
              />
            </Stack>

            <FormDatePicker
              name="takipTarihi"
              label="Takip Tarihi"
              size="small"
            />
            <Stack direction={"row"} spacing={1}>
              <FormTextField
                sx={{ width: "100%" }}
                name="izleyici"
                label="İzleyici"
                size="small"
              />
              <FormTextField
                sx={{ width: "100%" }}
                name="notlar"
                label="Not"
                size="small"
              />
            </Stack>
            {updateForm === 1 && (
              <Field name="durum" component={FormSelect} label="Durum">
                <MenuItem value="Devam Ediyor">Devam Ediyor</MenuItem>
                <MenuItem value="Başarıyla Tamamlandı">
                  Başarıyla Tamamlandı
                </MenuItem>
                <MenuItem value="Başarısız Tamamlandı">
                  Başarısız Tamamlandı
                </MenuItem>
                <MenuItem value="Durduruldu">Durduruldu</MenuItem>
                <MenuItem value="Bilgi Yok">Bilgi Yok</MenuItem>
              </Field>
            )}
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

export default ProjeForm;
