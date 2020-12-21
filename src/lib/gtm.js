// make sure scripts are included in HTML head

// recommended events:
// https://support.google.com/analytics/answer/9267735
// https://developers.google.com/gtagjs/reference/ga4-events

// method can be 'email', 'google', etc
export function gtmEventRegister(method){
  try {
    window.dataLayer.push({
      'event': 'sign_up',
      'interaction-type': false,
      'method': method,
      'value': .25,
      'currency': 'USD'
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventBeginCheckout(priceUSD, productID, productName){
  try {
    window.dataLayer.push({
      'event': 'begin_checkout',
      'interaction-type': false,
      'items': [ {
        'item_id': productID,
        'item_name': productName,
        'quantity': 1,
        'price': priceUSD,
        'currency': 'USD'
      } ],
      'value': priceUSD
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventFinishCheckout(priceUSD, productID, productName){
  try {
    window.dataLayer.push({
      'event': 'purchase',
      'interaction-type': false,
      'items': [ {
        'item_id': productID,
        'item_name': productName,
        'quantity': 1,
        'price': priceUSD,
        'currency': 'USD'
      } ],
      'value': priceUSD
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventPurchaseCourseWithGems(priceGems, courseName, isDemo){
  try {
    window.dataLayer.push({
      'event': 'spend_virtual_currency',
      'interaction-type': false,
      'item_name': `${courseName}${isDemo ? ' - Demo' : ''}`,
      'virtual_currency_name': 'Gems',
      'value': priceGems
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEarnGems(numGems){
  try {
    window.dataLayer.push({
      'event': 'earn_virtual_currency',
      'interaction-type': false,
      'virtual_currency_name': 'Gems',
      'value': numGems
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmUnlockAchievement(achievementID){
  try {
    window.dataLayer.push({
      'event': 'unlock_achievement',
      'interaction-type': false,
      'achievement_id': achievementID
    });
  } catch (err) {
    console.log(err);
  }
}
