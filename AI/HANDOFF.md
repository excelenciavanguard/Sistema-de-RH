# HANDOFF — Laboratório de mobilidade (Sistema-de-RH)

## Retomada pelo Codex — 16/09/2026

Pedido atual: finalizar apenas o filtro de postos em operação e o atalho para a tela do candidato que ficaram pendentes no Claude. O script `postos_em_operacao.py` estava no scratchpad, mas não tinha sido executado; a cópia local estava limpa no commit `0d6ee1b`, igual à `origin/main` após fetch.

### Entregue localmente

- `backend/app/weboper.py`: cruza clientes ativos com `SELECT DISTINCT CODIGO_CLIENTE FROM FOLHA_ESCALA` na janela recente. Duas consultas simples, sem subconsulta correlacionada por cliente. Todas passam pelas barreiras existentes de somente leitura. Cache de cinco minutos; nenhuma liberação de todos os clientes se a consulta da escala falhar.
- `backend/app/config.py`: `WEBOPER_DIAS_OPERACAO`, padrão 30, limitado entre 1 e 90 dias. Consulta inclui a data de corte e o dia atual inteiro, e exclui datas futuras. O critério é indicador de operação recente, não prova de contrato vigente.
- `backend/app/main.py`: listagem informa `dias_operacao`; listagem, geocodificação e análise continuam consumindo a mesma seleção de postos. Não foram alteradas as regras de VT nem as chamadas da Geoapify.
- `frontend/src/laboratorio/mobilidade/LabHeader.jsx`: **Abrir tela do candidato** à esquerda de **Abrir o sistema**, destino padrão no mesmo hostname, porta 5190, `/enviar-curriculo`. `VITE_CANDIDATO_URL` permite outro endereço. Link simples, sem integração de dados entre projetos.
- Tela informa **Postos em operação** e o critério da escala. Estilos e alterações limitados ao laboratório; nenhum componente do cabeçalho principal, tela da equipe ou teste existente da equipe foi alterado.

### Verificação

- Os cinco testes novos de seleção falharam antes da correção porque retornavam todo o cadastro. Passaram depois, cobrindo interseção, escala vazia, cache, expiração, duplicidade e indisponibilidade da escala.
- Os testes do novo atalho falharam por ausência do link e passaram após inclusão. Teste da mensagem de operação também percorreu falha e sucesso.
- Backend: **53 passed**, dois avisos de depreciação em dependências do TestClient.
- Frontend: **43 passed** (40 existentes + 3 novos); `npm run typecheck` e `npm run build` concluídos. Build mantém o aviso de bundle acima de 500 kB. Como antes, o build da equipe não inclui `mobilidade.html`; laboratório é de desenvolvimento.
- Leitura real do WebOper: **66 postos**, cerca de **1,8 s**, sem gravar nada no banco. API local reiniciada em 127.0.0.1:8020; endpoint retornou 65 localizados e 1 fora do RJ. Não foram feitas novas chamadas à Geoapify nessa retomada.
- Navegador: tela em localhost:5185/mobilidade.html mostra contagem e critério; clique no novo atalho abriu localhost:5190/enviar-curriculo com CPF e endereço completo.
- Nenhum segredo, nome/endereço de cliente real ou cache foi adicionado ao Git. As alterações ainda **não foram commitadas nem enviadas**.

### Regra Jaé fechada (Claude, 16/09/2026, commit 75f04ef)

- Nathan confirmou: **até 3 ônibus** por sentido ficam dentro da estimativa de R$ 5 no Jaé. BRT e VLT ficam fora, assim como 4 ônibus ou mais. Metrô sozinho continua dentro.
- `VT_MAX_CONDUCOES_JAE=3` no padrão, no `.env.example` e no `.env` local. Backend: 62 testes.
- Conferido ao vivo, com a API reiniciada: a resposta traz `max_conducoes_jae: 3`, 66 postos em operação e 65 localizados.

### Precisão da localização (Claude, 16/09/2026)

Problema relatado pelo Nathan ao testar um endereço real: o candidato apareceu a 1 km de um posto em frente à casa dele, a 0 km de outro a 2 km e a 2,1 km de um terceiro a 3 km.

- **Causa:** a grafia dos Correios ("Goes") difere da do mapa ("Góis"). A Geoapify devolveu o centro do bairro (`result_type: suburb`, confiança 25%), e o sistema mediu a partir dali. Quatro postos também estavam só com o bairro, um deles com confiança de 100%.
- **Correção:** `Local.precisao` (endereco, rua ou bairro) vem do `result_type` e fica gravada no cache. Candidato localizado só pelo bairro é recusado com orientação. Posto só com o bairro fica como "Conferir", sem rota.
- **Resultado com a grafia do mapa:** 0,2 km do posto em frente, 2,6 km do posto a 3 km a pé, e o posto impreciso foi para conferir. Com a grafia do CEP, a API responde 422 com a orientação.
- **Postos com endereço a corrigir no WebOper:** 4, listados na tela do laboratório.
- **Limitação que continua:** a linha de ônibus sugerida vem das rotas aproximadas do OpenStreetMap e pode não ser a que o Google recomenda. A classificação (1 ônibus, R$ 5) é uma estimativa.
- **Testes:** backend com 73.

### Correção automática da grafia da rua (Claude, 16/09/2026)

Pedido do Nathan: o sistema deve entender sozinho quando a grafia do CEP difere da do mapa, sem ele trocar "Goes" por "Góis" à mão.

