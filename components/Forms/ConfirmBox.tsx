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
    onClickHandler: (data: any) => void;
    functionData: any;
  };
  setOnayBoxInf: React.Dispatch<React.SetStateAction<any>>;
}

const ConfirmBox = ({ onayBoxInf, setOnayBoxInf }: OnayBoxProps) => {
  const { isOpen, content, onClickHandler, functionData } = onayBoxInf;
  const handleDialogClose = () => {
    setOnayBoxInf((prevFormData: any) => ({
      ...prevFormData,
      isOpen: false,
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ p: 5 }}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="error">
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

export default ConfirmBox;
