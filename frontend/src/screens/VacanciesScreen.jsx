import { useEffect, useRef, useState } from "react";
import { ArrowRight, DotsThree, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { vacancies } from "../mockWorkspaceData.js";
import { ROUTES } from "../navigation.js";
import "./vacancies.css";

const statuses = [
  { value: "Ativa", label: "Ativas" },
  { value: "Rascunho", label: "Rascunhos" },
  { value: "Encerrada", label: "Encerradas" },
];

function initials(name) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("");
}

function searchable(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export function VacanciesScreen({ onNavigate }) {
  const [status, setStatus] = useState("Ativa");
  const [query, setQuery] = useState("");
  const [post, setPost] = useState("");
  const [owner, setOwner] = useState("");
  const [sort, setSort] = useState("code");
  const [details, setDetails] = useState(null);
  const dialog = useRef(null);
  const hasFilters = Boolean(query || post || owner);
  function clearFilters() { setQuery(""); setPost(""); setOwner(""); }
  useEffect(() => {
    if (details && !dialog.current.open) dialog.current.showModal();
  }, [details]);
  const visible = vacancies.filter((vacancy) => (!status || vacancy.status === status) &&
    (!post || vacancy.post === post) && (!owner || vacancy.owner === owner) &&
    searchable([vacancy.role, vacancy.post, vacancy.code].join(" ")).includes(searchable(query.trim())))
    .sort((a, b) => sort === "role" ? a.role.localeCompare(b.role, "pt-BR") : b.code.localeCompare(a.code));
  const openKanban = (vacancy) => onNavigate(`/recrutamento/vagas/${vacancy.code}/kanban`);

  return (
    <main className="screen-workspace vacancies-workspace">
      <div className="vacancies-breadcrumb">Recrutamento <span>/</span> Vagas</div>
      <ScreenHeader title="Vagas" description="Encontre a vaga e acompanhe os candidatos no Kanban." actions={<button className="primary-action" type="button" onClick={() => onNavigate(ROUTES.vacancyCreate)}><Plus size={18} /> Criar vaga</button>} />
      <nav className="vacancies-status-tabs" aria-label="Situação das vagas">
        {statuses.map((item) => <button key={item.value} type="button" aria-label={`${item.label} ${vacancies.filter((vacancy) => vacancy.status === item.value).length}`} aria-pressed={status === item.value} onClick={() => setStatus(item.value)}>{item.label}<span>{vacancies.filter((vacancy) => vacancy.status === item.value).length}</span></button>)}
      </nav>
      <section className="vacancies-panel" aria-label="Encontrar uma vaga">
        <div className="vacancies-toolbar">
          <label className="vacancies-search"><MagnifyingGlass size={20} /><input type="search" aria-label="Buscar por função, posto ou código da vaga" placeholder="Buscar por função, posto ou código da vaga" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <label className="vacancies-filter"><span className="sr-only">Filtrar por posto</span><select aria-label="Filtrar por posto" value={post} onChange={(event) => setPost(event.target.value)}><option value="">Posto: todos</option>{[...new Set(vacancies.map((vacancy) => vacancy.post))].map((name) => <option key={name}>{name}</option>)}</select></label>
          <label className="vacancies-filter"><span className="sr-only">Filtrar por responsável</span><select aria-label="Filtrar por responsável" value={owner} onChange={(event) => setOwner(event.target.value)}><option value="">Responsável: todos</option>{[...new Set(vacancies.map((vacancy) => vacancy.owner))].map((name) => <option key={name}>{name}</option>)}</select></label>
          <label className="vacancies-filter"><span className="sr-only">Filtrar por situação</span><select aria-label="Filtrar por situação" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Situação: todas</option>{statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        </div>
        <div className="vacancies-results"><span aria-live="polite">{visible.length} {visible.length === 1 ? "vaga encontrada" : "vagas encontradas"}</span>{hasFilters && <button className="vacancies-clear" type="button" onClick={clearFilters}>Limpar filtros <X size={14} /></button>}<label className="vacancies-sort"><span className="sr-only">Ordenar vagas</span><select aria-label="Ordenar vagas" value={sort} onChange={(event) => setSort(event.target.value)}><option value="code">Código: maior primeiro</option><option value="role">Função: A–Z</option></select></label></div>
        <div className="vacancies-table-scroll">
          <table className="vacancies-list">
            <caption className="sr-only">Lista de vagas {statuses.find((item) => item.value === status)?.label.toLocaleLowerCase("pt-BR") ?? "em todas as situações"}</caption>
            <thead><tr><th scope="col">Vaga / posto</th><th scope="col">Posições</th><th scope="col">Candidatos</th><th scope="col">Situação</th><th scope="col">Responsável</th><th scope="col">Ações</th></tr></thead>
            <tbody>{visible.map((vacancy) => <tr key={vacancy.code}>
              <td><button className="vacancies-title-link" type="button" onClick={() => openKanban(vacancy)}>{vacancy.role}</button><small>{vacancy.post} · {vacancy.city}</small><small>{vacancy.code}</small></td>
              <td className="vacancies-number" data-label="Posições">{vacancy.openings}</td>
              <td className="vacancies-number" data-label="Candidatos">{vacancy.candidates}</td>
              <td data-label="Situação"><span className={`vacancies-status-pill ${vacancy.status === "Ativa" ? "active" : "draft"}`}>{vacancy.status}</span></td>
              <td data-label="Responsável"><div className="vacancies-owner"><span aria-hidden="true" className="vacancies-avatar">{initials(vacancy.owner)}</span><span>{vacancy.owner}</span></div></td>
              <td><div className="vacancies-row-actions"><button className="vacancies-open" type="button" onClick={() => openKanban(vacancy)}>Abrir Kanban <ArrowRight size={17} /></button><button className="vacancies-details-button" type="button" aria-label={`Ver detalhes de ${vacancy.role}`} title="Ver detalhes da vaga" onClick={() => setDetails(vacancy)}><DotsThree size={22} weight="bold" /></button></div></td>
            </tr>)}</tbody>
          </table>
        </div>
        {!visible.length && <div className="vacancies-empty"><MagnifyingGlass size={28} /><h2>Nenhuma vaga encontrada</h2><p>{hasFilters ? "Tente outro termo ou limpe os filtros para ver mais vagas." : "Não há vagas nessa situação no demonstrativo."}</p>{hasFilters && <button type="button" className="vacancies-open" onClick={clearFilters}>Limpar busca e filtros</button>}</div>}
        <footer className="vacancies-footer">Exibindo {visible.length} de {vacancies.filter((vacancy) => !status || vacancy.status === status).length} vagas</footer>
      </section>
      <dialog className="vacancies-details-dialog" ref={dialog} aria-labelledby="vacancies-details-title" onClose={() => setDetails(null)}>
        {details && <><header><div><h2 id="vacancies-details-title">{details.role}</h2><p>{details.post} · {details.code}</p></div><button className="vacancies-details-button" type="button" aria-label="Fechar detalhes da vaga" onClick={() => dialog.current.close()}><X size={20} /></button></header><dl><div><dt>Situação</dt><dd>{details.status}</dd></div><div><dt>Responsável</dt><dd>{details.owner}</dd></div><div><dt>Etapa em destaque</dt><dd>{details.stage}</dd></div><div><dt>Prazo do demonstrativo</dt><dd>{details.sla}</dd></div></dl><p className="vacancies-demo-note">Informações demonstrativas. Edição, duplicação e encerramento serão conectados ao fluxo de vagas em uma etapa posterior.</p><footer><button type="button" className="vacancies-open" onClick={() => { dialog.current.close(); openKanban(details); }}>Abrir Kanban <ArrowRight size={17} /></button></footer></>}
      </dialog>
    </main>
  );
}
