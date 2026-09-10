# Produto

> **Fonte de verdade:** a especificação mestre consolidada em `docs/superpowers/specs/2026-09-08-alpha-rh-master-spec.md` prevalece quando houver conflito com documentos anteriores. Este arquivo permanece como resumo do produto.

> **Descoberta antes de novas implementações:** o fluxo será observado com o RH, prototipado e testado antes de virar backlog preparado. O protocolo está em `docs/discovery/2026-09-08-discovery-design-sprint-pbb.md` e o quadro colaborativo está no Miro.

<!-- impeccable:product-schema 1 -->

## Plataforma

web

## Stack

- Backend confirmado: Python com FastAPI.
- Frontend confirmado: React.
- Interface confirmada: responsiva, fluida e com CSS moderno.
- Escopo inicial confirmado para uso interno da Alpha Serviços. Cobrança, autosserviço, gestão de assinaturas e operação comercial multiempresa ficam fora do MVP.
- A arquitetura manterá uma identificação de organização nos dados e serviços para evitar acoplamento irreversível, mas não serão construídas agora telas ou operações completas de SaaS multiempresa.
- Banco próprio confirmado e implementado localmente em MySQL no banco `alpha_rh`. Armazenamento e processamento locais existem para o laboratório; hospedagem, armazenamento e fila de produção e observabilidade ainda precisam ser escolhidos.

## Usuários

- RH: cria vagas, recebe e importa currículos, revisa extrações, conduz a triagem e administra o processo seletivo.
- Diretoria: aprova vagas antes da publicação e possui acesso integral às funcionalidades e informações do sistema.
- Candidatos: futuramente poderão consultar vagas e enviar candidatura por formulário público.
- Administrador da plataforma: papel futuro para uma eventual comercialização; não faz parte do MVP interno.

## Objetivo do produto

Centralizar o processo de recrutamento por posto de trabalho, desde a criação e aprovação da vaga até contratação ou encerramento. O sistema deve reduzir o tempo gasto pelo RH na análise de mais de 1.000 currículos por mês, preservar os documentos efetivamente importados, extrair informações com IA, comparar evidências profissionais com requisitos objetivos e apresentar o deslocamento separadamente da qualificação.

O resultado esperado é permitir que o RH encontre rapidamente os candidatos que merecem análise humana, sem precisar abrir cada currículo apenas para descobrir localização, experiência ou cursos.

## Posicionamento

O produto combina vagas vinculadas a postos, pré-triagem de mobilidade por transporte público, ingestão de currículos de múltiplos canais, análise explicável por requisitos e avaliação detalhada de deslocamento. A IA poderá extrair a localização declarada, mas a entrada será calculada por rotas objetivas nos horários da vaga, e não por bairro, município, distância em linha reta ou julgamento livre do modelo.

## Contexto operacional

- A empresa chama os locais atendidos de “postos”.
- Os postos atuais são consultados no Weboper, em MySQL, a partir da tabela `CAD_CLIENTE`.
- Somente os registros ativos serão disponibilizados para novas vagas.
- O RH informou cinco canais atuais de currículos: Gmail usado pelo RioVagas, Quickin, conta gratuita do Indeed, WhatsApp e currículo físico.
- O sistema atual é o ATS Quickin, fornecido pela People Technology. Ele distribui vagas para Google for Jobs, LinkedIn, Netvagas e Indeed.
- O novo produto deverá substituir o Quickin, preservando as capacidades essenciais de um ATS e acrescentando os diferenciais próprios da operação por postos.
- A operação inicial terá no máximo duas pessoas do RH usando o sistema simultaneamente, além da diretoria.
- O processo confirmado começa com a criação da vaga pelo RH e aprovação obrigatória pela diretoria antes da publicação.
- O produto será desenvolvido, validado e operado primeiro para uso interno da Alpha Serviços. Uma eventual versão comercial será planejada somente depois da validação do fluxo interno.
- Cada vaga terá endereço do posto, escala e horários de entrada e saída para permitir a pré-triagem objetiva de transporte antes da criação da candidatura.

## Capacidades e restrições

### Confirmadas

