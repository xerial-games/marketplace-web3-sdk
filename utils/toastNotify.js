import { toast } from "react-toastify";

// // Allows you to add notifications in UI
// // type posible values: info, success, warning, error
function toastNotify(content, type) {
  toast(content, { type: type || "info" });
}

export default toastNotify;
