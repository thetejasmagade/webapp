import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';

import Courses from '@/views/Courses.vue';
import Portfolio from '@/views/Portfolio.vue';
import Exercise from '@/views/Exercise.vue';
import Pricing from '@/views/Pricing.vue';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/Login.vue';
import Playground from '@/views/Playground.vue';
import Settings from '@/views/Settings.vue';
import Achievements from '@/views/Achievements.vue';
import SignupFlowExperience from '@/views/SignupFlowExperience.vue';
import SignupFlowInterests from '@/views/SignupFlowInterests.vue';
import SignupFlowRecruiters from '@/views/SignupFlowRecruiters.vue';
import VerifyEmail from '@/views/VerifyEmail.vue';

import {
  isLoggedIn
} from '@/lib/cloudClient.js';

Vue.use(VueRouter);

Vue.use(VueMeta, {
  keyName: 'metaInfo',
  attribute: 'data-vue-meta',
  tagIDKeyName: 'vmid',
  refreshOnceOnNavigation: true
});

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/verify_email',
    name: 'VerifyEmail',
    component: VerifyEmail
  },
  {
    path: '/signup_flow/experience',
    name: 'SignupFlowExperience',
    component: SignupFlowExperience
  },
  {
    path: '/signup_flow/recruit',
    name: 'SignupFlowRecruiters',
    component: SignupFlowRecruiters
  },
  {
    path: '/signup_flow/interests',
    name: 'SignupFlowInterests',
    component: SignupFlowInterests
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: 'courses',
        name: 'Courses',
        component: Courses
      },
      {
        path: 'exercise/:courseUUID/:moduleUUID?',
        name: 'Exercise',
        component: Exercise
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings
      },
      {
        path: 'achievements',
        name: 'Achievements',
        component: Achievements
      }
    ]
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing
  },
  {
    path: '/playground', 
    redirect: { path: 'playground/go' }
  },
  {
    path: '/playground/golang', 
    redirect: { path: 'playground/go' }
  },
  {
    path: '/playground/javascript', 
    redirect: { path: 'playground/js' }
  },
  {
    path: '/playground/python', 
    redirect: { path: 'playground/py' }
  },
  {
    path: '/playground/purescript', 
    redirect: { path: 'playground/purs' }
  },
  {
    path: '/playground/:lang',
    name: 'Playground',
    component: Playground
  },
  {
    path: '/portfolio/:userHandle',
    redirect: '/u/:userHandle'
  },
  {
    path: '/demo/:courseUUID',
    redirect: '/dashboard/courses/:courseUUID?'
  },
  {
    path: '/u/:userHandle',
    name: 'Portfolio',
    component: Portfolio
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

// Redirect if path begins with a hash (ignore hashes later in path)
router.beforeEach((to, from, next) => {
  if (to.fullPath.substr(0, 2) === '/#') {
    const path = to.fullPath.substr(2);
    next(path);
    return;
  }
  next();
});

// Redirect to login if necessary
router.beforeEach((to, from, next) => {
  if (to.fullPath.includes('dashboard') && !to.fullPath.includes('redirect')  && !isLoggedIn()) {
    next({name: 'Login', query: {redirect: to.fullPath}});
    return;
  }
  next();
});

// Supress redundant navigation errors
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(function (err) {
    if (err.toString().includes('redundant')){
      return;
    }
    throw err;
  });
};

export default router;
