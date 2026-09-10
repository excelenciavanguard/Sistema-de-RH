# Fluxo 01 — Da requisição à vaga criada

Data: 10/09/2026.
Situação: detalhamento e backlog propostos para revisão com Operações, Diretoria e RH. Não implementado.
Objetivo: transformar o fluxo acordado em ações verificáveis para preparar o desenvolvimento.

## 1. Fontes e classificação

- **Confirmado:** decisões explícitas do usuário, consolidadas nas regras GOV-001/002/003 e VAC-002 da especificação mestre.
- **Observado no Miro:** post-its lidos no quadro [Alpha RH — Descoberta, Sprint e Backlog](https://miro.com/app/board/uXjVHpH_KfE=/). São insumos do time, não aprovação automática de todos os detalhes.
- **Proposto:** detalhamento elaborado neste documento, incluindo cenários de aceite e tratamentos de exceção. Precisa ser validado antes da implementação.
- **Pendente:** escolha operacional ainda não respondida. Não deve ser interpretada como requisito fechado.

Este documento complementa a especificação mestre; não substitui decisões confirmadas. O recorte termina na vaga criada em rascunho. Publicação, candidaturas, triagem e contratação serão detalhadas em fluxos posteriores.

## 2. Processo e responsáveis

**Confirmado: Operações cria a requisição → Diretoria aprova → RH cria a vaga.**

| Momento | Quem realiza | Entrada | Ação | Resultado esperado |
|---|---|---|---|---|
| Solicitação | Operações | Necessidade de pessoal em um posto | Preencher e enviar a requisição | Requisição aguardando decisão |
| Decisão | Diretoria | Requisição enviada | Aprovar, pedir correção ou rejeitar | Decisão registrada e próxima pessoa responsável definida |
| Correção, se solicitada | Operações | Motivo da devolução | Ajustar e reenviar | Nova análise pela Diretoria |
| Criação | RH | Requisição aprovada | Conferir condições e criar a vaga | Vaga em rascunho vinculada à requisição |

A autoridade dos três setores está confirmada. Os estados, a devolução, o registro de versões e a forma de encaminhamento abaixo detalham propostas para esse fluxo.

### Estados propostos da requisição

Rascunho → Aguardando aprovação → Aprovada → Convertida em vaga.

Alternativas na análise:

- Aguardando aprovação → Correção solicitada → Aguardando aprovação.
- Aguardando aprovação → Rejeitada.

"Rejeitada" refere-se à requisição de pessoal, não a um candidato. O estado da requisição e a etapa de uma candidatura no Kanban são informações distintas.

## 3. Tela — Requisição de vaga

Referências visuais existentes: `02-lista-requisicoes.png` e `03-nova-requisicao-operacoes.png`, em `docs/visuals/system-screen-pack/`.

**Quem usa:** Operações. **Objetivo:** explicar a necessidade e solicitar autorização para o recrutamento.

**Observado no Miro:** necessidade da operação, condições da vaga, justificativa, anexos, resumo, salvar rascunho e enviar para aprovação.

### Campos para a oficina

| Campo | Origem/situação | Obrigatoriedade proposta no envio |
|---|---|---|
| Código, solicitante e data de criação | Proposto: preenchidos pelo sistema | Automático |
| Posto | Confirmado: selecionar somente posto ativo de CAD_CLIENTE, com Weboper somente leitura | Sim |
| Endereço do posto | Confirmado na vaga; proposto também no resumo da requisição | Exibido a partir do cadastro, sem edição do Weboper |
| Função solicitada | Confirmado na vaga; proposto na requisição | Sim |
| Quantidade de pessoas | Confirmado na vaga; proposto na requisição | Sim, inteiro maior que zero |
| Motivo da necessidade | Proposto: aumento de quadro ou substituição | Sim; opções finais pendentes |
| Justificativa | Observado no Miro | Sim |
| Data desejada para início | Proposto | A validar |
| Escala, dias e horários | Confirmados na vaga; propostos para análise da requisição | A validar |
| Tipo de contratação, remuneração e benefícios | Confirmados na vaga; responsabilidade pelo preenchimento na requisição pendente | A validar |
| Anexos de apoio | Observado no Miro: PDF, DOC, DOCX e XLS | Opcionais; formatos e limites pendentes |

Não exigir identificação da pessoa substituída nesta proposta. Se essa informação se mostrar necessária, definir finalidade e acesso antes de acrescentá-la.

### Ações e regras propostas

- **Salvar rascunho:** permitir completar depois; indicar claramente que ainda não foi enviado à Diretoria.
- **Enviar para aprovação:** conferir campos obrigatórios e exibir o resumo antes do envio.
- **Corrigir:** disponibilizar o motivo da devolução, permitir ajustar e reenviar com histórico preservado.
- **Acompanhar:** mostrar código, posto, função, data, situação e próxima pessoa responsável.
- Enquanto aguarda decisão, não alterar silenciosamente o conteúdo submetido. Regra para retirada ou cancelamento ainda pendente.
- Se faltar dado obrigatório, manter o preenchimento e apontar o campo que precisa de correção.

## 4. Tela — Aprovação da requisição

Referência visual: `04-aprovacao-diretoria.png`.

**Quem usa:** Diretoria. **Objetivo:** decidir sobre a necessidade apresentada por Operações.

**Observado no Miro:** painel de requisições, detalhes, aprovar, solicitar ajustes, reprovar e filtros para aprovadas/reprovadas.

### Informações propostas

Código, solicitante, posto, função, quantidade, justificativa, condições informadas, anexos e histórico. Exibir separadamente informações ausentes, sem preencher valores presumidos.

### Ações e regras propostas

- **Aprovar:** registrar responsável, data e versão da requisição analisada; disponibilizar a requisição ao RH.
- **Solicitar correção:** exigir motivo claro e encaminhar a pendência a Operações.
- **Rejeitar:** exigir motivo e encerrar aquela solicitação sem criar vaga.
- O acesso integral da Diretoria está confirmado. Ele não transforma a aprovação em criação automática da vaga: a ação de criar continua com o RH.
- Se outra pessoa já tiver decidido ou a versão tiver mudado, apresentar a situação atual antes de permitir nova ação.
- Forma de aviso aos setores: proposta de pendência no painel. E-mail/WhatsApp automáticos não estão incluídos neste recorte.

## 5. Tela — Criar vaga a partir da requisição

Referências visuais: `06-criar-editar-vaga.png`, `06a-perguntas-da-vaga.png` e `06b-gerador-descricao-vaga.png`.

**Quem usa:** RH. **Objetivo:** transformar uma necessidade autorizada em uma vaga preparada para divulgação futura.

**Confirmado:** vínculo com posto ativo; função, atividades, quantidade, salário, benefícios, contrato, escala, horários e requisitos; perguntas criadas dentro da vaga, obrigatórias ou opcionais; geração assistida de descrição e histórico de versões.

### Ações e regras propostas

- Abrir a requisição aprovada e usar **Criar vaga**.
- Aproveitar os dados autorizados e manter o vínculo com a requisição e sua decisão.
- Conferir informações profissionais, requisitos e perguntas antes de salvar.
- Gerar descrição com IA opcionalmente, escolhendo conteúdo, tom e tamanho; permitir edição manual e salvar versão.
- A geração usa apenas dados informados. Se falhar, permitir continuar a descrição manualmente.
- Salvar como rascunho; criar a vaga não publica em sites externos.
- Ao salvar com sucesso, marcar a requisição como convertida e indicar a vaga correspondente.
- Proposta inicial: uma requisição gera uma vaga com quantidade de posições. A cardinalidade precisa de validação; não presumir várias vagas independentes para a mesma aprovação.
- Bloquear criação repetida por duplo clique ou tentativa simultânea. Quando houver vaga vinculada, oferecer **Abrir vaga**.
- Se o posto ficar inativo antes da criação, impedir nova vaga e encaminhar a divergência para conferência.
- Alterações em posto, função, quantidade, remuneração, contrato ou escala após aprovação precisam de regra específica. Proposta: retornar a Operações/Diretoria para nova análise, preservando a versão aprovada.

## 6. Backlog inicial e critérios de aceite propostos

As histórias abaixo são candidatas ao backlog. A sequência é uma proposta baseada no fluxo e nas dependências; não representa esforço estimado, prazo ou Sprint aprovada.

### REQ-01 — Preparar e salvar uma requisição

Como pessoa de Operações, quero registrar a necessidade do posto e salvar um rascunho para completar a solicitação antes de enviá-la.

- Dado um usuário autorizado de Operações, ao salvar um rascunho, o sistema registra o autor e permite retomá-lo com os mesmos dados.
- Dado um posto inativo, ele não aparece como opção para uma nova requisição.
- Salvar rascunho não inclui a requisição na fila de decisão.

Dependências: acesso por papel, cadastro de postos disponível e definição dos campos do rascunho.

### REQ-02 — Enviar e acompanhar a solicitação

Como pessoa de Operações, quero enviar a requisição completa para acompanhar a decisão da Diretoria.

- Com campos obrigatórios válidos, enviar muda a situação para Aguardando aprovação e registra data e versão.
- Com campo obrigatório ausente, enviar apresenta o erro sem perder o preenchimento.
- Após envio, a requisição aparece para Operações e na fila autorizada da Diretoria.
- Repetir o clique ou retomar após falha de conexão não cria duas solicitações.

Dependências: REQ-01 e decisão sobre campos obrigatórios e escopo de visibilidade.

### APR-01 — Analisar e decidir

Como integrante da Diretoria, quero consultar o pedido completo e registrar uma decisão para autorizar o recrutamento ou explicar o que precisa mudar.

- Uma aprovação registra quem decidiu, quando e sobre qual versão; a requisição fica disponível ao RH.
- Solicitar correção ou rejeitar sem motivo apresenta uma orientação para preenchê-lo.
- Rejeição não cria vaga; aprovação também não cria nem publica vaga automaticamente.
- Um usuário de Operações ou RH não consegue executar uma aprovação apenas por acessar seu endereço ou botão.
- Se a decisão já tiver sido registrada, nova tentativa informa o estado atual sem sobrescrever o histórico.

Dependências: REQ-02 e identificação dos usuários autorizados da Diretoria.

### REQ-03 — Corrigir e reenviar

Como pessoa de Operações, quero ver o motivo da devolução e ajustar o pedido para submetê-lo novamente.

- Correção solicitada mostra o motivo e devolve a ação a Operações.
- Reenviar registra uma nova versão e mantém a anterior e a justificativa no histórico.
- Enquanto aguarda correção, a requisição não autoriza criação de vaga pelo RH.

Dependências: APR-01. Reabertura de requisição rejeitada não está incluída sem decisão do time.

### VAG-01 — Criar vaga com base na aprovação

Como pessoa do RH, quero usar uma requisição aprovada para criar uma vaga com as condições autorizadas.

- Uma requisição aprovada permite criar vaga em rascunho com vínculo rastreável à aprovação.
- Uma requisição pendente, devolvida ou rejeitada não permite criar vaga.
- Um posto que passou a inativo gera pendência de conferência, sem criação de vaga.
- Sob a proposta de uma vaga por requisição, duas tentativas resultam em uma única vaga vinculada.
- A requisição só muda para Convertida em vaga quando o rascunho estiver efetivamente salvo.

Dependências: APR-01, definição da cardinalidade e tratamento das mudanças pós-aprovação.

### VAG-02 — Completar descrição e perguntas

Como pessoa do RH, quero preparar a descrição e as perguntas da vaga para coletar informações profissionais relevantes na candidatura futura.

- Cada pergunta mantém seu texto, tipo, opções aplicáveis, ordem e indicação de obrigatória/opcional.
- A prévia do formulário reflete a configuração salva; não existe biblioteca separada de Templates.
- A descrição pode ser escrita manualmente; a IA é opcional.
- Se a IA sugerir um conteúdo, o RH consegue conferir, editar e salvar uma versão. Nenhuma geração publica a vaga.
- Informações faltantes não são completadas pela IA como fatos.
- Ao concluir este recorte, a vaga continua em rascunho; a publicação é outro fluxo.

Dependências: VAG-01. Serviço de geração, versionamento e validação das extrações seguem as regras já documentadas, sem presumir que estejam prontos para este editor.

## 7. Pendências para a reunião

| ID | Decisão que falta | Proposta de partida | Quem valida |
|---|---|---|---|
| D01 | Quem preenche remuneração, benefícios e condições contratuais antes da aprovação? | Operações informa o que conhece; definir dados necessários para decisão | Operações + Diretoria + RH |
| D02 | Quais campos são obrigatórios para enviar? | Posto, função, quantidade, motivo e justificativa | Operações + Diretoria |
| D03 | Quem de Operações vê e corrige uma requisição? | Autor e responsáveis autorizados pelos postos | Operações + Diretoria |
| D04 | Basta uma pessoa da Diretoria aprovar? Há prazo ou substituto? | Uma decisão autorizada; prazo e substituição em aberto | Diretoria |
| D05 | Uma requisição pode gerar mais de uma vaga? | Uma vaga, com quantidade de posições | RH + Operações |
| D06 | Como tratar mudanças nas condições já aprovadas? | Nova análise para mudanças materiais; descrição editorial segue com RH | Diretoria + RH |
| D07 | Pode cancelar, retirar ou reabrir uma solicitação? | Não fechar esse comportamento sem validação | Operações + Diretoria |
| D08 | Quais anexos e limites são necessários? | Partir dos formatos anotados no Miro e restringir ao necessário | Operações + RH + equipe técnica |

## 8. Roteiro de validação do protótipo

Usar uma necessidade fictícia no posto Power para exercitar o fluxo, com participantes dos três setores.

1. Operações prepara uma requisição e tenta enviar faltando uma informação obrigatória.
2. Completa, envia e localiza a situação do pedido.
3. Diretoria lê o resumo e pede um ajuste com motivo.
4. Operações encontra o motivo, corrige e reenvia.
5. Diretoria aprova; RH encontra a requisição aprovada.
6. RH cria a vaga, prepara uma pergunta e salva o rascunho.
7. Conferir uma rejeição em outro pedido e uma tentativa repetida de criação.

Observar se cada pessoa identifica a próxima ação, entende os estados, encontra os dados e conclui sua tarefa. Registrar dificuldades, dúvidas e mudanças propostas, com responsável pela decisão. Gostar da imagem não equivale a concluir esse teste.

## 9. Quando este recorte estará preparado

- Responsáveis, campos obrigatórios e transições validados pelos três setores.
- Pendências que afetam as histórias escolhidas resolvidas; itens futuros podem continuar abertos.
- Protótipo exercitado com cenários reais de trabalho e dados fictícios.
- Critérios de aceite revisados por RH, Operações, Diretoria e equipe técnica.
- Dependências, permissões e tamanho das primeiras histórias discutidos com quem implementará.
- Priorização conjunta registrada; não detalhar antecipadamente todo o sistema.

Situação atual: documento preparado para a oficina. O fluxo principal está confirmado; não há registro de validação completa desses cenários nem autorização para começar a codificação.

## 10. Organização sugerida no Miro

Manter as imagens existentes e acrescentar abaixo delas os cartões deste documento:

| Coluna do quadro | Cartões |
|---|---|
| Requisição de Operações | REQ-01, REQ-02, REQ-03; campos; D01/D02/D03/D07/D08 |
| Aprovação da Diretoria | APR-01; estados; D04/D06 |
| Criação da vaga pelo RH | VAG-01, VAG-02; vínculo da aprovação; D05 |
| Validação do fluxo | Roteiro de teste; decisões da oficina; pendências com responsáveis |

Em cada cartão indicar: situação, usuário, ação, resultado esperado, critérios de aceite e dependências. A disposição é sugerida; este arquivo não significa que o quadro já foi editado.
