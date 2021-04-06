import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';

const Courses = () => import(/* webpackChunkName: "Courses" */ '@/views/Courses.vue');
const Portfolio = () => import(/* webpackChunkName: "Portfolio" */ '@/views/Portfolio.vue');
const Exercise = () => import(/* webpackChunkName: "Exercise" */ '@/views/Exercise.vue');
const Store = () => import(/* webpackChunkName: "Store" */ '@/views/Store.vue');
const ReferralProgram = () => import(/* webpackChunkName: "ReferralProgram" */ '@/views/ReferralProgram.vue');
const Dashboard = () => import(/* webpackChunkName: "Dashboard" */ '@/views/Dashboard.vue');
const Login = () => import(/* webpackChunkName: "Login" */ '@/views/Login.vue');
const Playground = () => import(/* webpackChunkName: "Playground" */ '@/views/Playground.vue');
const Settings = () => import(/* webpackChunkName: "Settings" */ '@/views/Settings.vue');
const Achievements = () => import(/* webpackChunkName: "Achievements" */ '@/views/Achievements.vue');
const SignupFlowExperience = () => import(/* webpackChunkName: "SignupFlowExperience" */ '@/views/SignupFlowExperience.vue');
const SignupFlowInterests = () => import(/* webpackChunkName: "SignupFlowInterests" */ '@/views/SignupFlowInterests.vue');
const VerifyEmail = () => import(/* webpackChunkName: "VerifyEmail" */ '@/views/VerifyEmail.vue');

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
    path: '/verify_email/:courseUUID?',
    name: 'VerifyEmail',
    component: VerifyEmail
  },
  {
    path: '/signup_flow/experience/:courseUUID?',
    name: 'SignupFlowExperience',
    component: SignupFlowExperience
  },
  {
    path: '/signup_flow/interests/:courseUUID?',
    name: 'SignupFlowInterests',
    component: SignupFlowInterests
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: 'courses/:courseUUID?',
        name: 'Courses',
        component: Courses
      },
      {
        path: 'exercise/:courseUUID/:moduleUUID?',
        name: 'Exercise',
        component: Exercise
      },
      {
        path: 'store',
        name: 'Store',
        component: Store
      },
      {
        path: 'referral_program',
        name: 'ReferralProgram',
        component: ReferralProgram
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
