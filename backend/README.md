# Backend de mobilidade (teste)

API pequena para testar, com dados reais, o cruzamento entre o endereço de um candidato e os postos da empresa.

- **Postos:** clientes ativos de `CAD_CLIENTE` com escala recente em `FOLHA_ESCALA`, **somente leitura**.
- **Localização e rotas:** Geoapify (plano gratuito, 3.000 créditos/dia).
- **Regra de vale-transporte:** estimativa de custo por posto.

A tela que usa esta API é uma página separada do app da equipe: `frontend/mobilidade.html` (em desenvolvimento, `http://localhost:5185/mobilidade.html`).

## Postos em operação

O cadastro `Ativo` sozinho não basta. O laboratório cruza os clientes ativos com os códigos distintos de `FOLHA_ESCALA.CODIGO_CLIENTE` no intervalo entre a data de hoje menos `WEBOPER_DIAS_OPERACAO` (30 por padrão) e o fim do dia atual. Escalas futuras não entram. A data de corte usa o relógio do WebOper.

São duas consultas simples, sem subconsulta por cliente, sem escrita e com cache de cinco minutos. A lista filtrada é compartilhada por listagem, geocodificação e análise de rotas; coordenadas antigas no cache local não recolocam clientes excluídos no ranking. Se a consulta à escala falhar, a API avisa o erro, sem liberar todos os clientes como alternativa.

Esse é um indicador de atividade recente, não uma garantia de contrato vigente: um posto novo ainda sem escala fica de fora; um encerrado recentemente que continue ativo no cadastro pode permanecer até sair da janela. Em 16/09/2026, a leitura retornou 66 postos em cerca de 1,8 segundo.

## Precisão da localização

A Geoapify nem sempre acha o endereço exato. Quando a grafia do CEP difere da do mapa (por exemplo, "Goes" nos Correios e "Góis" no mapa), ela devolve o **centro do bairro** sem avisar. Uma distância medida a partir desse ponto pode errar vários quilômetros. Em 16/09/2026, um candidato que mora em frente a um posto apareceu a 1 km dele, e outro posto apareceu a 0 km.

Por isso, cada localização guarda a precisão, tirada do `result_type` da Geoapify:

| Precisão | Tipo | O que acontece |
|---|---|---|
| `endereco` | `building`, `amenity` | Usada normalmente |
| `rua` | `street` | Usada, com aviso de que falta o número |
| `bairro` | `suburb`, `postcode`, `city` e demais | **Candidato:** análise recusada, pedindo para conferir a grafia da rua. **Posto:** aparece como "Conferir", sem decisão por distância nem rota |

### Correção automática da rua

Antes de desistir de um resultado que só achou o bairro, o backend faz até duas tentativas, cada uma com mais 1 crédito:

1. **Grafia atual do nome:** o mesmo endereço com a grafia atualizada ("goes" → "gois", ph → f, th → t, y → i, letras dobradas, Luiz → Luis, Souza → Sousa).
2. **Busca por perto:** só rua e número, num raio de 5 km em volta do bairro encontrado. Resolve cadastros como "RUAASSUNCAO".

Um resultado só é aceito se for endereço ou rua, com nome pelo menos 85% igual (sem acento e sem o tipo de via) e dentro do raio. Sem essa conferência, a busca aceitaria outra rua parecida: num teste real, apareceu a "General Polidoro" no lugar da rua pedida. Quando a correção é usada, a resposta traz `candidato.grafia_corrigida` e a tela avisa. Para isso a tela manda `rua` e `numero` separados.

A confiança sozinha não resolve: há centro de bairro com confiança de 100%. Localizações gravadas antes da precisão voltam a ser pendentes e são localizadas de novo.

## Acesso ao cadastro do candidato

