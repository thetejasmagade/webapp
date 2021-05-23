import { createToast } from 'mosha-vue-toastify';

export function notify({type, text}){
  createToast(
    { title: text.toString() },
    {
      type,
      timeout: 3000,
      toastBackgroundColor: color(type)
    }
  );
}

function color(type){
  if (type === 'danger'){
    return '#C05460';
  }
  return '#6FBF54';
}
