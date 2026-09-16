"""Tipos compartilhados entre geocodificação, rota e regra de vale-transporte."""

from dataclasses import dataclass, field


class ErroProvedor(RuntimeError):
    """Falha temporária do provedor de mapas (rede, chave, limite)."""


class EnderecoNaoLocalizado(ValueError):
    """O provedor não encontrou o endereço."""


@dataclass(frozen=True)
class Local:
    latitude: float
    longitude: float
    endereco_formatado: str
    municipio: str
    uf: str
    confianca: float = 0.0
    # endereco (prédio/número) | rua (sem número) | bairro (centro do bairro, CEP ou cidade).
    # "bairro" não serve para medir distância: pode errar vários quilômetros.
    precisao: str = "endereco"
    rua: str = ""  # nome da rua como está no mapa
    cep: str = ""


@dataclass(frozen=True)
class Trecho:
    modo: str  # "walk" | "transit"
    descricao: str
    linha: str | None = None
    # onibus | brt | vlt | metro | trem | barca; None quando não dá para saber.
    veiculo: str | None = None


@dataclass(frozen=True)
class Rota:
    encontrada: bool
    duracao_segundos: int = 0
    distancia_metros: int = 0
    trechos: list[Trecho] = field(default_factory=list)
    observacao: str | None = None

    @property
    def conducoes(self) -> list[Trecho]:
        return [trecho for trecho in self.trechos if trecho.modo == "transit"]