- Cadastro e acompanhamento de vagas por posto.
- Aprovação da vaga pela diretoria antes da publicação.
- Importação manual e por canais externos conforme viabilidade técnica.
- Os formatos confirmados de currículo são PDF (`.pdf`), Word legado e atual (`.doc` e `.docx`) e arquivos de texto produzidos no Bloco de Notas (`.txt`). O importador também deverá aproveitar o texto do corpo da mensagem quando ele contiver o currículo.
- A validação usará tipo real do arquivo, assinatura binária e extensão, com limite de tamanho, verificação de conteúdo malicioso e rejeição segura de formatos executáveis ou incompatíveis. PDF com texto, Word e TXT usarão extração nativa; PDF digitalizado e imagens usarão OCR quando necessário.
- Arquivos TXT terão detecção de codificação para preservar acentos e conteúdo em português. Arquivo vazio, corrompido, protegido por senha ou com extração duvidosa irá para revisão do RH, sem inventar informações.
- Preservação do currículo e da mensagem ou origem recebida.
- Identificação de arquivos repetidos e possíveis candidatos duplicados, sem unir pessoas apenas pelo nome.
- Quando uma nova importação indicar que a pessoa já possui cadastro ou envio anterior, o cartão exibirá um aviso visível como “Possível cadastro existente” ou “Currículo reenviado”, com quantidade e data do último envio. Ao abrir o aviso, o RH poderá comparar contatos, currículos, datas, canais e vagas antes de decidir.
- Arquivos exatamente iguais serão identificados por hash e não passarão novamente pela extração, embora o novo evento de recebimento e sua origem permaneçam registrados. Currículos diferentes da mesma pessoa serão preservados como versões, sem sobrescrever o documento anterior.
- A vinculação ao cadastro existente exigirá sinais mais confiáveis — como e-mail, telefone e CPF quando legitimamente coletado — e confirmação humana nos casos duvidosos. Coincidência apenas de nome nunca causará união automática.
- Extração estruturada com evidência do trecho ou página quando disponível.
- Separação entre “não informado” e “não atende”.
- Revisão humana efetiva em todas as decisões de seleção.
- Processo completo no pipeline oficial: Candidatura, Triagem, Contato, Entrevista RH, Entrevista Gestor, Pesquisa, Entrega de documentos, Treinamento e Contratação, além dos estados de desclassificação e encerramento.
- Menu principal no topo, com navegação contextual por módulo e sem sidebar como navegação principal.
- Kanban como visualização principal do fluxo de candidatos por vaga, mantendo também visualizações em lista e mobilidade.
- Ao selecionar um candidato no Kanban ou na lista, abrir um modal 360 amplo com currículo, evidências profissionais, pendências, histórico e deslocamento até o posto.
- Cada cartão do candidato terá um indicador de currículo anexado e um atalho discreto para abrir o documento. O arquivo não será exibido inteiro dentro do cartão, preservando a leitura compacta do Kanban.
- No modal 360, o RH poderá visualizar o currículo em painel amplo, alternar entre versões recebidas e baixar o arquivo original. PDF será visualizado diretamente; DOC, DOCX e TXT terão uma prévia segura gerada no servidor, mantendo o original disponível para download.
- Se a geração da prévia falhar, o sistema mostrará o estado “Prévia indisponível” e permitirá baixar o original conforme a permissão do usuário. Visualizações e downloads de currículos serão registrados na auditoria.
- O modal 360 deve destacar ida, volta, duração, caminhada, conexões, compatibilidade com o turno, custo diário e mensal, fonte e data da rota para os candidatos admitidos pela regra de mobilidade.
- Consulta somente de leitura ao Weboper; os dados de recrutamento ficam no banco próprio do produto.
- Integração de rotas e custos de transporte somente depois da validação do fluxo principal.
- Perguntas de candidatura configuradas em cada vaga, com respostas reutilizadas na triagem e apresentadas ao RH com sua origem.
- Questionário complementar enviado ao candidato por link individual e seguro via e-mail e WhatsApp, com validade, registro de envio, resposta e lembretes controlados.
- Filtros operacionais por experiência, requisitos da vaga, respostas da candidatura, disponibilidade e compatibilidade objetiva entre horário/escala declarados e a vaga.
- Filtro de habilitação por categoria de CNH — A, B, AB, C, D ou E — com estados “comprovada”, “declarada”, “vencida”, “não possui” e “não informada”; exigência somente quando relacionada às atividades da vaga.
- Filtro de escolaridade por nível e conclusão — fundamental, médio, técnico, superior e pós-graduação — distinguindo completo, incompleto, em andamento, comprovado e não informado.
- A regra anterior de entrada por bairro, município, região ou proximidade foi cancelada. Uma pessoa poderá morar longe do posto e ainda entrar normalmente quando possuir uma rota simples e viável, como Pavuna–Leblon por metrô.
- Antes da importação definitiva, o sistema extrairá temporariamente a localização declarada e consultará rotas de transporte público para a ida e a volta nos horários reais da vaga. A rota será aceita quando houver no máximo duas conduções na ida e no máximo duas conduções na volta.
- “Condução” significa cada embarque em ônibus, metrô, trem, barca, BRT, van ou outro veículo de transporte público. Caminhada não conta como condução; trocar de linha ou veículo com novo embarque conta como outra condução. Exemplos: metrô direto = uma; ônibus + metrô = duas; ônibus + trem + ônibus = três.
- A verificação considerará ida e volta separadamente. Não basta existir uma rota simples durante o dia: ela precisa estar disponível e ser compatível com os horários de entrada e saída da vaga, inclusive em turnos noturnos, fins de semana e feriados quando aplicável.
- Quando nenhuma rota válida atender ao limite de duas conduções em algum dos trechos, o currículo não criará candidatura, cartão no Kanban nem entrada no Banco de Talentos. Se a pessoa já possuir cadastro por outro processo, o cadastro existente permanece, mas não será associado a essa vaga.
- O currículo recusado pela pré-triagem de mobilidade não será copiado para o armazenamento próprio do RH. A mensagem ou arquivo continuará intacto no canal de origem, sem mover, apagar ou responder automaticamente. O sistema manterá somente o registro técnico mínimo do processamento — identificador da origem, data, resultado, resumo da rota e versão da regra — para evitar reprocessamento e permitir auditoria, sem disponibilizar a pessoa no banco de candidatos.
- Localização ausente, ilegível, ambígua, sem geocodificação confiável ou rota indisponível por falha do fornecedor irá para uma fila temporária “Mobilidade pendente”, fora do Kanban, até conferência do RH. Falha técnica não será tratada como rota reprovada.
- Quando o currículo possuir foto, o sistema extrairá uma miniatura e a exibirá no cartão do candidato desde a coluna “Candidatura”; sem foto, exibirá as iniciais. A foto não será enviada à IA nem usada em filtros, pontuação ou análise de compatibilidade.
- Gerador de descrição de vaga por IA baseado exclusivamente nos campos estruturados preenchidos pelo RH. O RH selecionará os blocos desejados, o tom — formal, direto ou acolhedor —, o tamanho — curto, padrão ou detalhado — e a linguagem — simples ou corporativa.
- O catálogo inicial do gerador incluirá apresentação da empresa, título, objetivo, posto/endereço, quantidade, atividades, requisitos obrigatórios e desejáveis, experiência, escolaridade, cursos, CNH, informática, contratação, modelo de trabalho, escala, horário, salário, benefícios, disponibilidade, viagens, exigências físicas relacionadas à função, início, etapas, perguntas de candidatura, acessibilidade/inclusão e instruções para candidatura.
- Toda geração e edição da descrição criará uma versão na aba “Histórico”, com data, responsável, origem e possibilidade de comparação e restauração.
- Uma vaga existente poderá ser duplicada integralmente. A cópia terá novo código, começará como rascunho, indicará a vaga de origem, marcará os campos para revisão e passará novamente pela aprovação da diretoria.
- Nenhum candidato ou candidatura será apagado quando sair do fluxo principal. O cadastro da pessoa permanecerá no banco próprio da empresa e cada participação em uma vaga será armazenada como uma candidatura independente, com situação, etapa, datas, responsável e histórico.
- Ao desclassificar, o RH deverá informar um motivo profissional e relacionado à vaga. A candidatura sairá das colunas ativas e ficará acessível em “Desclassificados”, nos filtros e no histórico da vaga, com etapa de origem, motivo, observação, responsável e data. Usuários autorizados poderão reabrir a candidatura, mantendo a auditoria completa.
- Candidaturas classificadas continuarão avançando pelas etapas do Kanban. Ao final, o resultado será registrado como “Contratado”, “Finalista não contratado”, “Banco de talentos”, “Desistiu”, “Não compareceu” ou outro encerramento operacional configurado, sem apagar o currículo, as avaliações ou as decisões anteriores.
- A desclassificação em uma vaga não bloqueará automaticamente a pessoa em outras vagas. O candidato poderá continuar no banco de talentos ou participar de outros processos, respeitando finalidade, retenção, oposição e exclusão quando juridicamente aplicáveis.

