import {
  Bell,
  Buildings,
  CaretDown,
  CirclesFour,
  MagnifyingGlass,
  Question,
} from "@phosphor-icons/react";

const primary = ["Início", "Recrutamento ativo", "Talentos", "Agenda", "Admissão", "Pessoas", "Relatórios", "Integrações", "Administração"];
const secondary = ["Visão geral", "Vagas", "Processos seletivos", "Banco de talentos", "Aprovações"];

export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="Alpha RH">
          <CirclesFour size={29} weight="fill" />
          <span>Alpha RH</span>
        </div>
        <button className="company-switcher" type="button">
          <Buildings size={18} /> Alpha Serviços <CaretDown size={13} weight="bold" />
        </button>
        <label className="global-search">
          <MagnifyingGlass size={18} />
          <input aria-label="Busca global" placeholder="Buscar pessoas, vagas, processos ou menus" />
          <kbd>Ctrl K</kbd>
        </label>
        <div className="top-actions">
          <button type="button"><CirclesFour size={19} /> Atalhos <CaretDown size={12} /></button>
          <button type="button"><Question size={20} /> Ajuda</button>
          <button className="notification" type="button" aria-label="Notificações"><Bell size={21} /><span>12</span></button>
          <button className="profile" type="button"><span className="profile-avatar">L</span> Lucas <CaretDown size={12} /></button>
        </div>
      </header>
      <nav className="primary-nav" aria-label="Módulos principais">
        {primary.map((item) => <button className={item === "Recrutamento ativo" ? "active" : ""} key={item} type="button">{item}</button>)}
      </nav>
      <nav className="secondary-nav" aria-label="Navegação de recrutamento">
        {secondary.map((item) => <button className={item === "Vagas" ? "active" : ""} key={item} type="button">{item}</button>)}
      </nav>
      {children}
    </div>
  );
}
