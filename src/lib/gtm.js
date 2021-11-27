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

// https://developers.google.com/analytics/devguides/collection/ga4/reference/events#begin_checkout
export function gtmEventBeginCheckout(){
  try {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'USD',
        value: 25.00,
        items: [
          {
            item_id: 'pro_sub_id',
            item_name: 'pro_sub'
          }
        ]
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase
export function gtmEventFinishCheckout(){
  try {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        value: 25.00,
        transaction_id: Math.floor(Math.random() * 100000000).toString(),
        currency: 'USD',
        items: [ 
          {
            item_name: 'pro_sub',
            item_id: 'pro_sub_id'
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
