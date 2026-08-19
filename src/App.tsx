import { AppShell } from "./components/AppShell";
import { Onboarding } from "./components/Onboarding";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useHashRoute } from "./hooks/useHashRoute";
import { en } from "./i18n/en";
import { enSystem } from "./i18n/system";
import { AboutPage } from "./pages/AboutPage";
import { CoursePage } from "./pages/CoursePage";
import { DashboardPage } from "./pages/DashboardPage";
import { DataPage } from "./pages/DataPage";
import { GpaPage } from "./pages/GpaPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WhatIfPage } from "./pages/WhatIfPage";
import { useApp } from "./state/AppContext";
export function App(){const route=useHashRoute(),online=useOnlineStatus(),{data,persistenceError}=useApp();let page;switch(route.page){case"course":page=<CoursePage id={route.id}/>;break;case"what-if":page=<WhatIfPage id={route.id}/>;break;case"gpa":page=<GpaPage/>;break;case"data":page=<DataPage/>;break;case"settings":page=<SettingsPage/>;break;case"about":page=<AboutPage/>;break;default:page=<DashboardPage/>;}return <AppShell>{!online&&<div className="offline-banner" role="status">{en.offline}</div>}{persistenceError&&<div className="validation-summary" role="alert">{enSystem.storageUnavailable}</div>}{page}{!data.settings.onboardingComplete&&<Onboarding/>}</AppShell>;}