### Em aberto

- Nome comercial, identidade visual e domínio do produto.
- Banco de dados próprio, hospedagem, orçamento e estratégia de cobrança.
- Formas de autenticação e segundo fator.
- Comercialização futura: painel de clientes, administrador da plataforma, planos, cobrança, onboarding, personalização por empresa, suporte e operação multiempresa completa.
- Cobertura completa da API e das exportações do Quickin para migração de vagas, candidatos, currículos, avaliações, comentários e histórico; a API pública já foi identificada, mas a disponibilidade de todos os dados ainda precisa ser verificada.
- API, webhook ou exportação disponível no Indeed e nos demais canais.
- Conta, pasta, volume e histórico do Gmail do RioVagas.
- Fluxo operacional de currículos do WhatsApp e documentos físicos.
- Integração oficial de envio por WhatsApp, incluindo provedor, templates aprovados, consentimento/opt-in, custos e limites.
- A empresa brasileira AGINCO foi identificada como fornecedora de pesquisas cadastrais para seleção e admissão e informa possuir sistema online, mas não foi localizada documentação pública de API; confirmar com o fornecedor se há API, exportação ou integração contratual disponível.
- Modelo da OpenAI, limites de custo e política de reprocessamento.
- Conta Google Cloud, faturamento, quotas, orçamento e validação da cobertura real de transporte público e tarifas nas regiões atendidas. O Google Maps Platform foi escolhido, mas nenhuma conta, chave ou API foi configurada ou testada.
- Critérios jurídicos de finalidade, base legal, retenção e atendimento aos direitos dos candidatos.
- Tempo máximo de viagem e caminhada máxima ainda precisam ser definidos com o RH. O limite confirmado neste momento é de duas conduções por trecho; duração, caminhada, intervalo entre conexões e margem de chegada continuarão visíveis para conferência.
- A empresa informou que atualmente consulta no Jusbrasil se candidatos ajuizaram ações contra antigos empregadores e solicitou usar essa informação para eliminação. O Jusbrasil possui API comercial de consulta processual por CPF/CNPJ, porém sua página comercial informa expressamente que não atende recrutamento baseado em processos cíveis ou trabalhistas e que não disponibiliza processos trabalhistas para operações de recrutamento e seleção. Esse uso não está liberado para implementação: pode configurar lista discriminatória, gerar responsabilidade trabalhista e contrariar os princípios de necessidade, não discriminação e qualidade dos dados da LGPD.

