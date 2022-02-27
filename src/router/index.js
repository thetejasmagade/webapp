import { createRouter, createWebHistory } from "vue-router";
import { eventNavigate } from "@/lib/analytics.js";

const Courses = () => import("@/views/Courses.vue");
const Portfolio = () => import("@/views/Portfolio.vue");
const Course = () => import("@/views/Course.vue");
const Pricing = () => import("@/views/Pricing.vue");
const Login = () => import("@/views/Login.vue");
const Playground = () => import("@/views/Playground.vue");
const Settings = () => import("@/views/Settings.vue");
const Achievements = () => import("@/views/Achievements.vue");
const SignupFlowUsername = () => import("@/views/SignupFlowUsername.vue");
const SignupFlowMethod = () => import("@/views/SignupFlowMethod.vue");
const SignupFlowCode = () => import("@/views/SignupFlowCode.vue");
const SignupFlowCommunity = () => import("@/views/SignupFlowCommunity.vue");
const SignupFlowRecruiters = () => import("@/views/SignupFlowRecruiters.vue");
const Certificate = () => import("@/views/Certificate.vue");
const CSTrack = () => import("@/views/CSTrack.vue");
const AlgosTrack = () => import("@/views/AlgosTrack.vue");
const GolangTrack = () => import("@/views/GolangTrack.vue");
const Browse = () => import("@/views/Browse.vue");
const Project = () => import("@/views/Project.vue");

import { isLoggedIn } from "@/lib/cloudClient.js";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup_flow/username",
    name: "SignupFlowUsername",
    component: SignupFlowUsername,
  },
  {
    path: "/signup_flow/method",
    name: "SignupFlowMethod",
    component: SignupFlowMethod,
  },
  {
    path: "/signup_flow/community",
    name: "SignupFlowCommunity",
    component: SignupFlowCommunity,
  },
  {
    path: "/signup_flow/recruit",
    name: "SignupFlowRecruiters",
    component: SignupFlowRecruiters,
  },
  {
    path: "/signup_flow/code",
    name: "SignupFlowCode",
    component: SignupFlowCode,
  },
  {
    path: "/courses",
    name: "Courses",
    component: Courses,
    children: [
      {
        path: "algos-track",
        name: "AlgosTrack",
        component: AlgosTrack,
      },
      {
        path: "cs-track",
        name: "CSTrack",
        component: CSTrack,
      },
      {
        path: "golang-track",
        name: "GolangTrack",
        component: GolangTrack,
      },
      {
        path: "browse",
        name: "Browse",
        component: Browse,
      },
    ],
  },
  {
    path: "/course/:courseUUID/:moduleUUID?/:exerciseUUID?",
    name: "Course",
    component: Course,
  },
  {
    path: "/project/:projectUUID/:stepUUID?",
    name: "Project",
    component: Project,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/achievements",
    name: "Achievements",
    component: Achievements,
  },
  {
    path: "/pricing",
    name: "Pricing",
    component: Pricing,
  },
  {
    path: "/certificate/:userHandle/:courseUUID",
    name: "Certificate",
    component: Certificate,
  },
  {
    path: "/playground",
    redirect: { path: "playground/go" },
  },
  {
    path: "/playground/golang",
    redirect: { path: "playground/go" },
  },
  {
    path: "/playground/javascript",
    redirect: { path: "playground/js" },
  },
  {
    path: "/playground/python",
    redirect: { path: "playground/py" },
  },
  {
    path: "/playground/purescript",
    redirect: { path: "playground/purs" },
  },
  {
    path: "/playground/:lang",
    name: "Playground",
    component: Playground,
  },
  {
    path: "/portfolio/:userHandle",
    redirect: "/u/:userHandle",
  },
  {
    path: "/demo/:courseUUID",
    redirect: "/courses/:courseUUID?",
  },
  {
    path: "/u/:userHandle",
    name: "Portfolio",
    component: Portfolio,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Redirect if path begins with a hash (ignore hashes later in path)
router.beforeEach((to, from, next) => {
  if (to.fullPath.substr(0, 2) === "/#") {
    const path = to.fullPath.substr(2);
    next(path);
    return;
  }
  next();
});

router.beforeEach((to, from, next) => {
  // Protected routes that require login
  // should redirect to login
  if (
    (to.fullPath.includes("settings") ||
      to.fullPath.includes("achievements")) &&
    !to.fullPath.includes("redirect") &&
    !isLoggedIn()
  ) {
    next({ name: "Login", query: { redirect: to.fullPath } });
    return;
  }

  // Dashboard default child redirect
  if (to.fullPath === "/courses") {
    next({ name: "Browse" });
    return;
  }

  next();
});

router.afterEach(() => {
  eventNavigate();
});

export default router;
