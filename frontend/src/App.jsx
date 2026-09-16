import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell.jsx";
import { HomeScreen } from "./screens/HomeScreen.jsx";
import { RequisitionsScreen } from "./screens/RequisitionsScreen.jsx";
import { RequisitionCreateScreen } from "./screens/RequisitionCreateScreen.jsx";
import { ApprovalsScreen } from "./screens/ApprovalsScreen.jsx";
import { VacanciesScreen } from "./screens/VacanciesScreen.jsx";
import { VacancyCreateScreen } from "./screens/VacancyCreateScreen.jsx";
import { KanbanScreen } from "./screens/KanbanScreen.jsx";
import { ModulePreviewScreen } from "./screens/ModulePreviewScreen.jsx";
import { TalentsScreen } from "./screens/TalentsScreen.jsx";
import { AgendaScreen } from "./screens/AgendaScreen.jsx";
import { AdmissionScreen } from "./screens/AdmissionScreen.jsx";
import { ReportsScreen } from "./screens/ReportsScreen.jsx";
import { IntegrationsScreen } from "./screens/IntegrationsScreen.jsx";
import { AdministrationScreen } from "./screens/AdministrationScreen.jsx";
import { kanbanCodeFromRoute, navigateTo, routeFromHash, ROUTES } from "./navigation.js";

const moduleTitles = {
  [ROUTES.talents]: "Banco de talentos",
  [ROUTES.agenda]: "Agenda",
  [ROUTES.admission]: "Admissão",
  [ROUTES.reports]: "Relatórios",
  [ROUTES.integrations]: "Integrações",
  [ROUTES.administration]: "Administração",
};

export function App() {
  const previewCandidate = new URLSearchParams(window.location.search).has("candidate");
  const [route, setRoute] = useState(() => previewCandidate ? ROUTES.kanban : routeFromHash());

  useEffect(() => {
    const updateRoute = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const go = (nextRoute) => navigateTo(nextRoute);

  let content;
  if (route === ROUTES.home) content = <HomeScreen onNavigate={go} />;
  else if (route === ROUTES.requisitions) content = <RequisitionsScreen onNavigate={go} />;
  else if (route === ROUTES.requisitionCreate) content = <RequisitionCreateScreen onNavigate={go} />;
  else if (route === ROUTES.approvals) content = <ApprovalsScreen onNavigate={go} />;
  else if (route === ROUTES.vacancies) content = <VacanciesScreen onNavigate={go} />;
  else if (route === ROUTES.vacancyCreate) content = <VacancyCreateScreen onNavigate={go} />;
  else if (kanbanCodeFromRoute(route)) content = <KanbanScreen key={route} vacancyCode={kanbanCodeFromRoute(route)} />;
  else if (route === ROUTES.talents) content = <TalentsScreen onNavigate={go} />;
  else if (route === ROUTES.agenda) content = <AgendaScreen />;
  else if (route === ROUTES.admission) content = <AdmissionScreen />;
  else if (route === ROUTES.reports) content = <ReportsScreen />;
  else if (route === ROUTES.integrations) content = <IntegrationsScreen />;
  else if (route === ROUTES.administration) content = <AdministrationScreen />;
  else content = <ModulePreviewScreen title={moduleTitles[route] ?? "Módulo"} onNavigate={go} />;

  return <AppShell route={route} onNavigate={go}>{content}</AppShell>;
}
