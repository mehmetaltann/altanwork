import EditIcon from "@mui/icons-material/Edit";
import { Modal, Box, Typography, Divider, IconButton } from "@mui/material";
import { Fragment } from "react";

interface ModalIconButtonProps {
  children: React.ReactNode;
  title: string | undefined;
  height?: { md: string; xs: string };
  color?: "inherit" | "primary" | "secondary" | "default";
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  size?: "small" | "medium" | "large";
}

const ModalIconButton = ({
  children,
  title,
  height = { md: "70vh", xs: "80vh" },
  color = "primary",
  modalOpen,
  setModalOpen,
  size = "small",
}: ModalIconButtonProps) => {
  const modalStyle = {
    position: "absolute",
    top: "40%",
    left: "50%",
    height: height,
    width: { sm: "70%", xs: "85%", md: "50%", lg: "45%", xl: "45%" },
    overflow: "auto",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
  };

  return (
    <Fragment>
      <IconButton size={size} color={color} onClick={() => setModalOpen(true)}>
        <EditIcon />
      </IconButton>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{ "& .MuiBackdrop-root": { backgroundColor: "transparent" } }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6">
            {title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {children}
        </Box>
      </Modal>
    </Fragment>
  );
};

export default ModalIconButton;
