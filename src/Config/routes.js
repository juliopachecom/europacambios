import { Home } from "../Pages/Home";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { Recover } from "../Pages/Recover";
import { RecoverUpdate } from "../Pages/RecoverUpdate";
import { Dashboard } from "../Pages/Dashboard";
import { Changes } from "../Pages/Changes";
import {TermsAndConditions} from "../Pages/TermsAndConditions";
import {AdmEc} from "../Pages/AdmEc";
import {FAQs} from "../Pages/Faqs";

const routes = [
  {
    title: "TermsAndConditions",
    path: "/TermsAndConditions",
    component: TermsAndConditions,
  },
  {
    title: "Login",
    path: "/Login",
    component: Login,
  },
  {
    title: "Register",
    path: "/Register",
    component: Register,
  },
   {
    title: "Recover",
    path: "/Recover",
    component: Recover,
  },
  {
    title: "RecoverUpdate",
    path: "/RecoverUpdate",
    component: RecoverUpdate,
  },
  {
    title: "Dashboard",
    path: "/Dashboard",
    component: Dashboard,
  },
  {
    title: "Changes",
    path: "/Changes",
    component: Changes,
  },
  {
    title: "AdmEc",
    path: "/AdmEc",
    component: AdmEc,
  },
  {
    title: "FAQs",
    path: "/Faqs",
    component: FAQs,
  },
  {
    title: "",
    path: "/",
    component: Home,
  },
  
];

export default routes;
