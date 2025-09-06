import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "../layouts/auth.layout";
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import { AppRoute, OKRAppRoute } from "@/constants/app.constants";
import MainLayout from "@/layouts/main.layout";
import PlayVideoLayout from "@/layouts/playVideoLayout";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

const RecordPage = Loadable(lazy(() => import("../pages/records")));
const PlayRecordPage = Loadable(
  lazy(() => import("../pages/records/playVideo"))
);

const SettingPage = Loadable(lazy(() => import("../pages/settings")));
const PersonalInfoPage = Loadable(
  lazy(() => import("../pages/settings/personal-info"))
);
const CategoryPage = Loadable(lazy(() => import("../pages/categories")));
const DashboardPage = Loadable(lazy(() => import("../pages/dashboard")));

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { element: <LoginPage />, path: "login" },
        { element: <RegisterPage />, path: "register" },
        { element: <VerifyPage />, path: "verify" },
        { element: <ResetPassword />, path: "reset-Password" },
        { element: <NewPassword />, path: "new-Password" },
      ],
    },
    {
      path: "/records/:recordId/play",
      element: <PlayVideoLayout />,
      children: [
        {
          path: AppRoute.PLAY_RECORDS,
          element: <PlayRecordPage />,
          index: true,
        },
      ],
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: AppRoute.RECORDS, element: <RecordPage />, index: true },
        { path: AppRoute.DASHBOARD, element: <DashboardPage /> },
        { path: AppRoute.CATEGORY, element: <CategoryPage /> },
        { path: "/settings", element: <SettingPage /> },
        { path: AppRoute.PERSONAL_INFO, element: <PersonalInfoPage /> },
        { path: "/404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const VerifyPage = Loadable(lazy(() => import("../pages/auth/verify")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/RegisterPage")));
const LoginPage = Loadable(lazy(() => import("../pages/auth/login")));
const ResetPassword = Loadable(
  lazy(() => import("../pages/auth/resetPassword"))
);
const NewPassword = Loadable(lazy(() => import("../pages/auth/newPassword")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
