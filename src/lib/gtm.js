// make sure scripts are included in HTML head

export function registerEvent(){
  try {
    window.dataLayer.push({
      'event': 'register',
      'interaction-type': true
    });
  } catch (err) {
    console.log(err);
  }
}
