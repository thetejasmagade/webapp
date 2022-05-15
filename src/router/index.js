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
const SignupFlow = () => import("@/views/SignupFlow.vue");
const Certificate = () => import("@/views/Certificate.vue");
const Track = () => import("@/views/Track.vue");
const Browse = () => import("@/views/Browse.vue");
const Project = () => import("@/views/Project.vue");

import { isLoggedIn } from "@/lib/cloudClient.js";
import { slugCS, slugAlgos, slugGolang } from "../lib/trackSlugs";

const redirects = [
  {
    path: "/portfolio/:userHandle",
    redirect: "/u/:userHandle",
  },
  {
    path: "/demo/:courseUUID",
    redirect: "/courses/:courseUUID?",
  },
  {
    path: "/playground",
    redirect: { path: "/playground/go" },
  },
  {
    path: "/playground/golang",
    redirect: { path: "/playground/go" },
  },
  {
    path: "/playground/javascript",
    redirect: { path: "/playground/js" },
  },
  {
    path: "/playground/python",
    redirect: { path: "/playground/py" },
  },
  {
    path: "/playground/purescript",
    redirect: { path: "/playground/purs" },
  },
  {
    path: "/courses/golang-track",
    redirect: { path: `/tracks/${slugGolang}` },
  },
  {
    path: "/courses/cs",
    redirect: { path: `/tracks/${slugCS}` },
  },
  {
    path: "/courses/algos-track",
    redirect: { path: `/tracks/${slugAlgos}` },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup-flow",
    name: "SignupFlow",
    component: SignupFlow,
  },
  {
    path: "/tracks",
    name: "Tracks",
    component: Courses,
    redirect: {
      name: "Track",
      params: {
        trackSlug: slugCS,
      },
    },
    children: [
      {
        path: ":trackSlug",
        name: "Track",
        component: Track,
      },
    ],
  },
  {
    path: "/courses",
    name: "Courses",
    component: Courses,
    redirect: {
      name: "Browse",
    },
    children: [
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
    path: "/playground/:lang",
    name: "Playground",
    component: Playground,
  },
  {
    path: "/u/:userHandle",
    name: "Portfolio",
    component: Portfolio,
  },
  ...redirects,
];

console.log(routes);

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

  next();
});

router.afterEach(() => {
  eventNavigate();
});

export default router;
