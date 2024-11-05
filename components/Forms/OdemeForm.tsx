import * as Yup from "yup";
import FormTextField from "./ui/FormTextField";
import FormDatePicker from "./ui/FormDatePicker";
import FormSelect from "./ui/FormSelect";
import SendIcon from "@mui/icons-material/Send";
import { Form, Formik, Field } from "formik";
import { Stack, MenuItem, Button } from "@mui/material";
import { Fragment, useEffect, useCallback, useState } from "react";
import { fetchDesteks } from "@/app/actions/fetchData";
import { Isletme, Parameter, OdemeWithoutId } from "@/lib/types/types";

interface OdemeFormProps {
  initialData: OdemeWithoutId;
  submitHandler: (values: OdemeWithoutId) => void;
  isletme: Isletme;
  updateForm?: number;
  buttonName?: string;
}

const OdemeForm: React.FC<OdemeFormProps> = ({
  initialData,
  submitHandler,
  isletme,
  updateForm = 0,
  buttonName = "EKLE",
}) => {
  const [destekler, setDestekler] = useState<Parameter[]>([]);

  const fetchDestekData = useCallback(async () => {
    try {
      const response = await fetchDesteks();
      setDestekler(response);
    } catch (error) {
      console.error("Destek verileri yüklenirken hata oluştu:", error);
    }
  }, []);

  useEffect(() => {
    fetchDestekData();
  }, [fetchDestekData]);

  const validateSchema = Yup.object().shape({
    karekod: Yup.string().required("Boş Olamaz"),
    tutar: Yup.number()
      .required("Boş Olamaz")
      .positive("Tutar pozitif olmalıdır"),
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
          <Stack spacing={2} sx={{ pl: 1 }}>
            {updateForm === 0 && (
              <Fragment>
                <Field name="projeId" component={FormSelect} label="Program">
                  {isletme.projeler?.map(
                    ({ program, baslamaTarihi, _id }, index) => (
                      <MenuItem value={_id} key={index}>
                        {program} -{" "}
                        {new Date(baslamaTarihi).toLocaleDateString()}
                      </MenuItem>
                    )
                  )}
                </Field>
                <Field name="destek" component={FormSelect} label="Destek">
                  {destekler.map(({ isim }, index) => (
                    <MenuItem value={isim} key={index}>
                      {isim}
                    </MenuItem>
                  ))}
                </Field>
              </Fragment>
            )}

            <Stack direction={{ md: "row" }} spacing={1}>
              <FormDatePicker
                sx={{ width: "100%" }}
                name="tarih"
                label="Tarih"
                size="small"
              />
              <FormTextField
                sx={{ width: "100%" }}
                name="karekod"
                label="Karekod"
                size="small"
              />
              <FormTextField
                sx={{ width: "100%" }}
                name="tutar"
                label="Tutar"
                size="small"
                type="number"
              />
            </Stack>
            {updateForm === 1 && (
              <Field name="durum" component={FormSelect} label="Durum">
                <MenuItem value="BEKLEMEDE">BEKLEMEDE</MenuItem>
                <MenuItem value="ÖDENDİ">ÖDENDİ</MenuItem>
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

export default OdemeForm;
