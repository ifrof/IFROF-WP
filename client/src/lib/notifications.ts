import { toast } from "sonner";

export const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast.message(message);
  }
};

export const showSuccessNotification = (message: string) => {
  toast.success(message);
};

export const showErrorNotification = (message: string) => {
  toast.error(message);
};

export const showInfoNotification = (message: string) => {
  toast.message(message);
};
