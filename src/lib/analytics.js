import mixpanel from 'mixpanel-browser';

// make sure gtm scripts are included in HTML head

// recommended events:
// https://support.google.com/analytics/answer/9267735
// https://developers.google.com/gtagjs/reference/ga4-events

export const singupMethodGithub = 'github';
export const singupMethodGoogle = 'google';
export const singupMethodEmail = 'email';

export function init(){
  mixpanel.init('41f91ca4df909382e170dda08d4045fb'); 
}

export function eventNavigate(){
  mixpanel.track('navigate');
}

export function eventOpenPricingModal(){
  mixpanel.track('openPricingModal');
}

// method can be 'email', 'google', etc
export function eventRegister(method){
  try {
    window.dataLayer.push({
      'event': 'sign_up',
      'method': method,
      'value': '.25',
      'currency': 'USD'
    });
    mixpanel.track('signUp', {
      method
    });
  } catch (err) {
    console.log(err);
  }
}

// https://developers.google.com/analytics/devguides/collection/ga4/reference/events#begin_checkout
export function eventBeginCheckout(){
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
    mixpanel.track('beginCheckout');
  } catch (err) {
    console.log(err);
  }
}

// https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase
export function eventFinishCheckout(){
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
    mixpanel.track('purchase');
  } catch (err) {
    console.log(err);
  }
}

export function eventExerciseFailure(exerciseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'exercise_failure',
      'exercise_uuid': exerciseUUID,
      'course_title': courseTitle
    });
    mixpanel.track('exerciseFailure');
  } catch (err) {
    console.log(err);
  }
}

export function eventExerciseSuccess(exerciseUUID, courseTitle, exerciseIndex, moduleIndex){
  try {
    window.dataLayer.push({
      'event': 'exercise_success',
      'exercise_uuid': exerciseUUID,
      'course_title': courseTitle, 
      'exercise_index': exerciseIndex,
      'module_index': moduleIndex
    });
    mixpanel.track('exerciseSuccess', {
      courseTitle,
      exerciseIndex,
      moduleIndex
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventExecuteCode(exerciseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'execute_code',
      'exercise_uuid': exerciseUUID,
      'course_title': courseTitle
    });
    mixpanel.track('executeCode');
  } catch (err) {
    console.log(err);
  }
}

export function eventSubmitMultipleChoice(exerciseUUID, courseTitle){
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

export function eventClickCheat(exerciseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'click_cheat',
      'exercise_uuid': exerciseUUID,
      'course_title': courseTitle
    });
    mixpanel.track('clickCheat');
  } catch (err) {
    console.log(err);
  }
}

export function eventClickExerciseNavigation(exerciseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'click_exercise_navigation',
      'exercise_uuid': exerciseUUID,
      'course_title': courseTitle
    });
    mixpanel.track('clickExerciseNavigation');
  } catch (err) {
    console.log(err);
  }
}

export function eventOpenSandboxModeModal(){
  try {
    window.dataLayer.push({
      'event': 'open_pro_modal'
    });
    mixpanel.track('openSandboxModeModal');
  } catch (err) {
    console.log(err);
  }
}

export function eventEarnGems(numGems){
  try {
    window.dataLayer.push({
      'event': 'earn_virtual_currency',
      'virtual_currency_name': 'Gems',
      'value': numGems
    });
    mixpanel.track('earnVirtualCurrency');
  } catch (err) {
    console.log(err);
  }
}

export function eventUnlockAchievement(achievementID){
  try {
    window.dataLayer.push({
      'event': 'unlock_achievement',
      'achievement_id': achievementID
    });
    mixpanel.track('unlockAchievement');
  } catch (err) {
    console.log(err);
  }
}

export function eventFinishCourse(courseTitle){
  try {
    window.dataLayer.push({
      'event': 'level_end',
      'level_name': courseTitle
    });
    mixpanel.track('levelEnd', {
      courseTitle
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventSelectCourse(courseUUID, courseTitle){
  try {
    window.dataLayer.push({
      'event': 'select_item',
      'item_list_name': 'courses',
      'items': [ {
        'item_id': courseUUID,
        'item_name': courseTitle
      } ]
    });
    mixpanel.track('selectCourse', {
      courseTitle
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventTutorialBegin(){
  try {
    window.dataLayer.push({
      'event': 'tutorial_begin'
    });
    mixpanel.track('tutorialBegin');
  } catch (err) {
    console.log(err);
  }
}

export function eventTutorialComplete(){
  try {
    window.dataLayer.push({
      'event': 'tutorial_complete'
    });
    mixpanel.track('tutorialComplete');
  } catch (err) {
    console.log(err);
  }
}