- `analise.localizar`: se a busca só acha o bairro, tenta (1) a grafia atual do nome e (2) rua e número num raio de 5 km. Aceita só endereço ou rua com nome pelo menos 85% igual e dentro do raio. Vale para candidatos e postos.
- `geo.py`: `grafia_atual`, `nome_da_rua`, `semelhanca_de_rua`. `geoapify.py`: `geocodificar_perto` (filtro por círculo) e `Local.rua` e `Local.cep`.
- Distâncias e valores nos motivos passaram a usar vírgula e o mesmo arredondamento da coluna, que antes mostrava "0,3 km" enquanto o motivo dizia "0.2 km".
- **Resultado real:** o endereço com a grafia do CEP foi corrigido sozinho, com 1 crédito a mais. Dos 4 postos que estavam só com o bairro, 2 foram corrigidos; continuam para conferir os 2 com o nome errado ou bagunçado no WebOper.
- **Testes:** backend com 81.

### Testes da equipe na `main` (não causados pelo laboratório)

Depois do commit `fc48c65` (painel inicial e identidade visual), a `main` teve erro de tipagem no `Logo.tsx` e dois testes da tela inicial falhando. O commit `fb7342e` (Lucas, 16h38) corrigiu esses três. Em 16/09, às 16h40, falta só um:

- `src/typography.test.js`: o CSS novo tem uma fonte de 8,5 px, que o próprio teste proíbe.

Os arquivos são da equipe e não foram alterados. O sino que abre o laboratório e o usuário Simão Pedro continuam no `header-3.tsx`.

---

## Registro anterior do Claude (histórico)

Data: 16 de setembro de 2026
Agente: Claude Code, a pedido do Nathan

## Pedido

Testar em tempo real a mobilidade com dados reais: postos da empresa lidos do WebOper (somente leitura), localização e rotas pela Geoapify e a regra de vale-transporte definida pelo Nathan. **Tudo em uma tela separada, sem alterar nada do que a equipe está fazendo.**

## Separação do trabalho da equipe

Nenhum arquivo existente foi modificado. Tudo é arquivo novo:

```
backend/                                   API de teste (FastAPI)
frontend/mobilidade.html                   página própria do laboratório
frontend/src/laboratorio/mobilidade/       tela, API e CSS do laboratório
AI/HANDOFF.md                              este arquivo
```

- A página abre em `http://localhost:5185/mobilidade.html`, e não pelo `App.jsx`, rotas ou menu da equipe.
- Ela só **importa** `styles.css` e `typography.css` para ter a mesma cara. Não usa componentes do sistema: se a equipe mudar um componente, o laboratório não quebra, e vice-versa.
- `npm run build` continua gerando só o `index.html` da equipe. A página do laboratório existe no ambiente de desenvolvimento.
- A equipe mantém o repositório focado no frontend (commit a97db15). O `backend/` existe só para o laboratório e não é usado pelo app da equipe.

## Regra de vale-transporte (Nathan, 16/09/2026)

Meta de R$ 5 por sentido e R$ 10 por dia. Um ônibus do Rio por sentido fica dentro (Jaé). Um metrô sozinho fica dentro (bilhete único via Riocard). Metrô com outra condução, trem ou barca ficam fora. Posto em outro município fica fora. Tempo de viagem não entra. Detalhes em `backend/README.md` e `backend/app/regra_vt.py`.

## Segurança

- **WebOper somente leitura**, em três barreiras: filtro que só aceita `SELECT/SHOW/DESCRIBE`, sessão `SET SESSION TRANSACTION READ ONLY` e nenhum endpoint de SQL livre. Uma única consulta: `CAD_CLIENTE` com situação ativa.
- **Repositório público:** credenciais (`backend/.env`), cache de coordenadas (`backend/var/`) e nomes ou endereços de clientes **não são versionados**. Os dados reais só aparecem na tela, em tempo de execução. As fixtures de teste são respostas da Geoapify para logradouros públicos, sem a chave.

## Verificado com dados reais (sem nomes de clientes)

- WebOper: 134 clientes ativos lidos.
- Geoapify: 127 localizados no RJ, 3 não localizados (endereços "S/N"), 4 fora do RJ (2 de fato, 2 por cadastro irregular) e 11 com confiança abaixo de 50%.
- Candidato na Tijuca: posto com 1 ônibus ficou dentro (Jaé), posto com 1 metrô dentro (Riocard), metrô + ônibus fora, postos em Niterói fora (intermunicipal) e posto com localização incerta foi para conferir.
- Candidato em Campo Grande: a Geoapify não encontrou nenhuma rota, nem até um posto a 2,5 km.

## Problemas encontrados e corrigidos

- Parte dos endereços do Rio volta com `state: "Sudeste"` e sem `state_code`: a UF passou a vir do CEP (RJ vai de 20000-000 a 28999-999).
- Geocodificação lenta (~3 s por endereço): cliente HTTP reaproveitado e 4 consultas em paralelo, respeitando o limite de 5 req/s.
- Posto com localização incerta aparecia como "dá para ir a pé". Agora vai para conferir, sem gastar rota.

## Comandos

```
backend:  ./.venv/Scripts/python.exe -m pytest -q      # 48 passed
frontend: npm test && npm run build                    # testes da equipe e build intactos
```

## Pendências e riscos

- **Cobertura da Geoapify na Zona Oeste:** Campo Grande não roteou nada.
- **Rota mais rápida, não a mais barata:** quem tem ônibus direto mas recebeu rota de metrô + ônibus pode sair "fora" por engano.
- **Limite do Jaé** (2 ou 3 conduções): hoje 2, em `VT_MAX_CONDUCOES_JAE`. A confirmar.
- **Cadastro do WebOper:** 18 postos precisam de conferência de endereço. A lista aparece na tela.
