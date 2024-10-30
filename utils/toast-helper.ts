import { toast } from "react-toastify";

export const handleResponseMsg = (res: any) => {
  if (res.status) {
    toast.success(res.msg);
  } else {
    toast.error(res.msg);
  }
};
