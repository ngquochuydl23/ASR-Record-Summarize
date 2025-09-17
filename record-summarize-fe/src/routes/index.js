import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "../layouts/auth.layout";
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import { AppRoute } from "@/constants/app.constants";
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
const PlayRecordPage = Loadable(lazy(() => import("../pages/records/playVideo")));
const SettingPage = Loadable(lazy(() => import("../pages/settings")));
const PersonalInfoPage = Loadable(lazy(() => import("../pages/settings/personal-info")));
const CollectionPage = Loadable(lazy(() => import("../pages/collections")));
const DashboardPage = Loadable(lazy(() => import("../pages/dashboard")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/RegisterPage")));
const LoginPage = Loadable(lazy(() => import("../pages/auth/login")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
const HistoryChatAIPage = Loadable(lazy(() => import("../pages/history")));


export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { element: <LoginPage />, path: "login" },
        { element: <RegisterPage />, path: "register" },
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
        { path: AppRoute.HISTORY, element: <HistoryChatAIPage /> },
        { path: AppRoute.COLLECTIONS, element: <CollectionPage /> },
        { path: "/settings", element: <SettingPage /> },
        { path: AppRoute.PERSONAL_INFO, element: <PersonalInfoPage /> },
        { path: "/404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
