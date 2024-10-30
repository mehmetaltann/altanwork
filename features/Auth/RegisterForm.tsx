"use client";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Link from "next/link";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useActionState } from "react";
import { addUser } from "@/app/actions/insertData";
import {
  Avatar,
  Button,
  Typography,
  TextField,
  Box,
  Container,
} from "@mui/material";

const RegisterForm: React.FC = () => {
  const [formState, formAction] = useActionState(addUser, null);

  useEffect(() => {
    if (Array.isArray(formState)) return;
    if (formState?.status) {
      toast.success(formState?.msg);
      (document.getElementById("registerForm") as HTMLFormElement).reset();
    } else {
      toast.error(formState?.msg);
    }
  }, [formState]);

  const inputClassName =
    "p-2.5 border-b-[gray] border-[none] border-b border-solid";

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <HowToRegIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Kullanıcı Kayıt
        </Typography>
        <Box
          component="form"
          id="registerForm"
          action={formAction}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            variant="outlined"
            required
            fullWidth
            id="username"
            label="Kullanıcı Adı"
            name="isim"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-Mail"
            name="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Şifre"
            type="password"
            id="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Kayıt Ol
          </Button>

          <Typography>
            Mevcut Hesabınız Varmı ?
            <Link
              href="/login"
              style={{ textDecoration: "none", color: "black" }}
            >
              {" Giriş"}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterForm;
