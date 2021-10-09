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
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        items: [
          {
            item_name: productName,
            item_id: productID,
            price: priceUSD,
            index: 1,
            quantity: 1
          }
        ]
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// https://developers.google.com/tag-manager/ecommerce-ga4#measure_purchases
export function gtmEventFinishCheckout(priceUSD, productID, productName){
  const priceString = priceUSD ? priceUSD.toString() : '20';
  try {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        value: priceString,
        currency: 'USD',
        items: [ 
          {
            item_name: productName,
            item_id: productID,
            price: priceUSD,
            quantity: 1
          }
        ]
      }
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventExerciseFailure(exerciseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'exercise_failure',
      'exercise_uuid': exerciseUUID,
      'course_title': courseTitle
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventExerciseSuccess(exerciseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'exercise_success',
      'exercise_uuid': exerciseUUID,
      'course_title': courseTitle
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

export function gtmEventSubmitMultipleChoice(exerciseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'submit_multiple_choice',
      'exercise_uuid': exerciseUUID,
      'course_title': courseTitle
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventClickCheat(exerciseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'click_cheat',
      'exercise_uuid': exerciseUUID,
      'course_title': courseTitle
    });
  } catch (err) {
    console.log(err);
  }
}

export function gtmEventClickExerciseNavigation(exerciseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'click_exercise_navigation',
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
