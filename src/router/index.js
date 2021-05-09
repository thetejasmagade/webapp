import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';

const Courses = () => import('@/views/Courses.vue');
const Portfolio = () => import( '@/views/Portfolio.vue');
const Exercise = () => import('@/views/Exercise.vue');
const Pricing = () => import( '@/views/Pricing.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const Login = () => import('@/views/Login.vue');
const Playground = () => import( '@/views/Playground.vue');
const Settings = () => import('@/views/Settings.vue');
const Achievements = () => import('@/views/Achievements.vue');
const SignupFlowExperience = () => import('@/views/SignupFlowExperience.vue');
const SignupFlowInterests = () => import('@/views/SignupFlowInterests.vue');
const VerifyEmail = () => import('@/views/VerifyEmail.vue');

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
        path: 'store',
        redirect: 'pricing'
      },
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
        path: 'pricing',
        name: 'Pricing',
        component: Pricing
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
