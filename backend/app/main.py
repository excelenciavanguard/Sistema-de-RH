"""API de teste da mobilidade: postos do WebOper (leitura) + Geoapify + regra de VT."""

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app import analise, config, weboper
from app.cache import Cache
from app.geoapify import ProvedorGeoapify
from app.modelos import ErroProvedor

app = FastAPI(title="Alpha RH — Mobilidade (teste)", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=config.CORS_ORIGENS, allow_methods=["GET", "POST"], allow_headers=["*"])

_cache: Cache | None = None


def obter_cache() -> Cache:
    global _cache
    if _cache is None:
        _cache = Cache(config.CAMINHO_CACHE)
    return _cache


_provedor: ProvedorGeoapify | None = None


def obter_provedor() -> ProvedorGeoapify:
    global _provedor
    if _provedor is None:
        try:
            _provedor = ProvedorGeoapify(config.GEOAPIFY_API_KEY)
        except ErroProvedor as erro:
            raise HTTPException(503, str(erro)) from erro
    return _provedor


def obter_postos() -> list[weboper.PostoWebOper]:
    try:
        return weboper.listar_postos_ativos()
    except weboper.WebOperIndisponivel as erro:
        raise HTTPException(503, str(erro)) from erro


class PedidoAnalise(BaseModel):
    endereco: str = Field(min_length=8, max_length=300)
    top: int = Field(default=config.ANALISE_TOP_POSTOS, ge=1, le=20)


@app.get("/api/v1/health")
def health():
    return {"status": "ok", "weboper_configurado": config.WEBOPER_CONFIGURADO, "geoapify_configurado": bool(config.GEOAPIFY_API_KEY)}


@app.get("/api/v1/mobilidade/postos")
def listar_postos(postos=Depends(obter_postos), cache: Cache = Depends(obter_cache)):
    itens = analise.situacao_dos_postos(postos, cache)
    contagem: dict[str, int] = {}
    for item in itens:
        contagem[item.situacao] = contagem.get(item.situacao, 0) + 1
    return {
        "total": len(itens),
        "por_situacao": contagem,
        "postos": [
            {
                "chave": i.posto.chave,
                "nome": i.posto.nome,
                "endereco_weboper": i.posto.endereco_busca,
                "situacao": i.situacao,
                "municipio": i.local.municipio if i.local else i.posto.municipio,
                "confianca": i.local.confianca if i.local else None,
                "erro": i.erro,
            }
            for i in itens
        ],
    }


@app.post("/api/v1/mobilidade/postos/geocodificar")
def geocodificar_postos(
    limite: int = Query(default=40, ge=1, le=200),
    postos=Depends(obter_postos),
    cache: Cache = Depends(obter_cache),
    provedor: ProvedorGeoapify = Depends(obter_provedor),
):
    try:
        return analise.geocodificar_pendentes(postos, cache, provedor, limite)
    except ErroProvedor as erro:
        raise HTTPException(503, str(erro)) from erro


@app.post("/api/v1/mobilidade/analisar")
def analisar(
    pedido: PedidoAnalise,
    postos=Depends(obter_postos),
    cache: Cache = Depends(obter_cache),
    provedor: ProvedorGeoapify = Depends(obter_provedor),
):
    try:
        return analise.analisar(pedido.endereco, postos, cache, provedor, pedido.top)
    except analise.EnderecoInvalido as erro:
        raise HTTPException(422, str(erro)) from erro
    except ErroProvedor as erro:
        raise HTTPException(503, str(erro)) from erro


@app.get("/api/v1/mobilidade/consumo")
def consumo(cache: Cache = Depends(obter_cache)):
    return cache.consumo_do_dia()
