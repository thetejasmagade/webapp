import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';

const Courses = () => import(/* webpackChunkName: "Courses" */ '@/views/Courses.vue');
const Profile = () => import(/* webpackChunkName: "Profile" */ '@/views/Profile.vue');
const Exercise = () => import(/* webpackChunkName: "Exercise" */ '@/views/Exercise.vue');
const Store = () => import(/* webpackChunkName: "Store" */ '@/views/Store.vue');
const CouponCode = () => import(/* webpackChunkName: "CouponCode" */ '@/views/CouponCode.vue');
const Dashboard = () => import(/* webpackChunkName: "Dashboard" */ '@/views/Dashboard.vue');
const Login = () => import(/* webpackChunkName: "Login" */ '@/views/Login.vue');
const Playground = () => import(/* webpackChunkName: "Playground" */ '@/views/Playground.vue');
const Portfolio = () => import(/* webpackChunkName: "Portfolio" */ '@/views/Portfolio.vue');

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
        path: 'store',
        name: 'Store',
        component: Store
      },
      {
        path: 'coupon_code',
        name: 'CouponCode',
        component: CouponCode
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      }
    ]
  },
  { 
    path: '/playground', 
    redirect: { path: 'playground/go' }
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
  // Redirect if fullPath begins with a hash (ignore hashes later in path)
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