## Evidências disponíveis

- Relatório de alinhamento: `Relatorio_Alinhamento_Sistema_RH.docx` e `Relatorio_Alinhamento_Sistema_RH.pdf`.
- Estrutura do Weboper verificada: 300 registros em `CAD_CLIENTE`, sendo 134 ativos, 165 inativos e 1 sem situação.
- Campos necessários identificados: `CHAVE`, `RAZAO_SOCIAL`, `NOME_FANTASIA`, `SITUACAO`, `ENDERECO`, `BAIRRO`, `MUNICIPIO`, `UF` e `CEP`.
- Existe aplicação local com frontend React, backend FastAPI, MySQL próprio, laboratório de extração, persistência de candidatos/candidaturas e Kanban de nove etapas. Cadastro real de vagas, aprovação, integrações externas, autenticação e infraestrutura de produção ainda não foram implementados.
- Limitação confirmada do fornecedor: o Jusbrasil declara que processos trabalhistas não são disponibilizados para recrutamento e seleção e que esse uso pode ser discriminatório; portanto, sua API não é uma via disponível para o aviso solicitado no Kanban.
- Fornecedor de mapas confirmado: Google Maps Platform. A solução deverá combinar Maps JavaScript API para exibição, geocodificação/Places para endereços e Routes API com `TRANSIT` para ida, volta, horários, etapas, caminhadas, conexões e tarifa quando disponibilizada pelo provedor.
- O uso do Google Maps Platform não exigirá login Google do RH, candidato ou funcionário. O sistema terá autenticação própria; as chamadas de mapas serão autenticadas pelo projeto Google Cloud da empresa com credenciais técnicas restritas.
- Não existem depoimentos, clientes externos, preços ou métricas de eficiência validadas; não devem ser inventados.

## Princípios do produto

