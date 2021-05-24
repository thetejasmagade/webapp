import { createRouter, createWebHistory } from 'vue-router';

const Courses = () => import('@/views/Courses.vue');
const Portfolio = () => import('@/views/Portfolio.vue');
const Exercise = () => import('@/views/Exercise.vue');
const Pricing = () => import('@/views/Pricing.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const Login = () => import('@/views/Login.vue');
const Playground = () => import('@/views/Playground.vue');
const Settings = () => import('@/views/Settings.vue');
const Achievements = () => import('@/views/Achievements.vue');
const SignupFlowExperience = () => import('@/views/SignupFlowExperience.vue');
const SignupFlowInterests = () => import('@/views/SignupFlowInterests.vue');
const SignupFlowRecruiters = () => import('@/views/SignupFlowRecruiters.vue');
const SignupFlowRecruitersEnrich = () => import('@/views/SignupFlowRecruitersEnrich.vue');
const VerifyEmail = () => import('@/views/VerifyEmail.vue');
const Recruiters = () => import('@/views/Recruiters.vue');


import {
  isLoggedIn
} from '@/lib/cloudClient.js';

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
    path: '/signup_flow/recruit_enrich',
    name: 'SignupFlowRecruitersEnrich',
    component: SignupFlowRecruitersEnrich
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
        path: 'recruiters',
        name: 'Recruiters',
        component: Recruiters
      },
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

const router = createRouter({
  history: createWebHistory(),
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
export default router;
