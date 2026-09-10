# Alpha RH — descoberta, Design Sprint e construção do backlog

**Data:** 8 de setembro de 2026  
**Situação:** método proposto para validação com RH, diretoria e gerente de projetos  
**Escopo:** organizar o produto antes de iniciar uma nova fase de programação  
**Quadro de trabalho:** [Miro — Alpha RH: Descoberta, Sprint e Backlog](https://miro.com/app/board/uXjVHpH_KfE=/)

## 1. Objetivo

Aplicar, de forma combinada, as práticas de Design Thinking, Design Sprint e Product Backlog Building (PBB) ao Alpha RH. O resultado esperado não é uma lista extensa de telas: é um fluxo de recrutamento observado, prototipado, testado e convertido em um backlog pequeno o suficiente para o time desenvolver com segurança.

Esta etapa não autoriza implementação. A programação começa somente quando o primeiro recorte atender aos portões de validação e à definição de preparado deste documento.

## 2. Como os três métodos serão combinados

| Método | Pergunta que responde no Alpha RH | Saída principal |
|---|---|---|
| Design Thinking | Como o RH, a diretoria, os gestores e o DP realmente trabalham e onde estão as dores? | Evidências de campo, jornada atual, blueprint, insights e critérios norteadores |
| Design Sprint | Qual fluxo resolve a incerteza mais importante e funciona quando pessoas reais tentam usá-lo? | Protótipo realista, cinco testes e decisão de avançar, iterar ou abandonar |
| Product Backlog Building | O que precisa ser construído primeiro e como deixar o trabalho claro para o time? | Personas, funcionalidades, PBIs ordenados e histórias preparadas para 2 a 5 Sprints |

Ordem adotada:

`Imersão → síntese → desafio focal → Design Sprint → fluxo validado → PBB → backlog preparado → desenvolvimento`

O processo não é rígido. Se o teste revelar uma premissa errada, o trabalho retorna à imersão ou à ideação antes de gerar mais backlog.

## 3. O que já está confirmado

As decisões abaixo vêm da especificação mestre e não precisam ser rediscutidas na oficina, salvo quando surgir evidência operacional ou jurídica nova:

- o produto será usado primeiro internamente pela Alpha Serviços;
- o RH cria a requisição e conduz o processo;
- a diretoria aprova a vaga antes da publicação e possui acesso integral;
- postos ativos são lidos de `CAD_CLIENTE` no Weboper, sem gravação nesse banco;
- dados de recrutamento ficam em banco próprio;
- os canais atuais são Gmail/Rio Vagas, Quickin/People, Indeed gratuito, WhatsApp e currículo físico;
- os currículos podem chegar em PDF, DOC, DOCX, TXT e imagem;
- a IA extrai e compara informações, mas o RH revisa e decide;
- evidência, origem, versão do currículo e histórico devem ser preservados;
- candidato é a pessoa; candidatura é sua participação em uma vaga;
- o pipeline oficial contém Candidatura, Triagem, Contato, Entrevista RH, Entrevista Gestor, Pesquisa, Entrega de documentos, Treinamento e Contratação;
- qualificação e mobilidade são dimensões separadas;
- a regra atual de mobilidade aceita a melhor rota com no máximo duas conduções na ida e duas na volta, nos horários da vaga;
- decisões, acessos e mudanças relevantes serão auditados;
- foto não será usada por IA, filtro, pontuação ou recomendação;
- seleção e desclassificação continuam sob responsabilidade humana.

## 4. Hipóteses e propostas que ainda exigem validação

Os itens abaixo foram colocados no Miro como amarelos. Eles não são requisitos fechados:

- desafio focal e trecho exato do fluxo a ser testado no primeiro Design Sprint;
- composição final da equipe e disponibilidade de cinco dias;
- quantidade de observações, entrevistas e casos analisados;
- personas comportamentais identificadas no campo;
- fluxo atual detalhado, tempos, retrabalhos e transferências entre pessoas;
- fluxo futuro e posição exata de cada automação;
- fórmulas e pesos para priorizar o backlog;
- limite de tempo e caminhada para mobilidade;
- integração possível em cada canal e dados recuperáveis da Quickin;
- política de acesso, retenção, descarte, transparência e atendimento LGPD;
- primeiro recorte de funcionalidades para desenvolvimento.

## 5. Fluxo de descoberta proposto

### Etapa 0 — Preparação e reenquadramento

**Proposta de duração:** 90 minutos.

Participantes: diretoria como decisor, RH, gerente de projetos, gestor solicitante, DP/TI e jurídico ou DPO quando disponível.

Atividades no Miro:

1. revisar objetivo, limites e decisões já confirmadas;
2. separar fatos, hipóteses, riscos e ideias;
3. definir o que significará sucesso para o primeiro piloto;
4. selecionar o processo e os usuários a observar;
5. nomear responsável por decisões, facilitação e registro das evidências.

Saídas:

- declaração do problema sem antecipar solução;
- perguntas de pesquisa;
- plano de campo;
- lista de participantes;
- regras para anonimização dos materiais.

**Gate A:** diretoria e RH concordam sobre o problema, o escopo e o que precisa ser aprendido.

### Etapa 1 — Imersão no trabalho real do RH

**Proposta inicial:** observar duas vagas reais com perfis diferentes, sem copiar dados pessoais para o Miro.

Pesquisa sugerida:

- acompanhar o RH desde o recebimento da demanda até uma decisão de candidatura;
- entrevistar dois recrutadores, um diretor, um gestor solicitante e uma pessoa de DP ou TI;
- ouvir candidatos apenas quando houver autorização e roteiro adequado;
- analisar dez casos anonimizados: currículo normal, reenviado, possível duplicado, candidato em mais de uma vaga, arquivo ilegível, ausência de localização, rota pendente, resposta incompatível, desclassificação e contratação;
- inventariar planilhas, Quickin, e-mails, mensagens, documentos físicos e controles paralelos;
- medir tempo de atividade, espera, retrabalho, erros, perda de contexto e decisões fora do sistema.

Roteiro-base para observação:

1. O que iniciou esta atividade?
2. O que a pessoa precisa consultar antes de agir?
3. O que ela copia, compara ou calcula manualmente?
4. Onde interrompe o trabalho para buscar informação?
5. Qual decisão está tomando e em que evidência se apoia?
6. O que acontece quando o dado está ausente ou contraditório?
7. Para quem o trabalho é transferido e como essa pessoa fica sabendo?
8. O que precisa ser auditado depois?

Roteiro-base para entrevista:

- Conte a última vez em que uma vaga atrasou. O que aconteceu?
- Mostre como você trata os primeiros currículos de uma vaga.
- Como percebe que uma pessoa já enviou currículo antes?
- O que faz você abrir o currículo completo?
- Como confirma experiência, disponibilidade, escala e documentação?
- Em que momento avalia a condução até o posto?
- Quais informações a diretoria e o gestor precisam ver para decidir?
- O que mais gera trabalho repetido ou risco de erro?
- Em quais casos você não confia no sistema atual?
- O que seria uma melhoria mensurável no primeiro piloto?

### Etapa 2 — Análise e síntese

Cada achado relevante vira um cartão de insight contendo:

- título curto;
- evidência observada ou relato resumido;
- fonte, papel do participante e data;
- etapa da jornada;
- impacto;
- grau de confiança;
- dúvida ou oportunidade relacionada.

No Miro, os cartões serão agrupados por afinidade. O grupo produzirá:

- jornada atual `AS-IS`;
- mapa de atores e responsabilidades;
- blueprint com ações visíveis e processos internos;
- personas comportamentais baseadas em padrões, não estereótipos demográficos;
- critérios norteadores;
- perguntas “Como poderíamos...?”;
- matriz de risco e incerteza.

Critérios norteadores iniciais, sujeitos a confirmação no campo:

1. reduzir o número de currículos que precisam ser abertos apenas para localizar informação básica;
2. mostrar fonte, confiança e pendência de cada dado extraído;
3. nunca transformar ausência de informação em reprovação;
4. manter o RH no controle de decisões e comunicações;
5. preservar histórico, original e contexto da vaga;
6. evitar duplicidades sem unir pessoas somente pelo nome;
7. tornar a próxima ação e o responsável evidentes;
8. proteger dados pessoais e limitar sua exposição;
9. não escrever no Weboper;
10. tolerar falhas de fornecedor sem ocultar candidaturas ou inventar resultados.

**Gate B:** RH e diretoria aprovam a jornada atual, os principais problemas e os critérios norteadores.

## 6. Design Sprint aplicado ao Alpha RH

### Desafio focal recomendado

> Como permitir que o RH receba uma candidatura, confira a extração, entenda evidências e mobilidade e registre a próxima decisão sem depender de controles paralelos?

O alvo exato será escolhido na segunda-feira do Sprint. A recomendação é testar um recorte completo:

`requisição aprovada → vaga e perguntas → importação → revisão da extração → candidatura no Kanban → modal 360 → decisão registrada`

### Equipe sugerida

Limite de sete participantes permanentes:

- diretoria: decisor;
- RH: especialista no processo e usuário principal;
- gestor solicitante: consumidor da seleção;
- DP: continuidade até admissão;
- TI/produto: viabilidade e integrações;
- design/UX: protótipo e experiência;
- gerente de projetos: facilitador imparcial.

Jurídico/DPO e especialistas em Weboper, Quickin, comunicação ou mobilidade participam das entrevistas da segunda-feira conforme o assunto. Facilitador e decisor não devem ser a mesma pessoa.

### Agenda

**Segunda — entender e escolher**

- definir objetivo de longo prazo;
- converter riscos em perguntas do Sprint;
- desenhar mapa simples de 5 a 15 passos;
- entrevistar especialistas;
- criar e agrupar notas “Como poderíamos...?”;
- escolher ator e momento-alvo.

**Terça — gerar alternativas concretas**

- fazer demonstrações rápidas de referências, inclusive Quickin e processos internos;
- cada participante trabalha individualmente em anotações, ideias, Crazy 8s e esboço da solução;
- produzir soluções autoexplicativas, não apenas opiniões abstratas.

**Quarta — decidir sem perder divergências úteis**

- galeria dos esboços;
- mapa de calor silencioso;
- crítica estruturada;
- voto de intenção;
- supervoto do decisor;
- escolher solução única ou alternativas concorrentes;
- criar storyboard de 5 a 15 passos.

**Quinta — prototipar**

- construir somente o necessário para provocar reações reais;
- usar conteúdo fictício ou anonimizado;
- incluir estados de sucesso, dado ausente, duplicidade, falha de IA e mobilidade pendente;
- preparar tarefas e roteiro de entrevista.

**Sexta — testar e aprender**

- realizar cinco sessões individuais com recrutadores e gestores representativos;
- pedir que executem tarefas e pensem em voz alta;
- registrar comportamento, dificuldade, interpretação e confiança;
- classificar padrões positivos, negativos e neutros;
- responder às perguntas do Sprint;
- decidir: avançar, corrigir e retestar, ou abandonar a hipótese.

### Tarefas mínimas do teste

1. localizar a vaga e compreender sua situação de aprovação;
2. revisar um currículo extraído sem confundir “não informado” com “não atende”;
3. reconhecer possível duplicidade ou reenvio;
4. conferir evidência e currículo original;
5. verificar ida e volta e entender uma mobilidade pendente;
6. mover a candidatura e identificar a próxima ação;
7. desclassificar com motivo profissional e localizar o histórico;
8. reencontrar a pessoa no banco de talentos ou em outra candidatura.

### Métricas do protótipo

Ainda não são metas aprovadas. Devem ser definidas na preparação:

- conclusão das tarefas sem ajuda;
- tempo e quantidade de cliques apenas como sinais, não como objetivo isolado;
- erros críticos e interpretações incorretas;
- confiança na evidência e na origem do dado;
- pontos em que o usuário procura controle paralelo;
- clareza de responsável, estado e próxima ação;
- percepção de segurança e reversibilidade.

**Gate C:** os testes produziram padrões claros e responderam às perguntas do Sprint.  
**Gate D:** as decisões do teste foram incorporadas ao fluxo futuro e ao protótipo revisado.

## 7. Fluxo futuro inicial a validar

1. RH cria uma requisição.
2. Diretoria aprova, rejeita ou pede correção.
3. Aprovada, a requisição origina vaga em rascunho.
4. RH confirma posto ativo, requisitos, contrato, escala, horários e perguntas.
5. RH publica ou abre a entrada controlada de currículos.
6. Sistema valida arquivo, origem, hash e possíveis duplicidades.
7. IA extrai informações com evidência, página e pendências.
8. RH revisa e escolhe o resultado que poderá gerar a candidatura.
9. Candidatura entra no Kanban e recebe próxima ação e responsável.
10. RH envia questionário ou faz contato.
11. RH e gestor avaliam em etapas e scorecards distintos.
12. Pesquisa autorizada, documentos, treinamento e admissão dão continuidade.
13. A candidatura termina como contratada, desclassificada, desistente, ausente, finalista não contratada ou banco de talentos.
14. Todo o histórico permanece auditável conforme acesso e retenção.

Trilhas transversais: permissões, LGPD, auditoria, comunicação, erros/reprocessamento, custos de API e observabilidade.

## 8. PBB depois do fluxo validado

### Canvas

O workshop PBB será executado no Miro com a seguinte ordem:

1. nome do produto;
2. problemas atuais;
3. expectativas;
4. personas, o que fazem e o que esperam;
5. funcionalidades ligadas a cada persona;
6. problema resolvido e benefício de cada funcionalidade;
7. PBIs que completam a funcionalidade;
8. Steps Map com perguntas, comentários e ideias;
9. classificação, ordenação e organização pelo COORG.

Funcionalidades candidatas, ainda sujeitas ao resultado do Sprint:

- governar requisição e aprovação;
- configurar vaga e perguntas;
- receber e validar currículo;
- revisar extração e evidências;
- manter perfil único e candidaturas independentes;
- conduzir pipeline e próximas ações;
- entrevistar e avaliar;
- comunicar e coletar respostas;
- avaliar mobilidade;
- encerrar, desclassificar e reaproveitar;
- auditar e administrar acessos;
- operar e recuperar integrações.

O Steps Map não deve ser confundido com a jornada. A jornada descreve como a pessoa alcança um objetivo; o Steps Map quebra uma funcionalidade em trabalho construível.

### Priorização COORG proposta

Antes de pontuar, a oficina deverá aprovar critérios, escalas e pesos. Sugestão inicial:

| Critério | Pergunta | Situação |
|---|---|---|
| Frequência | Quantas vezes o RH executa ou encontra este passo? | Proposto |
| Valor operacional | Quanto reduz tempo, erro ou retrabalho? | Proposto |
| Risco e proteção de dados | Quanto é necessário para operar de forma segura e lícita? | Proposto |
| Aprendizado | Quanto reduz uma incerteza crítica? | Proposto |
| Dependência | O que precisa existir antes de outro item gerar valor? | Proposto |
| Esforço | Qual é o tamanho relativo para entregar e verificar? | Proposto |

A fórmula não será definida antes da oficina. Segurança obrigatória não deve perder prioridade apenas por baixa frequência de uso.

### Horizonte do backlog

O PBB detalhará somente trabalho suficiente para as próximas 2 a 5 Sprints. O restante ficará em nível de funcionalidade ou tema e será refinado conforme o RH testar incrementos reais.

## 9. Definição de preparado e definição de pronto

### Definition of Ready — item pode entrar na Sprint quando

- persona e valor estão claros;
- regra principal, exceções e estados de erro foram descritos;
- critérios de aceite usam exemplos verificáveis, preferencialmente `Dado / Quando / Então`;
- interface ou fluxo foi associado quando necessário;
- dados, permissões e auditoria foram definidos;
- dependências e integrações estão identificadas;
- riscos de privacidade e segurança foram avaliados;
- teste planejado e dados de teste são seguros;
- o item é pequeno o suficiente para uma Sprint;
- RH, produto e desenvolvimento compartilham o mesmo entendimento.

### Definition of Done — item pode ser considerado concluído quando

- entrega um incremento ponta a ponta, não apenas uma tela isolada;
- atende aos critérios de aceite e testes proporcionais ao risco;
- possui estados de carregamento, vazio, erro e permissão quando aplicáveis;
- persiste e audita corretamente;
- não grava no Weboper;
- não expõe chaves ou dados pessoais em logs;
- documentação foi atualizada;
- RH verificou o fluxo com dados seguros;
- nenhuma demonstração fictícia é apresentada como integração real;
- limitações conhecidas foram registradas.

## 10. Portões antes de programar

| Gate | Evidência necessária | Aprovador |
|---|---|---|
| A — Enquadramento | problema, escopo, sucesso e pesquisa definidos | RH + diretoria |
| B — Imersão | jornada atual, insights e critérios norteadores | RH + diretoria |
| C — Teste | cinco testes, padrões e respostas do Sprint | decisor do Sprint |
| D — Fluxo | protótipo e `TO-BE` atualizados com os aprendizados | RH + produto |
| E — Backlog | PBB priorizado para 2 a 5 Sprints e itens Ready | produto + desenvolvimento |
| F — Operação segura | acesso, retenção, dados de teste, integrações e riscos definidos para o recorte | TI + responsável jurídico |

Somente após os seis gates o time escolhe a primeira história para desenvolvimento.

## 11. Regras para o quadro do Miro

- não inserir currículo, nome, telefone, e-mail, endereço ou informação de candidato real;
- usar casos fictícios ou anonimizados;
- um cartão contém um achado ou uma ideia, nunca ambos;
- toda evidência registra fonte e data;
- verde significa confirmado; amarelo, hipótese ou pendência; azul, atividade; vermelho, risco ou bloqueio;
- decisões registram data, responsável, evidência e impacto;
- ideias fora do desafio vão para o estacionamento;
- após cada oficina, decisões aprovadas são copiadas para a especificação mestre.

## 12. Próxima ação recomendada

Realizar a preparação e o reenquadramento no Miro com RH, diretoria e gerente de projetos. A primeira sessão deve terminar com:

- desafio focal confirmado;
- participantes e papéis;
- duas vagas que serão observadas;
- datas das observações e entrevistas;
- responsável pela anonimização;
- critério de sucesso do primeiro piloto;
- data possível para o Design Sprint.

Depois dessa sessão, a documentação deve ser atualizada antes de desenhar novas telas ou criar histórias técnicas.

## 13. Fontes estudadas

- Jake Knapp, John Zeratsky e Braden Kowitz — *Sprint: o método usado no Google para testar e aplicar novas ideias em apenas cinco dias*.
- Fábio Aguiar e Paulo Caroli — *Product Backlog Building: um guia prático para criação e refinamento de backlog para produtos de sucesso*.
- Maurício Vianna et al. — *Design Thinking: inovação em negócios*.

