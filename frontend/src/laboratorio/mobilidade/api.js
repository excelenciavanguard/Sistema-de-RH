// Backend de teste da mobilidade (Sistema-de-RH/backend). Porta própria para não colidir com outras APIs locais.
const API_URL = import.meta.env.VITE_MOBILIDADE_API_URL || "http://127.0.0.1:8020/api/v1";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  } catch {
    throw new Error("Backend de mobilidade fora do ar. Inicie a API em backend/ (porta 8020).");
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(typeof payload?.detail === "string" ? payload.detail : `Erro ${response.status} no backend de mobilidade.`);
  return payload;
}

export const listMobilityPosts = () => request("/mobilidade/postos");
export const geocodePendingPosts = (limit = 200) => request(`/mobilidade/postos/geocodificar?limite=${limit}`, { method: "POST" });
// Rua e número vão separados para o backend corrigir a grafia quando o mapa só acha o bairro.
export const analyzeAddress = (endereco, top, campos = {}) => request("/mobilidade/analisar", { method: "POST", body: JSON.stringify({ endereco, top, ...campos }) });
export const getGeoapifyUsage = () => request("/mobilidade/consumo");

// ViaCEP preenche rua, bairro e cidade. Não gasta crédito da Geoapify.
export async function lookupCep(cep) {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  try {
    const data = await (await fetch(`https://viacep.com.br/ws/${digits}/json/`)).json();
    if (!data || data.erro) return null;
    return { street: data.logradouro || "", district: data.bairro || "", city: data.localidade || "", uf: (data.uf || "").toUpperCase() };
  } catch {
    return null;
  }
}
