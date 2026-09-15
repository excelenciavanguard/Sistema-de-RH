export const ROUTES = {
  home: "/inicio",
  requisitions: "/recrutamento/requisicoes",
  requisitionCreate: "/recrutamento/requisicoes/nova",
  approvals: "/recrutamento/aprovacoes",
  vacancies: "/recrutamento/vagas",
  vacancyCreate: "/recrutamento/vagas/nova",
  kanban: "/recrutamento/vagas/2026-0157/kanban",
  talents: "/talentos",
  agenda: "/agenda",
  admission: "/admissao",
  reports: "/relatorios",
  integrations: "/integracoes",
  administration: "/administracao",
};

const knownRoutes = new Set(Object.values(ROUTES));

export function routeFromHash(hash = window.location.hash) {
  const route = hash.replace(/^#/, "").split("?")[0];
  return knownRoutes.has(route) ? route : ROUTES.home;
}

export function navigateTo(route) {
  if (!knownRoutes.has(route)) return;
  window.history.pushState(null, "", `#${route}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function isRecruitmentRoute(route) {
  return route.startsWith("/recrutamento");
}
