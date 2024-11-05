"use client";
import MenuIcon from "@mui/icons-material/Menu";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import profileImg from "../../lib/assets/img/profile.jpg";
import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";

import {
  Menu,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  MenuItem,
  Avatar,
} from "@mui/material";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface Page {
  title: string;
  link: string;
}

const pages: Page[] = [
  { title: "ANASAYFA", link: "/" },
  { title: "PROJELER", link: "projeler" },
  { title: "ÖDEMELER", link: "odemeler" },
  { title: "İŞLETMELER", link: "isletmeler" },
];

const NavBar: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ArchitectureIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ALTAN - WORKAPP
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ title, link }) => (
                <MenuItem
                  key={title}
                  onClick={() => {
                    router.push(`/${link}`);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">{title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <ArchitectureIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Mehmet ALTAN
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
              gap: "1rem",
              marginRight: "4rem",
            }}
          >
            {pages.map(({ title, link }) => (
              <Button
                key={title}
                onClick={() => router.push(`/${link}`)}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                {title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  textAlign: "center",
                  borderRadius: "100%",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={profileImg}
                  height={"50"}
                  width={"50"}
                  alt="profilepic"
                  objectFit="cover"
                />
              </Box>
            </IconButton>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => router.push("/parametreler")}>
                <Link href={"/parametreler"} style={{ textDecoration: "none" }}>
                  <Typography textAlign="center">Parametreler</Typography>
                </Link>
              </MenuItem>

              <MenuItem onClick={() => router.push("/register")}>
                <Link href={"/register"} style={{ textDecoration: "none" }}>
                  <Typography textAlign="center">Yeni Kullanıcı</Typography>
                </Link>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  signOut({ callbackUrl: "/login", redirect: true });
                }}
              >
                <Typography textAlign="center">Çıkış Yap</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
