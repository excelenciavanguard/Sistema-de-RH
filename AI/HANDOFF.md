# HANDOFF — Laboratório de mobilidade (Sistema-de-RH)

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
