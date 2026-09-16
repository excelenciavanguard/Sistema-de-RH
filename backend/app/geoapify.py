"""Geoapify: geocodificação e rota aproximada de transporte público.

Geocoding: https://apidocs.geoapify.com/docs/geocoding/
Routing:   https://apidocs.geoapify.com/docs/routing/

O que a resposta real traz (conferido no Rio em 16/09/2026, fixtures em
tests/fixtures/geoapify):
- "transit" (horários reais) não roteia no Rio; usamos "approximated_transit",
  montado com as linhas do OpenStreetMap, sem horário nem tarifa;
- só vem a rota mais rápida, não a mais barata;
- não há campo com o tipo de veículo: ele está no nome da linha, dentro do texto
  ("Apanhe 1 em direção a Metrô Rio Linha 1 (...)", "... a Ônibus 41JB: ...").

A chave só sai na querystring da chamada do servidor. Nunca vai para resposta,
log ou mensagem de erro.
"""

import re
import threading
import time

import httpx

from app import config
from app.geo import normalizar
from app.modelos import EnderecoNaoLocalizado, ErroProvedor, Local, Rota, Trecho

# result_type da Geoapify -> precisão. Todo o resto (suburb, district, postcode, city...) é "bairro".
# Visto em 16/09/2026: grafia do CEP diferente do mapa ("Goes" x "Góis") devolve o centro do bairro.
_PRECISAO = {"building": "endereco", "amenity": "endereco", "street": "rua"}

URL_GEOCODE = "https://api.geoapify.com/v1/geocode/search"
URL_ROTA = "https://api.geoapify.com/v1/routing"

# Custo por chamada. Rota com instruction_details pode custar 2; contamos 2 para não subestimar.
CREDITOS_GEOCODE = 1
CREDITOS_ROTA = 2

_UF_POR_ESTADO = {"rio de janeiro": "RJ", "state of rio de janeiro": "RJ", "sao paulo": "SP", "minas gerais": "MG", "espirito santo": "ES"}
_CEP = re.compile(r"\b(\d{5})-?(\d{3})\b")


def uf_do_resultado(resultado: dict, texto_buscado: str = "") -> str:
    """Sigla da UF. Parte dos endereços do Rio volta com state="Sudeste" e sem state_code;
    nesse caso o CEP decide (RJ vai de 20000-000 a 28999-999)."""
    sigla = (resultado.get("state_code") or "").strip().upper()
    if len(sigla) == 2:
        return sigla
    pelo_nome = _UF_POR_ESTADO.get(normalizar(resultado.get("state")))
    if pelo_nome:
        return pelo_nome
    for fonte in (resultado.get("postcode") or "", texto_buscado):
        achado = _CEP.search(fonte)
        if achado:
            return "RJ" if 20000000 <= int(achado.group(1) + achado.group(2)) <= 28999999 else ""
    return ""

# 400 que significa "não existe rota", e não falha do serviço.
_SEM_ROTA = {
    "cannot reach destination": "O destino fica longe demais de uma parada de transporte público.",
    "no path could be found": "Nenhum caminho de transporte público encontrado.",
}

# Começo do nome da linha no OpenStreetMap -> veículo.
_VEICULO_POR_PREFIXO = [
    (re.compile(r"^onibus\b"), "onibus"),
    (re.compile(r"^brt\b"), "brt"),
    (re.compile(r"^vlt\b"), "vlt"),
    (re.compile(r"^metro\b"), "metro"),
    (re.compile(r"^(trem|supervia)\b"), "trem"),
    # Ramais da SuperVia chegam só como "Linha <ramal>".
    (re.compile(r"^linha (deodoro|santa cruz|japeri|paracambi|belford roxo|saracuruna|vila inhomirim|guapimirim)\b"), "trem"),
    (re.compile(r"^barcas?\b"), "barca"),
]
_NOME_DA_LINHA = re.compile(r"(?:em dire[cç][aã]o a|towards)\s+(.+?)\.?\s*$", re.IGNORECASE)


def nome_da_linha(instrucao: str | None) -> str | None:
    achado = _NOME_DA_LINHA.search(instrucao or "")
    return achado.group(1).strip() if achado else None


def veiculo_da_linha(linha: str | None) -> str | None:
    nome = normalizar(linha)
    for padrao, veiculo in _VEICULO_POR_PREFIXO:
        if nome and padrao.search(nome):
            return veiculo
    return None


class _SemRota(Exception):
    pass


