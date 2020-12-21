// make sure scripts are included in HTML head

// method can be 'email', 'google', etc
export function gtmEventRegister(method){
  try {
    window.dataLayer.push({
      'event': 'sign_up',
      'interaction-type': false,
      'conversionValue': .25,
      'method': method
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

export function gtmEventPurchaseCourseDemo(priceGems){
  const gemsToUSDRatio = .001;
  try {
    window.dataLayer.push({
      'event': 'purchase-course-demo',
      'interaction-type': false,
      'conversionValue': priceGems * gemsToUSDRatio
    });
  } catch (err) {
    console.log(err);
  }
}
