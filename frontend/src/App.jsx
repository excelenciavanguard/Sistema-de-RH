import { lazy, Suspense, useEffect, useState } from "react";
import { AppShell } from "./components/AppShell.jsx";
import { WelcomeIntro } from "./components/WelcomeIntro.jsx";
import { HomeScreen } from "./screens/HomeScreen.jsx";
import { LoginScreen } from "./screens/LoginScreen";
import { kanbanCodeFromRoute, navigateTo, routeFromHash, ROUTES } from "./navigation.js";

const lazyNamed = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

const RequisitionsScreen = lazyNamed(() => import("./screens/RequisitionsScreen.jsx"), "RequisitionsScreen");
const RequisitionCreateScreen = lazyNamed(() => import("./screens/RequisitionCreateScreen.jsx"), "RequisitionCreateScreen");
const ApprovalsScreen = lazyNamed(() => import("./screens/ApprovalsScreen.jsx"), "ApprovalsScreen");
const VacanciesScreen = lazyNamed(() => import("./screens/VacanciesScreen.jsx"), "VacanciesScreen");
const VacancyCreateScreen = lazyNamed(() => import("./screens/VacancyCreateScreen.jsx"), "VacancyCreateScreen");
const KanbanScreen = lazyNamed(() => import("./screens/KanbanScreen.jsx"), "KanbanScreen");
const ModulePreviewScreen = lazyNamed(() => import("./screens/ModulePreviewScreen.jsx"), "ModulePreviewScreen");
const TalentsScreen = lazyNamed(() => import("./screens/TalentsScreen.jsx"), "TalentsScreen");
const AgendaScreen = lazyNamed(() => import("./screens/AgendaScreen.jsx"), "AgendaScreen");
const AdmissionScreen = lazyNamed(() => import("./screens/AdmissionScreen.jsx"), "AdmissionScreen");
const ReportsScreen = lazyNamed(() => import("./screens/ReportsScreen.jsx"), "ReportsScreen");
const IntegrationsScreen = lazyNamed(() => import("./screens/IntegrationsScreen.jsx"), "IntegrationsScreen");
const AdministrationScreen = lazyNamed(() => import("./screens/AdministrationScreen.jsx"), "AdministrationScreen");

const moduleTitles = {
  [ROUTES.talents]: "Banco de talentos",
  [ROUTES.agenda]: "Agenda",
  [ROUTES.admission]: "Admissão",
  [ROUTES.reports]: "Relatórios",
  [ROUTES.integrations]: "Integrações",
  [ROUTES.administration]: "Administração",
};

export function App() {
  const currentUser = { name: "Ramon" };
  const previewCandidate = new URLSearchParams(window.location.search).has("candidate");
  const [route, setRoute] = useState(() => previewCandidate ? ROUTES.kanban : routeFromHash());
  const [interviewMode, setInterviewMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const updateRoute = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const go = (nextRoute) => navigateTo(nextRoute);

  if (showWelcome) return <WelcomeIntro userName={currentUser.name} onComplete={() => { setShowWelcome(false); go(ROUTES.home); }} />;
  if (route === ROUTES.login) return <LoginScreen onEnter={() => setShowWelcome(true)} />;

  let content;
  if (route === ROUTES.home) content = <HomeScreen onNavigate={go} />;
  else if (route === ROUTES.requisitions) content = <RequisitionsScreen onNavigate={go} />;
  else if (route === ROUTES.requisitionCreate) content = <RequisitionCreateScreen onNavigate={go} />;
  else if (route === ROUTES.approvals) content = <ApprovalsScreen onNavigate={go} />;
  else if (route === ROUTES.vacancies) content = <VacanciesScreen onNavigate={go} />;
  else if (route === ROUTES.vacancyCreate) content = <VacancyCreateScreen onNavigate={go} />;
  else if (kanbanCodeFromRoute(route)) content = <KanbanScreen key={route} vacancyCode={kanbanCodeFromRoute(route)} onInterviewModeChange={setInterviewMode} />;
  else if (route === ROUTES.talents) content = <TalentsScreen onNavigate={go} />;
  else if (route === ROUTES.agenda) content = <AgendaScreen />;
  else if (route === ROUTES.admission) content = <AdmissionScreen />;
  else if (route === ROUTES.reports) content = <ReportsScreen />;
  else if (route === ROUTES.integrations) content = <IntegrationsScreen />;
  else if (route === ROUTES.administration) content = <AdministrationScreen />;
  else content = <ModulePreviewScreen title={moduleTitles[route] ?? "Módulo"} onNavigate={go} />;

  return <>
    <AppShell route={route} onNavigate={go} hideHeader={interviewMode}>
      <Suspense fallback={<RouteFallback />}>{content}</Suspense>
    </AppShell>
  </>;
}

function RouteFallback() {
  return (
    <main className="route-loading" aria-busy="true" aria-label="Carregando módulo">
      <span className="route-loading-indicator" aria-hidden="true" />
      <span>Carregando módulo…</span>
    </main>
  );
}
