// make sure scripts are included in HTML head

// recommended events:
// https://support.google.com/analytics/answer/9267735
// https://developers.google.com/gtagjs/reference/ga4-events

// method can be 'email', 'google', etc
export function gtmEventRegister(method){
  try {
    window.dataLayer.push({
      'event': 'sign_up',
      'method': method,
      'value': '.25',
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
      'items': [ {
        'item_id': productID,
        'item_name': productName,
        'quantity': 1,
        'price': priceUSD.toString(),
        'currency': 'USD'
      } ],
      'value': priceUSD.toString()
    });
  } catch (err) {
    console.log(err);
  }
}

// https://developers.google.com/tag-manager/ecommerce-ga4#measure_purchases
export function gtmEventFinishCheckout(priceUSD, productID, productName){
  try {
    window.dataLayer.push({
      'event': 'purchase',
      'ecommerce': {
        'purchase': {
          'value': priceUSD ? priceUSD.toString() : '20',
          'currency': 'USD',
          'items': [
            {
              'item_name': productName,
              'item_id': productID,
              'item_price': priceUSD.toString(),
              'quantity': 1
            }
          ]
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventExecuteCode(exerciseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'execute_code',
      'exercise_uuid': exerciseUUID,
      'course_title': courseTitle
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventOpenProModal(){
  try {
    window.dataLayer.push({
      'event': 'open_pro_modal'
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventEarnGems(numGems){
  try {
    window.dataLayer.push({
      'event': 'earn_virtual_currency',
      'virtual_currency_name': 'Gems',
      'value': numGems
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventUnlockAchievement(achievementID){
  try {
    window.dataLayer.push({
      'event': 'unlock_achievement',
      'achievement_id': achievementID
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventFinishCourse(courseName){
  try {
    window.dataLayer.push({
      'event': 'level_end',
      'level_name': courseName
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventSelectCourse(courseUUID, courseName){
  try {
    window.dataLayer.push({
      'event': 'select_item',
      'item_list_name': 'courses',
      'items': [ {
        'item_id': courseUUID,
        'item_name': courseName
      } ]
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventTutorialBegin(){
  try {
    window.dataLayer.push({
      'event': 'tutorial_begin'
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventTutorialComplete(){
  try {
    window.dataLayer.push({
      'event': 'tutorial_complete'
    });
  } catch (err) {
    console.log(err);
  }
}
