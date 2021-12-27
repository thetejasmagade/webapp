import { createRouter, createWebHistory } from 'vue-router';
import { eventNavigate } from '@/lib/analytics.js';

const Courses = () => import('@/views/Courses.vue');
const Portfolio = () => import('@/views/Portfolio.vue');
const Exercise = () => import('@/views/Exercise.vue');
const Pricing = () => import('@/views/Pricing.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const Login = () => import('@/views/Login.vue');
const Playground = () => import('@/views/Playground.vue');
const Settings = () => import('@/views/Settings.vue');
const Achievements = () => import('@/views/Achievements.vue');
const SignupFlowUsername = () => import('@/views/SignupFlowUsername.vue');
const SignupFlowCommunity = () => import('@/views/SignupFlowCommunity.vue');
const SignupFlowSync = () => import('@/views/SignupFlowSync.vue');
const SignupFlowRecruiters = () => import('@/views/SignupFlowRecruiters.vue');
const SignupFlowRecruitersEnrich = () => import('@/views/SignupFlowRecruitersEnrich.vue');
const Certificate = () => import('@/views/Certificate.vue');
const CSTrack = () => import('@/views/CSTrack.vue');
const AlgosTrack = () => import('@/views/AlgosTrack.vue');
const GolangTrack = () => import('@/views/GolangTrack.vue');
const Browse = () => import('@/views/Browse.vue');
const Step = () => import('@/views/Step.vue');

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
    path: '/signup_flow/username',
    name: 'SignupFlowUsername',
    component: SignupFlowUsername
  },
  {
    path: '/signup_flow/community',
    name: 'SignupFlowCommunity',
    component: SignupFlowCommunity
  },
  {
    path: '/signup_flow/sync',
    name: 'SignupFlowSync',
    component: SignupFlowSync
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
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: 'courses',
        name: 'Courses',
        component: Courses,
        children: [
          {
            path: 'algos-track',
            name: 'AlgosTrack',
            component: AlgosTrack
          },
          {
            path: 'cs-track',
            name: 'CSTrack',
            component: CSTrack
          },
          {
            path: 'golang-track',
            name: 'GolangTrack',
            component: GolangTrack
          },
          {
            path: 'browse',
            name: 'Browse',
            component: Browse
          }
        ]
      },
      {
        path: 'exercise/:courseUUID/:moduleUUID?/:exerciseUUID?',
        name: 'Exercise',
        component: Exercise
      },
      {
        path: 'step/:projectUUID/:stepUUID?',
        name: 'Step',
        component: Step
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
    path: '/certificate/:userHandle/:courseUUID',
    name: 'Certificate',
    component: Certificate
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

router.beforeEach((to, from, next) => {
  // Redirect to login if necessary
  if (to.fullPath.includes('dashboard') &&
   !to.fullPath.includes('redirect')  && 
   !isLoggedIn()
  ) {
    next({name: 'Login', query: {redirect: to.fullPath}});
    return;
  }

  // Dashboard default child redirect
  if (to.fullPath === '/dashboard/courses') {
    next({name: 'Browse' });
    return;
  }

  next();
});

router.afterEach(() => {
  eventNavigate();
});

export default router;
