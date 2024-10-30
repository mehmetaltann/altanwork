"use client";
import * as Yup from "yup";
import FormTextField from "@/components/Ui/FormTextField";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Grid from "@mui/material/Grid2";
import { toast } from "react-toastify";
import { Parameter } from "@/lib/types/types";
import { useState } from "react";
import { addProgram } from "@/app/actions/insertData";
import { deleteProgram } from "@/app/actions/deleteData";
import { Form, Formik } from "formik";
import { handleResponseMsg } from "@/utils/toast-helper";
import {
  Card,
  Typography,
  Stack,
  Button,
  TableRow,
  TableCell,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableContainer,
} from "@mui/material";

interface ProgramProps {
  programlar: Parameter[];
}

const Destekler: React.FC<ProgramProps> = ({ programlar }) => {
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values: { isim: string }) => {
    let programId = "id" + Math.random().toString(20).slice(2);
    const newProgramRecord = { isim: values.isim, id: programId };
    const res = await addProgram(newProgramRecord);
    handleResponseMsg(res);
  };

  const validateSchema = Yup.object().shape({
    isim: Yup.string().required("Gerekli").min(4, "En az 4 Karakter"),
  });

  return (
    <Card sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography color={"primary.main"} variant="h6">
            Programlar
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Formik
            initialValues={{
              isim: "",
            }}
            onSubmit={submitHandler}
            validationSchema={validateSchema}
          >
            {({ isSubmitting }) => (
              <Form>
                <Stack spacing={3} sx={{ p: 2 }}>
                  <FormTextField name="isim" label="İsim" size="small" />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    sx={{ borderRadius: "5%", minWidth: 120 }}
                    size="large"
                    variant="contained"
                    color={"success"}
                    endIcon={<SendIcon />}
                  >
                    Program Ekle
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="left">İsim</TableCell>
                  <TableCell align="center">Sil</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  programlar.map(({ _id, isim }, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{isim}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={async () => {
                            setLoading(true);
                            const res = await deleteProgram(_id);
                            if (res.status) {
                              toast.success(res.msg);
                            } else {
                              toast.error(res.msg);
                            }
                            setLoading(false);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Destekler;
