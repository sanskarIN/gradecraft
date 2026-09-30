import { AppShell } from "./components/AppShell";
import { Onboarding } from "./components/Onboarding";
import { useHashRoute } from "./hooks/useHashRoute";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { getDataSafetyMessages } from "./i18n/dataSafety";
import { useMessages } from "./i18n/useMessages";
import { AboutPage } from "./pages/AboutPage";
import { CoursePage } from "./pages/CoursePage";
import { DashboardPage } from "./pages/DashboardPage";
import { DataPage } from "./pages/DataPage";
import { GpaPage } from "./pages/GpaPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WhatIfPage } from "./pages/WhatIfPage";
import { useApp } from "./state/AppContext";

export function App() {
  const route = useHashRoute();
  const online = useOnlineStatus();
  const { data, persistenceError } = useApp();
  const messages = useMessages();
  const safetyMessages = getDataSafetyMessages(data.settings.language);
  let page;

  switch (route.page) {
    case "course":
      page = <CoursePage id={route.id} />;
      break;
    case "what-if":
      page = <WhatIfPage id={route.id} />;
      break;
    case "gpa":
      page = <GpaPage />;
      break;
    case "data":
      page = <DataPage />;
      break;
    case "settings":
      page = <SettingsPage />;
      break;
    case "about":
      page = <AboutPage />;
      break;
    default:
      page = <DashboardPage />;
  }

  return (
    <AppShell>
      {!online && (
        <div className="offline-banner" role="status">
          {messages.offline}
        </div>
      )}
      {persistenceError && (
        <div className="offline-banner" role="alert">
          {safetyMessages.storageWriteFailed}
        </div>
      )}
      {page}
      {!data.settings.onboardingComplete && <Onboarding />}
    </AppShell>
  );
}
