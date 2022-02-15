import { createToast } from "mosha-vue-toastify";

export function notify({ type, text }) {
  createToast(
    { title: text.toString() },
    {
      type,
      timeout: 3000,
      toastBackgroundColor: color(type),
      position: "bottom-right",
    }
  );
}

function color(type) {
  if (type === "danger") {
    return "#C05460";
  }
  return "#C08f54";
}
