import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { AppRoute } from "@/constants/app.constants";
import MainLayout from "@/layouts/main.layout";
import PlayVideoLayout from "@/layouts/playVideoLayout";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<div></div>}>
      <Component {...props} />
    </Suspense>
  );
};

const RecordSettingPage = Loadable(lazy(() => import("../pages/records/settings")));
const RecordPage = Loadable(lazy(() => import("../pages/records")));
const PlayRecordPage = Loadable(lazy(() => import("../pages/records/playVideo")));
const SettingPage = Loadable(lazy(() => import("../pages/settings")));
const PersonalInfoPage = Loadable(lazy(() => import("../pages/settings/personal-info")));
const CollectionPage = Loadable(lazy(() => import("../pages/collections")));
const LandingPage = Loadable(lazy(() => import("../pages/landingPage")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
const ChatAIPage = Loadable(lazy(() => import("../pages/chat")));

export default function Router() {
  return useRoutes([
    {
      path: "/home",
      element: <LandingPage />,
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
        { element: <Navigate to={AppRoute.RECORDS} replace />, index: true },
        { path: AppRoute.RECORDS, element: <RecordPage />, index: true },
        { path: AppRoute.CHAT, element: <ChatAIPage /> },
        { path: AppRoute.COLLECTIONS, element: <CollectionPage /> },
        { path: "/records/:recordId/setting", element: <RecordSettingPage /> },
        { path: "/settings", element: <SettingPage /> },
        { path: AppRoute.PERSONAL_INFO, element: <PersonalInfoPage /> },
        { path: "/404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
