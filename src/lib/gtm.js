// make sure scripts are included in HTML head

// Reduces the value of in GTM
// according to the purchase rate after starting a session
const checkoutToPurchasePercent = .1;

const gemsToUSDRatio = .001;

export function gtmEventRegister(){
  try {
    window.dataLayer.push({
      'event': 'register',
      'interaction-type': false,
      value: .25
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventStartCheckout(priceUSD){
  try {
    window.dataLayer.push({
      'event': 'startCheckout',
      'interaction-type': false,
      value: priceUSD * checkoutToPurchasePercent
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventPurchaseCourse(priceGems){
  try {
    window.dataLayer.push({
      'event': 'purchaseCourse',
      'interaction-type': false,
      value: priceGems * gemsToUSDRatio
    });
  } catch (err) {
    console.log(err);
  }
}
