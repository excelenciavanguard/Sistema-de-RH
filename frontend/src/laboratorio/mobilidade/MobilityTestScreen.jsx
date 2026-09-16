import { useEffect, useMemo, useState } from "react";
import { Bus, CircleAlert, Coins, MapPin, MapPinned, RefreshCw, Search, TrainFront } from "lucide-react";
import { analyzeAddress, geocodePendingPosts, getGeoapifyUsage, listMobilityPosts, lookupCep } from "./api.js";
import "./mobility-test.css";

const RESULT_LABELS = {
  dentro_da_meta: { label: "Dentro da meta", tone: "success" },
  conferir: { label: "Conferir", tone: "warning" },
  fora_da_meta: { label: "Fora da meta", tone: "danger" },
  null: { label: "Não consultado", tone: "neutral" },
};
const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "dentro_da_meta", label: "Dentro" },
  { id: "conferir", label: "Conferir" },
  { id: "fora_da_meta", label: "Fora" },
];
const money = (value) => (value === null || value === undefined ? "—" : value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
const formatCep = (value) => value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

export function MobilityTestScreen() {
  const [posts, setPosts] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [address, setAddress] = useState({ cep: "", street: "", number: "", district: "", city: "" });
  const [cepHint, setCepHint] = useState("");
  const [top, setTop] = useState(5);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [filter, setFilter] = useState("todos");

  const refresh = async () => {
    setLoadError("");
    try {
      const [postList, usageToday] = await Promise.all([listMobilityPosts(), getGeoapifyUsage()]);
      setPosts(postList);
      setUsage(usageToday);
    } catch (error) {
      setLoadError(error.message);
    }
  };

  useEffect(() => { refresh(); }, []);

  const geocode = async () => {
    setGeocoding(true);
    try {
      await geocodePendingPosts();
      await refresh();
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setGeocoding(false);
    }
  };

  const updateCep = async (value) => {
    const cep = formatCep(value);
    setAddress((current) => ({ ...current, cep }));
    if (cep.length !== 9) return setCepHint("");
    setCepHint("Buscando CEP…");
    const found = await lookupCep(cep);
    if (!found) return setCepHint("CEP não encontrado. Preencha o endereço.");
    if (found.uf !== "RJ") return setCepHint(`CEP de ${found.city}/${found.uf}: os postos são do RJ.`);
    setAddress((current) => ({ ...current, street: found.street || current.street, district: found.district || current.district, city: found.city }));
    setCepHint("Endereço preenchido pelo CEP.");
  };

  const analyze = async (event) => {
    event.preventDefault();
    const text = [address.street, address.number, address.district, address.city, "RJ", address.cep].filter(Boolean).join(", ");
    setAnalyzing(true);
    setAnalysisError("");
    try {
      setAnalysis(await analyzeAddress(text, Number(top), { rua: address.street, numero: address.number }));
      setFilter("todos");
      setUsage(await getGeoapifyUsage());
    } catch (error) {
      setAnalysisError(error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const visibleResults = useMemo(() => {
    const results = analysis?.resultados ?? [];
    return filter === "todos" ? results : results.filter((item) => item.classificacao === filter);
  }, [analysis, filter]);

  const problemPosts = (posts?.postos ?? []).filter((post) => post.situacao !== "localizado" || (post.confianca ?? 1) < 0.5);
  const counts = posts?.por_situacao ?? {};

  return (
    <main className="screen-workspace mobility-test-screen">
      <header className="screen-header">
        <div>
          <p className="screen-eyebrow">Recrutamento · teste</p>
          <div className="screen-title-row">
            <h1>Mobilidade até os postos</h1>
            <span className="demo-label real-data-label">Dados reais</span>
          </div>
          <p>Postos em operação no WebOper (somente leitura), localização e rotas pela Geoapify e a regra de vale-transporte da empresa.</p>
        </div>
      </header>

      {loadError && <div className="mobility-test-alert" role="alert"><CircleAlert size={18} /> {loadError}</div>}

      <section className="mobility-test-cards">
        <article className="surface-panel">
          <span className="mobility-test-card-icon"><MapPinned size={20} /></span>
          <div>
            <small>Postos em operação</small>
            <strong>{posts ? `${counts.localizado ?? 0} de ${posts.total} localizados` : "Carregando…"}</strong>
            {posts?.dias_operacao && <p>Clientes ativos com escala nos últimos {posts.dias_operacao} dias.</p>}
            {posts && <p>{counts.pendente ?? 0} pendentes · {counts.impreciso ?? 0} só com bairro · {counts.nao_localizado ?? 0} não localizados · {counts.fora_do_rj ?? 0} fora do RJ</p>}
          </div>
          <button className="secondary-action" type="button" onClick={geocode} disabled={geocoding || !counts.pendente}>
            <RefreshCw size={16} /> {geocoding ? "Localizando…" : "Localizar pendentes"}
          </button>
        </article>
        <article className="surface-panel">
          <span className="mobility-test-card-icon"><Coins size={20} /></span>
          <div>
            <small>Créditos Geoapify hoje (estimado)</small>
            <strong>{usage ? `${usage.creditos_estimados} de ${usage.limite_gratuito_dia.toLocaleString("pt-BR")}` : "—"}</strong>
            <p>Plano gratuito. Localizar um posto custa 1; cada rota, até 2.</p>
          </div>
        </article>
        <article className="surface-panel">
          <span className="mobility-test-card-icon"><Bus size={20} /></span>
          <div>
            <small>Regra de vale-transporte</small>
            <strong>R$ 5 por sentido · R$ 10 por dia</strong>
            <p>Até 3 ônibus (Jaé) ou 1 metrô (Riocard) por sentido. BRT, VLT, trem, barca, metrô com outra condução ou outro município: fora.</p>
          </div>
        </article>
      </section>

      <section className="surface-panel mobility-test-form-panel">
        <div className="panel-heading">
          <div><h2>Endereço do candidato</h2><p>O CEP preenche o resto. O endereço é usado só nesta consulta e não fica guardado.</p></div>
        </div>
        <form className="mobility-test-form" onSubmit={analyze}>
          <label className="field-control"><span>CEP</span><input inputMode="numeric" value={address.cep} onChange={(e) => updateCep(e.target.value)} placeholder="00000-000" />{cepHint && <small>{cepHint}</small>}</label>
          <label className="field-control wide"><span>Rua</span><input required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="Rua, avenida, estrada…" /></label>
          <label className="field-control"><span>Número</span><input value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} placeholder="Nº" /></label>
          <label className="field-control"><span>Bairro</span><input required value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} /></label>
          <label className="field-control"><span>Cidade</span><input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /></label>
          <label className="field-control"><span>Rotas a consultar</span><select value={top} onChange={(e) => setTop(e.target.value)}>{[3, 5, 10].map((n) => <option key={n} value={n}>{n} postos mais próximos</option>)}</select></label>
          <button className="primary-action" type="submit" disabled={analyzing}><Search size={16} /> {analyzing ? "Analisando…" : "Analisar postos"}</button>
        </form>
        {analysisError && <div className="mobility-test-alert" role="alert"><CircleAlert size={18} /> {analysisError}</div>}
      </section>

      {analysis && (
        <section className="surface-panel mobility-test-results">
          <div className="panel-heading">
            <div>
              <h2><MapPin size={16} /> {analysis.candidato.endereco}</h2>
              <p>
                {analysis.resumo.dentro_da_meta} postos dentro da meta · {analysis.resumo.rotas_consultadas} rotas consultadas ·
                {" "}{analysis.resumo.creditos_estimados} créditos nesta análise
                {analysis.candidato.precisao === "rua" && " · localizado pela rua, sem o número exato"}
                {analysis.candidato.grafia_corrigida && ` · rua encontrada no mapa como “${analysis.candidato.grafia_corrigida}”`}
              </p>
            </div>
            <div className="mobility-test-filters" role="group" aria-label="Filtrar resultado">
              {FILTERS.map((item) => (
                <button key={item.id} type="button" className={filter === item.id ? "active" : ""} onClick={() => setFilter(item.id)}>{item.label}</button>
              ))}
            </div>
          </div>
          <div className="mobility-test-table-wrap">
            <table className="mobility-test-table">
              <thead><tr><th>Posto</th><th>Distância</th><th>Conduções</th><th>Custo por dia</th><th>Resultado</th><th>Motivo</th></tr></thead>
              <tbody>
                {visibleResults.map((item) => {
                  const result = RESULT_LABELS[item.classificacao] ?? RESULT_LABELS.null;
                  return (
                    <tr key={item.chave}>
                      <td><strong>{item.posto}</strong><small>{item.bairro} · {item.municipio}</small></td>
                      <td className="numeric">{item.distancia_km.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km</td>
                      <td>{item.conducoes.length ? item.conducoes.map((name) => <span className="mobility-test-line" key={name}>{/metr|trem|linha/i.test(name) ? <TrainFront size={13} /> : <Bus size={13} />}{name}</span>) : "—"}</td>
                      <td className="numeric">{money(item.custo_dia)}{item.pagamento && <small>{item.pagamento}</small>}</td>
                      <td><span className={`status-pill ${result.tone}`}>{result.label}</span></td>
                      <td className="mobility-test-reason">{item.motivo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mobility-test-footnote">Estimativa: a Geoapify devolve a rota mais rápida, não a mais barata, e a volta é considerada igual à ida. Não substitui a conferência do RH.</p>
        </section>
      )}

      {problemPosts.length > 0 && (
        <details className="surface-panel mobility-test-problems">
          <summary>{problemPosts.length} postos para conferir no cadastro do WebOper</summary>
          <ul>
            {problemPosts.map((post) => (
              <li key={post.chave}>
                <strong>{post.nome}</strong>
                <span>{post.endereco_weboper}</span>
                <small>{post.situacao === "localizado" ? `Localizado com confiança baixa (${Math.round((post.confianca ?? 0) * 100)}%)` : post.erro || post.situacao}</small>
              </li>
            ))}
          </ul>
        </details>
      )}
    </main>
  );
}
