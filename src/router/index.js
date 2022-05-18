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
const CourseLanding = () => import("@/views/CourseLanding.vue");
const ProjectLanding = () => import("@/views/ProjectLanding.vue");

import { isLoggedIn } from "@/lib/cloudClient.js";
import { slugCS, slugAlgos, slugGolang } from "../lib/trackSlugs";

const routes = [
  {
    path: "/project/59fbb2aa-7d67-4e88-bac8-42f49798a9f5/4a7010c1-e7d3-4cc5-9b1b-d1f4e9f9ce81",
    redirect: { path: "/build/seo-link-analyzer-python" },
  },
  {
    path: "/project/2b266bb4-2262-49c0-b6d1-75cd8c5e8be8/81bb79ab-381b-424c-be12-8edfe9853f97",
    redirect: { path: "/build/maze-solver-python" },
  },
  {
    path: "/project/709a2e74-eb45-46ea-ac26-4b8e6a3ce3e6/fbac7ae9-6a4d-4ad5-bf76-9651cb8eb2c5",
    redirect: { path: "/build/social-media-backend-golang" },
  },
  {
    path: "/course/2af5c197-21eb-48b4-bd90-b0d59adb311e/eca6fbac-01a2-4b03-9837-e2242d665e21/88898457-a74f-4dd7-97d3-f8a48d0a6beb",
    redirect: { path: "/learn/learn-code-javascript" },
  },
  {
    path: "/course/fc90fccd-2516-4919-83e2-ea5987b0d3fa/004c8728-b78e-4363-b556-61bd4819905f/e20e8802-e109-4b65-be1c-a46ae071e497",
    redirect: { path: "/learn/learn-code-javascript-2" },
  },
  {
    path: "/course/bf7fc867-372e-484b-933f-f9cd2d4957c8/26154d59-593a-4d4a-9399-b6250f5864ad/99e1bab2-bc4e-42da-9b8a-fbf6da1904d5",
    redirect: { path: "/learn/learn-graphics-html5-canvas" },
  },
  {
    path: "/course/f9a25dfb-3e00-4727-ac78-36de82315355/caf44bf0-6565-400d-a566-af006b22dd2f/c499d5ac-97fe-4efa-9c63-1664100098d1",
    redirect: { path: "/learn/learn-python" },
  },
  {
    path: "/course/3b39d0f6-f944-4f1b-832d-a1daba32eda4/9e6acea2-8081-404d-9c34-3b5f677fa580/a74a68e0-9e85-4328-8868-5db0089ea11b",
    redirect: { path: "/learn/learn-golang" },
  },
  {
    path: "/course/f9a48bbc-d1ff-4388-bf0c-23c6e3c60ae0/46f1f86f-9b7c-4a8b-8883-4b407c0e675b/c444437d-7af3-4328-8f93-447e4dd8b736",
    redirect: { path: "/learn/learn-object-oriented-programming" },
  },
  {
    path: "/course/884342fc-5469-47b4-8125-8bfc897428a8/67214b76-2e4b-4fc1-9610-2cf8c7c1c3a2/02e0d979-6758-493f-bf4f-bf7256fa7174",
    redirect: { path: "/learn/learn-algorithms" },
  },
  {
    path: "/course/7bbb53ed-2106-4f6b-b885-e7645c2ff9d8/a9d59658-4e3c-441e-973b-147cc3c7e9de/666a9872-74d2-46d9-910a-63581b306302",
    redirect: { path: "/learn/learn-data-structures" },
  },
  {
    path: "/course/6321ddbf-49eb-4748-9737-6bc12e8bb705/4907b729-6a49-409c-a634-d64d357f9a8b/5c7bdecf-b3be-4947-aea6-749e2d1d96b4",
    redirect: { path: "/learn/learn-cryptography" },
  },
  {
    path: "/course/b1459f0c-21eb-41e5-b7f3-562ef69d344c/65e3ea51-a0c4-41d6-9e4f-750942bcb0c9/f0d6c12b-fe3f-4920-a6a0-b2ae830b1658",
    redirect: { path: "/learn/learn-functional-programming" },
  },
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
    path: "/learn/:courseSlug",
    name: "CourseLanding",
    component: CourseLanding,
  },
  {
    path: "/build/:projectSlug",
    name: "ProjectLanding",
    component: ProjectLanding,
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
