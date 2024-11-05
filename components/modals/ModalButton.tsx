import React, { Fragment } from "react";
import SendIcon from "@mui/icons-material/Send";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import { Button, Modal, Box, Typography, Divider } from "@mui/material";

const iconMap = {
  send: <SendIcon />,
  payment: <PaymentsIcon />,
  project: <AccountTreeIcon />,
  editnote: <EditNoteIcon />,
  addnew: <AddToQueueIcon />,
};

interface ModalButtonProps {
  children: React.ReactNode;
  minW?: string;
  maxW?: string;
  maxh?: string;
  title: string;
  height?: { md: string; xs: string };
  minHeight: { md: string; xs: string; lg: string };
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  endIconLogo?: keyof typeof iconMap;
  buttonTitle?: string;
  variant?: "outlined" | "contained" | "text";
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  icon?: React.ReactNode;
  size?: "small" | "medium" | "large";
}

const ModalButton: React.FC<ModalButtonProps> = ({
  children,
  minW = "25vh",
  maxW = "35vh",
  maxh = "7vh",
  title,
  minHeight = { md: "40vh", xs: "40vh", lg: "40vh" },
  height = { md: "70vh", xs: "80vh" },
  color = "primary",
  endIconLogo = "send",
  buttonTitle = "EKLE",
  variant = "outlined",
  modalOpen,
  setModalOpen,
  icon,
  size = "small",
}) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    minHeight: minHeight,
    height: height,
    width: { xs: "85%", sm: "65%", md: "60%", lg: "40%", xl: "35%" },
    overflow: "auto",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
  };

  return (
    <Fragment>
      <Button
        color={color}
        size={size}
        variant={variant}
        startIcon={icon}
        endIcon={iconMap[endIconLogo] || iconMap.send}
        sx={{
          minWidth: minW,
          maxWidth: maxW,
          maxHeight: maxh,
        }}
        onClick={() => setModalOpen(true)}
      >
        {buttonTitle}
      </Button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6">{title}</Typography>
          <Divider sx={{ mb: 2 }} />
          {children}
        </Box>
      </Modal>
    </Fragment>
  );
};

export default ModalButton;