class ProvedorGeoapify:
    def __init__(self, api_key: str) -> None:
        if not api_key:
            raise ErroProvedor("GEOAPIFY_API_KEY não configurada em backend/.env.")
        self._api_key = api_key
        self._ultima_chamada = 0.0
        self._trava = threading.Lock()
        # Cliente reaproveitado: sem refazer conexão TLS a cada chamada.
        self._http = httpx.Client(timeout=config.GEOAPIFY_TIMEOUT_SEGUNDOS)

    def geocodificar(self, endereco: str) -> Local:
        dados = self._get(URL_GEOCODE, {"text": endereco, "filter": "countrycode:br", "lang": "pt", "limit": 1, "format": "json"})
        return self._local(dados, endereco)

    def geocodificar_perto(self, endereco: str, perto: Local, raio_m: int) -> Local:
        """Busca só dentro de um círculo: sem bairro e CEP no texto, o mapa aceita grafias parecidas."""
        dados = self._get(URL_GEOCODE, {
            "text": endereco,
            "filter": f"circle:{perto.longitude},{perto.latitude},{raio_m}",
            "bias": f"proximity:{perto.longitude},{perto.latitude}",
            "lang": "pt", "limit": 1, "format": "json",
        })
        return self._local(dados, endereco)

    def _local(self, dados: dict, endereco: str) -> Local:
        resultados = dados.get("results") or []
        if not resultados or resultados[0].get("lat") is None:
            raise EnderecoNaoLocalizado(endereco)
        r = resultados[0]
        uf = uf_do_resultado(r, endereco)
        municipio = next((r.get(k).strip() for k in ("city", "municipality", "county", "town", "village") if (r.get(k) or "").strip()), "")
        return Local(
            latitude=float(r["lat"]),
            longitude=float(r["lon"]),
            endereco_formatado=r.get("formatted") or endereco,
            municipio=municipio,
            uf=uf,
            confianca=float((r.get("rank") or {}).get("confidence") or 0.0),
            precisao=_PRECISAO.get(r.get("result_type") or "", "bairro"),
            rua=(r.get("street") or "").strip(),
            cep=(r.get("postcode") or "").strip(),
        )

    def rota(self, origem: Local, destino: Local) -> Rota:
        parametros = {
            "waypoints": f"{origem.latitude},{origem.longitude}|{destino.latitude},{destino.longitude}",
            "mode": config.GEOAPIFY_MODO_ROTA,
            "details": "instruction_details",
            "lang": "pt",
        }
        try:
            dados = self._get(URL_ROTA, parametros)
        except _SemRota as motivo:
            return Rota(encontrada=False, observacao=str(motivo))
        feicoes = dados.get("features") or []
        if not feicoes:
            return Rota(encontrada=False, observacao="Rota não encontrada.")
        propriedades = feicoes[0].get("properties") or {}
        return Rota(
            encontrada=True,
            duracao_segundos=int(round(float(propriedades.get("time") or 0))),
            distancia_metros=int(round(float(propriedades.get("distance") or 0))),
            trechos=_trechos_de(propriedades.get("legs") or []),
        )

    def _get(self, url: str, parametros: dict) -> dict:
        with self._trava:  # várias threads, mas no máximo 1 início de chamada por intervalo
            espera = config.GEOAPIFY_INTERVALO_SEGUNDOS - (time.monotonic() - self._ultima_chamada)
            if espera > 0:
                time.sleep(espera)
            self._ultima_chamada = time.monotonic()
        try:
            resposta = self._http.get(url, params={**parametros, "apiKey": self._api_key})
        except httpx.HTTPError as erro:
            # Só o tipo do erro: a mensagem do httpx pode conter a URL com a chave.
            raise ErroProvedor(f"Falha ao consultar a Geoapify ({type(erro).__name__}).") from erro

        if resposta.status_code == 400:
            mensagem = _mensagem(resposta).lower()
            for trecho, traducao in _SEM_ROTA.items():
                if trecho in mensagem:
                    raise _SemRota(traducao)
        if resposta.status_code == 401:
            raise ErroProvedor("A Geoapify recusou a chave.")
        if resposta.status_code == 429:
            raise ErroProvedor("Limite de requisições da Geoapify atingido.")
        if resposta.status_code >= 400:
            raise ErroProvedor(f"A Geoapify respondeu {resposta.status_code}: {_mensagem(resposta)[:160]}")
        try:
            return resposta.json()
        except ValueError as erro:
            raise ErroProvedor("A Geoapify não respondeu JSON.") from erro


def _mensagem(resposta: httpx.Response) -> str:
    try:
        return str(resposta.json().get("message") or "")
    except ValueError:
        return resposta.text


def _trechos_de(pernas: list) -> list[Trecho]:
    trechos: list[Trecho] = []
    for perna in pernas:
        for passo in perna.get("steps") or []:
            instrucao = passo.get("instruction") or {}
            texto = instrucao.get("text") or ""
            if instrucao.get("type") == "Transit":
                linha = nome_da_linha(instrucao.get("pre_transition_instruction") or texto)
                trechos.append(Trecho(modo="transit", descricao=texto, linha=linha, veiculo=veiculo_da_linha(linha)))
            else:
                trechos.append(Trecho(modo="walk", descricao=texto))
    return trechos
