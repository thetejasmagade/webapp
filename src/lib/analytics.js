import mixpanel from "mixpanel-browser";

// make sure gtm scripts are included in HTML head

export const singupMethodGithub = "github";
export const singupMethodGoogle = "google";
export const singupMethodEmail = "email";

export function init() {
  mixpanel.init("41f91ca4df909382e170dda08d4045fb");
}

export function eventNavigate() {
  mixpanel.track("navigate");
}

export function eventOpenPricingModal() {
  mixpanel.track("openPricingModal");
}

// method can be 'email', 'google', etc
export function eventRegister(method) {
  try {
    mixpanel.track("signUp", {
      method,
    });
  } catch (err) {
    console.log(err);
  }
}

// https://developers.google.com/analytics/devguides/collection/ga4/reference/events#begin_checkout
export function eventBeginCheckout() {
  try {
    mixpanel.track("beginCheckout");
  } catch (err) {
    console.log(err);
  }
}

// https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase
export function eventFinishCheckout() {
  try {
    mixpanel.track("purchase");
  } catch (err) {
    console.log(err);
  }
}

export function eventExerciseFailure(exerciseUUID, courseTitle) {
  try {
    mixpanel.track("exerciseFailure", {
      exerciseUUID,
      courseTitle,
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventExerciseSuccess(
  exerciseUUID,
  courseTitle,
  exerciseIndex,
  moduleIndex
) {
  try {
    mixpanel.track("exerciseSuccess", {
      exerciseUUID,
      courseTitle,
      exerciseIndex,
      moduleIndex,
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventExecuteCode(exerciseUUID, courseTitle) {
  try {
    mixpanel.track("executeCode", {
      exerciseUUID,
      courseTitle,
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventSubmitMultipleChoice(exerciseUUID, courseTitle) {
  try {
    mixpanel.track("submitMultipleChoice", {
      exerciseUUID,
      courseTitle,
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventClickCheat(exerciseUUID, courseTitle) {
  try {
    mixpanel.track("clickCheat", {
      exerciseUUID,
      courseTitle,
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventClickExerciseNavigation(exerciseUUID, courseTitle) {
  try {
    mixpanel.track("clickExerciseNavigation", {
      exerciseUUID,
      courseTitle,
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventOpenSandboxModeModal() {
  try {
    mixpanel.track("openSandboxModeModal");
  } catch (err) {
    console.log(err);
  }
}

export function eventEarnGems(numGems) {
  try {
    mixpanel.track("earnVirtualCurrency", {
      numGems,
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventUnlockAchievement(achievementID) {
  try {
    mixpanel.track("unlockAchievement", {
      achievementID,
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventFinishCourse(courseTitle) {
  try {
    mixpanel.track("levelEnd", {
      courseTitle,
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventSelectCourse(courseUUID, courseTitle) {
  try {
    mixpanel.track("selectCourse", {
      courseTitle,
      courseUUID,
    });
  } catch (err) {
    console.log(err);
  }
}

export function eventTutorialBegin() {
  try {
    mixpanel.track("tutorialBegin");
  } catch (err) {
    console.log(err);
  }
}

export function eventTutorialComplete() {
  try {
    mixpanel.track("tutorialComplete");
  } catch (err) {
    console.log(err);
  }
}
