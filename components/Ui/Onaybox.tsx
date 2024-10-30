import { memo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

interface OnayBoxProps {
  onayBoxInf: {
    isOpen: boolean;
    content: string;
    onClickHandler: (data: { isletmeId: string }) => Promise<void>;
    functionData: {
      isletmeId?: string;
    };
  };
  setOnayBoxInf: React.Dispatch<
    React.SetStateAction<OnayBoxProps["onayBoxInf"]>
  >;
}

const OnayBox: React.FC<OnayBoxProps> = ({ onayBoxInf, setOnayBoxInf }) => {
  const { isOpen, content, onClickHandler, functionData } = onayBoxInf;

  const handleClose = () => {
    setOnayBoxInf((prevFormData) => ({
      ...prevFormData,
      isOpen: false,
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Hayır
        </Button>
        <Button
          onClick={() => onClickHandler(functionData)}
          color="success"
          autoFocus
        >
          Evet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(OnayBox);
