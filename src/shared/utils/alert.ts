import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

class Alert {
  static MySwal = withReactContent(Swal);

  constructor() {}

  static confirm(
    title: React.ReactNode,
    message: React.ReactNode,
    callback: (response: SweetAlertResult) => void,
    okText?: string,
    cancelText?: string
  ): void {
    Alert.MySwal.fire({
      title,
      icon: "question",
      html: message,
      showLoaderOnConfirm: true,
      confirmButtonText: okText || "Proceed",
      denyButtonText: cancelText || "Cancel",
      showDenyButton: true,
    }).then((result: SweetAlertResult) => {
      callback(result);
    });
  }

  static error(
    title: React.ReactNode,
    message: React.ReactNode,
    okText?: string
  ): void {
    Alert.MySwal.fire({
      title,
      icon: "error",
      html: message,
      showLoaderOnConfirm: true,
      confirmButtonText: okText || "OK",
      showDenyButton: false,
    });
  }
}

export default Alert;