1. O trabalho diário do RH deve ser rápido, fluido e orientado por pendências e próximas ações.
2. Toda recomendação da IA deve ser explicável e revisável por uma pessoa.
3. A regra de mobilidade atua antes da criação da candidatura: é aceita a melhor rota viável com até duas conduções na ida e duas na volta, independentemente do bairro ou da distância. Para quem passa por essa entrada, qualificação profissional e detalhes do deslocamento continuam sendo dimensões separadas.
4. Dados e arquivos de cada empresa permanecem isolados, com acesso mínimo, auditoria e proteção desde o início.
5. Integrações entram por adaptadores independentes e convergem para uma única fila confiável de importação.
6. Nenhuma consulta judicial será usada para eliminação automática, pontuação ou exposição no cartão do candidato sem parecer jurídico formal que autorize finalidade, base legal, necessidade, proporcionalidade, transparência, contestação, retenção e perfis de acesso. Se houver uso juridicamente autorizado para funções específicas, os detalhes ficarão em área restrita de jurídico/compliance e sujeitos a conferência humana.
7. Idade e sexo não serão filtros comuns de recrutamento. Só poderão ser tratados em hipótese excepcional documentada — como exigência profissional genuína ou ação afirmativa juridicamente validada — com justificativa, acesso restrito e auditoria. Perguntas sobre situação familiar, filhos, moradia, aluguel, fumar e beber não alimentarão ranking ou eliminação sem validação jurídica específica.
8. Consultas ao Google Maps Platform usarão chaves separadas e restritas para navegador e servidor, quotas, alertas de custo e cache compatível com os termos do provedor. Ausência de tarifa completa será mostrada como “custo pendente de validação”, nunca como zero.

## Direção de interface confirmada

- Linguagem visual de sistema empresarial robusto, adequada a um produto grande e comercializável.
- Caixa Financeiro e Central de Limpeza são referências internas de acabamento, profundidade, superfícies e sensação de produto implementado; não devem ser copiados literalmente.
- A estrutura global seguirá navegação superior em dois níveis: módulos da plataforma e opções contextuais do módulo ativo.
- O Kanban deve usar cartões compactos, contadores por etapa, filtros, busca, SLA, ações em lote e carregamento progressivo para suportar grande volume.
- O modal do candidato deve ser uma superfície ampla de trabalho e não um pop-up pequeno. Ele poderá ter abas como Resumo, Evidências, Mobilidade, Entrevistas e Histórico.
- A direção aprovada para o modal é a opção “Mobilidade em destaque”: modal central grande sobre o Kanban, aba Mobilidade ativa, mapa amplo, ida e volta, compatibilidade com a escala, percurso, conexões, passagem diária e mensal, fonte, data e pendências de confirmação.
- A direção visual aprovada para o Kanban é a opção inspirada no Caixa Financeiro: topbar azul-marinho, superfícies claras elevadas, sombras macias, botões em cores sólidas e cartões compactos. Gradientes não serão necessários nos botões; a hierarquia será construída com cor, contraste e sombra discreta. Cada cartão terá barra vertical com a cor da etapa oficial: Candidatura, Triagem, Contato, Entrevista RH, Entrevista Gestor, Pesquisa, Entrega de documentos, Treinamento ou Contratação.
- Os cartões do Kanban exibirão foto em miniatura desde “Candidatura” quando ela existir no currículo; caso contrário, usarão iniciais, preservando a densidade e a leitura rápida do quadro.
- A experiência aprovada para filtros do Kanban é a opção “Faixa Inteligente”: busca, visualização salva e filtros favoritos permanecem em uma barra horizontal; filtros ativos aparecem como chips removíveis; “Mais filtros” abre os critérios adicionais e “Personalizar” define quais filtros ficam visíveis. Cada usuário do RH poderá manter favoritos pessoais e também utilizar visualizações compartilhadas com a equipe, com histórico de alterações.
- A referência visual aprovada dos filtros está em `.impeccable/mocks/approved/kanban-filtros-aprovado.png`.
- O aviso de mobilidade presente nessa referência visual deverá ser atualizado na implementação ou na próxima revisão do mockup: a entrada não será limitada por região; será aceita a rota com até duas conduções por trecho e compatível com os horários da vaga. Casos sem localização ou rota confiável ficam em “Mobilidade pendente”.

## Acessibilidade e inclusão

- A interface será responsiva e utilizável por teclado.
- Estados, textos e cores não poderão ser o único meio de comunicar informações importantes.
- Não serão usados como critério de triagem foto, raça, religião, situação familiar, inferências pelo nome ou idade genérica.
- O padrão formal de acessibilidade ainda precisa ser aprovado; a recomendação técnica será WCAG 2.2 nível AA.
