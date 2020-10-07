// make sure scripts are included in HTML head

export function gtmEventRegister(){
  try {
    window.dataLayer.push({
      'event': 'register',
      'interaction-type': false,
      'conversionValue': .25
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventStartCheckout(priceUSD){
  const checkoutToPurchasePercent = .05;
  try {
    window.dataLayer.push({
      'event': 'start-checkout',
      'interaction-type': false,
      'conversionValue': priceUSD * checkoutToPurchasePercent
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventFinishCheckout(priceUSD){
  try {
    window.dataLayer.push({
      'event': 'finish-checkout',
      'interaction-type': false,
      'conversionValue': priceUSD
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventPurchaseCourse(priceGems){
  const gemsToUSDRatio = .001;
  try {
    window.dataLayer.push({
      'event': 'purchase-course',
      'interaction-type': false,
      'conversionValue': priceGems * gemsToUSDRatio
    });
  } catch (err) {
    console.log(err);
  }
}
