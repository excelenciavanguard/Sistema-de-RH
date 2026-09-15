import { ArrowLeft, Blueprint } from "@phosphor-icons/react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ROUTES } from "../navigation.js";

export function ModulePreviewScreen({ title, onNavigate }) {
  return <main className="screen-workspace"><ScreenHeader title={title} description="Este módulo será detalhado nos próximos lotes de telas." /><section className="surface-panel module-preview"><Blueprint size={38} /><h2>Estrutura visual em preparação</h2><p>O cabeçalho e a navegação já estão conectados. O conteúdo deste módulo será construído seguindo o fluxo aprovado pelo RH.</p><button className="secondary-action" type="button" onClick={() => onNavigate(ROUTES.home)}><ArrowLeft size={17} /> Voltar ao Início</button></section></main>;
}