Na barra do laboratório, **Abrir tela do candidato** fica à esquerda de **Abrir o sistema**. O destino padrão usa o mesmo hostname, porta `5190` e caminho `/enviar-curriculo`, do projeto CarreirasExcelencia. O portal precisa estar rodando. `VITE_CANDIDATO_URL` permite configurar outro destino; veja `frontend/.env.example`. É somente um atalho: esta alteração não integra os dados dos dois sistemas.

## WebOper é somente leitura

Nenhum `INSERT`, `UPDATE`, `DELETE`, DDL, rota de escrita ou migration contra o WebOper, nunca. A conta usada pode escrever, então a garantia está no código:

1. toda consulta passa por `app/weboper_seguranca.py`, que só aceita `SELECT`, `SHOW` e `DESCRIBE`;
2. a sessão MySQL abre com `SET SESSION TRANSACTION READ ONLY`, e o próprio MySQL recusa escrita;
3. não existe endpoint de SQL livre.

É a mesma regra do SistemaLancamentoExtras. Afrouxar qualquer uma dessas barreiras é incidente de segurança.

## Regra de vale-transporte

Meta: **R$ 5 por sentido, R$ 10 por dia** (regra do Nathan, 16/09/2026).

| Trajeto por sentido | Resultado |
|---|---|
| Até 2 km em linha reta | Dentro da meta, a pé |
| 1, 2 ou 3 ônibus do Rio (`VT_MAX_CONDUCOES_JAE=3`) | Dentro, estimativa de R$ 5 no Jaé |
| 4 ou mais ônibus, BRT ou VLT (sozinhos ou combinados) | Fora |
| 1 metrô, sozinho | Dentro, R$ 5 no bilhete único via Riocard |
| Metrô com outra condução | Fora |
| Trem ou barca | Fora |
| Posto em outro município | Fora, sem gastar rota |
| Sem rota, condução não identificada ou posto com localização incerta | Conferir |

É **estimativa**: a Geoapify devolve a rota mais rápida, não a mais barata, e a volta é tratada como igual à ida. Tempo de viagem não entra na regra.

O limite de três ônibus e a exclusão de BRT/VLT são a regra de simulação confirmada pelo Nathan, não uma validação oficial de integração tarifária. Em instalações que já tenham `.env`, atualizar `VT_MAX_CONDUCOES_JAE=3` e reiniciar a API; o ambiente prevalece sobre o valor padrão.

## Como rodar

```bash
cd backend
python -m venv .venv
./.venv/Scripts/python.exe -m pip install -r requirements.txt
cp .env.example .env   # preencha WEBOPER_DB_* e GEOAPIFY_API_KEY
./.venv/Scripts/python.exe -m uvicorn app.main:app --port 8020
```

O frontend chama `http://127.0.0.1:8020/api/v1`. Para outra URL, use `VITE_MOBILIDADE_API_URL`.

## Endpoints

| Método | Rota | O que faz | Créditos |
|---|---|---|---|
| `GET` | `/api/v1/health` | Diz se WebOper e Geoapify estão configurados | 0 |
| `GET` | `/api/v1/mobilidade/postos` | Postos ativos e situação da localização | 0 |
| `POST` | `/api/v1/mobilidade/postos/geocodificar?limite=40` | Localiza postos pendentes | 1 por posto |
| `POST` | `/api/v1/mobilidade/analisar` | `{"endereco": "...", "top": 5}`: ranking dos postos | 1 + até 2 por rota |
| `GET` | `/api/v1/mobilidade/consumo` | Créditos estimados do dia | 0 |

As coordenadas dos postos ficam em cache local (`backend/var/mobilidade.sqlite3`, não versionado). Só voltam a gastar crédito se o endereço mudar no WebOper. O endereço do candidato não é guardado.

## Testes

```bash
./.venv/Scripts/python.exe -m pytest -q
```

Os testes não usam rede nem WebOper. `tests/fixtures/geoapify` tem respostas gravadas no Rio em 16/09/2026, sem a chave. A seleção dos postos é coberta por cenários com e sem escala, códigos duplicados, cache, expiração e falha de consulta.
