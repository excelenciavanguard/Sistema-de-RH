"""Estimativa de vale-transporte por posto.

Regra definida pelo Nathan em 16/09/2026. Meta: R$ 5 por sentido, R$ 10 por dia.

- Até 3 ônibus do Rio por sentido: estimativa de R$ 5, pago no Jaé.
  O limite é VT_MAX_CONDUCOES_JAE; BRT e VLT não entram nesta regra.
- 1 metrô por sentido, sozinho: R$ 5 no bilhete único, pago via Riocard.
- Metrô com outra condução: passa da meta.
- Trem ou barca: passa da meta.
- Outro município: passa da meta (a empresa não paga o Bilhete Único Intermunicipal).

É estimativa, não decisão: a Geoapify devolve a rota mais rápida, não a mais
barata, e a volta é considerada igual à ida. Tempo de viagem não entra na regra.
"""

from dataclasses import dataclass, field
from decimal import Decimal

from app import config
from app.geo import mesmo_municipio
from app.modelos import Rota

DENTRO = "dentro_da_meta"
FORA = "fora_da_meta"
CONFERIR = "conferir"

JAE = {"onibus"}
NOME_VEICULO = {"onibus": "Ônibus", "brt": "BRT", "vlt": "VLT", "metro": "Metrô", "trem": "Trem", "barca": "Barca"}


@dataclass(frozen=True)
class Estimativa:
    classificacao: str
    motivo: str
    custo_sentido: Decimal | None = None
    custo_dia: Decimal | None = None
    pagamento: str | None = None  # "Jaé" | "Riocard (bilhete único)"
    conducoes: list[str] = field(default_factory=list)
    intermunicipal: bool = False


def _km(valor: float) -> str:
    return f"{round(valor, 1):.1f}".replace(".", ",")


def _reais(valor) -> str:
    return f"R$ {valor:.2f}".replace(".", ",")


def decidir_sem_rota(*, municipio_candidato: str, municipio_posto: str, distancia_reta_km: float) -> Estimativa | None:
    """Casos que não precisam gastar crédito com rota. None = precisa consultar."""
    if distancia_reta_km <= config.VT_RAIO_CAMINHAVEL_KM:
        return Estimativa(DENTRO, f"Dá para ir a pé: {_km(distancia_reta_km)} km em linha reta.", Decimal("0.00"), Decimal("0.00"))
    if not mesmo_municipio(municipio_candidato, municipio_posto):
        return Estimativa(
            FORA,
            f"Outro município ({municipio_candidato} → {municipio_posto}): a passagem intermunicipal passa de "
            f"{_reais(config.VT_TARIFA_SENTIDO)} e a empresa não paga o Bilhete Único Intermunicipal.",
            intermunicipal=True,
        )
    return None


def estimar(rota: Rota) -> Estimativa:
    """Aplica a regra a uma rota já consultada, de pessoa e posto no mesmo município."""
    tarifa = config.VT_TARIFA_SENTIDO
    if not rota.encontrada:
        return Estimativa(CONFERIR, rota.observacao or "Rota não encontrada.")

    conducoes = rota.conducoes
    nomes = [t.linha or NOME_VEICULO.get(t.veiculo or "", "Condução") for t in conducoes]
    if not conducoes:
        return Estimativa(CONFERIR, "A rota não usa transporte público, mas a distância passa do limite para ir a pé.")

    veiculos = [t.veiculo for t in conducoes]
    if None in veiculos:
        desconhecida = next(t.linha or t.descricao for t in conducoes if t.veiculo is None)
        return Estimativa(CONFERIR, f"Não deu para identificar o tipo da condução \"{desconhecida}\".", conducoes=nomes)

    if "trem" in veiculos or "barca" in veiculos:
        tipo = "Trem" if "trem" in veiculos else "Barca"
        return Estimativa(FORA, f"{tipo} no trajeto: fica fora da meta de {_reais(tarifa)} por sentido.", conducoes=nomes)

    if "metro" in veiculos:
        if len(conducoes) == 1:
            return Estimativa(DENTRO, "Um metrô por sentido, no bilhete único.", tarifa, tarifa * 2, "Riocard (bilhete único)", nomes)
        return Estimativa(FORA, "Metrô com outra condução: passa da meta.", conducoes=nomes)

    if "brt" in veiculos or "vlt" in veiculos:
        return Estimativa(FORA, "BRT ou VLT no trajeto: a regra Jaé desta estimativa aceita somente ônibus.", conducoes=nomes)

    if all(v in JAE for v in veiculos):
        if len(conducoes) <= config.VT_MAX_CONDUCOES_JAE:
            descricao = "Um ônibus" if len(conducoes) == 1 else f"{len(conducoes)} ônibus integrados"
            return Estimativa(DENTRO, f"{descricao} por sentido, no Jaé.", tarifa, tarifa * 2, "Jaé", nomes)
        return Estimativa(
            FORA, f"{len(conducoes)} ônibus por sentido: a estimativa Jaé permite até {config.VT_MAX_CONDUCOES_JAE}.", conducoes=nomes
        )

    return Estimativa(CONFERIR, "Combinação de conduções fora das regras conhecidas.", conducoes=nomes)
