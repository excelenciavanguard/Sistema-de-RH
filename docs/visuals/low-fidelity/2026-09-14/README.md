# Alpha RH — baixa fidelidade: início do fluxo

Data: 14/09/2026.

Situação: propostas visuais para revisão; não são telas implementadas nem aprovação final do layout. Dados ilustrativos. Produzidas com a ferramenta nativa de geração de imagens, a partir dos mockups existentes. Originais preservados.

## Imagens

Mapa explicativo: [como navegar no Recrutamento](MAPA-NAVEGACAO.md).

Apresentação ordenada: [fluxo completo para validação](FLUXO-COMPLETO-PARA-VALIDACAO.md).

Sessão com a equipe: [roteiro do primeiro teste com o RH](ROTEIRO-PRIMEIRO-TESTE-RH.md).

Revisão de navegação: [retorno à lista e Lista de candidatos](NAVEGACAO-V2.md). As imagens v2 de criação e Kanban substituem visualmente as versões iniciais para essa revisão; os arquivos antigos ficam preservados.

1. `01-requisicao-operacoes.png`: Operações preenche a necessidade e envia para aprovação.
2. `02-aprovacao-diretoria.png`: Diretoria confere e aprova, solicita ajuste ou rejeita. Corrige o texto antigo que atribuía a solicitação ao RH.
3. `03-criacao-vaga-rh.png`: RH inicia a vaga a partir da requisição aprovada; imagem da aba Detalhes, não de todas as abas.

Fluxo confirmado: Operações solicita → Diretoria decide → após aprovação, RH cria a vaga. Aprovar não publica automaticamente.

## Validação com a equipe

- Operações consegue explicar o que preencher e para onde enviar?
- Diretoria encontra a justificativa e entende as três decisões?
- RH identifica os dados herdados e as próximas abas?
- Os campos obrigatórios, disposição e textos são propostas a conferir no teste.

Segundo lote produzido para revisão: [Descrição, Requisitos e Perguntas](LOTE-02.md).

Terceiro lote produzido para revisão: [Etapas e Revisão/Publicação](LOTE-03.md).

Quarto lote produzido para revisão: [Lista de vagas e Kanban](LOTE-04.md). Próximo lote proposto: modais do candidato.

Quinto lote produzido para revisão: [Modal do candidato — Resumo, Currículo e Mobilidade](LOTE-05.md).

Sexto lote produzido para revisão: [Respostas, Evidências, Histórico e Desclassificados](LOTE-06.md). O modal do candidato agora documenta as abas Resumo, Currículo, Evidências, Respostas, Mobilidade e Histórico.

Sétimo lote produzido para revisão: [Agenda, Entrevista, Banco de Talentos e Importação](LOTE-07.md). Entrevista e importação permanecem em modais ligados ao Kanban; Agenda e Banco de Talentos são telas globais.

Oitavo lote produzido para revisão: [Documentos, Treinamento e Contratação](LOTE-08.md). As três últimas etapas continuam como colunas do Kanban e usam o mesmo modal do candidato.

## Prompts utilizados

### req

Referência: `../../system-screen-pack/03-nova-requisicao-operacoes.png`

```text
Use case: ui-mockup. Create ONE standalone desktop web low-fidelity wireframe image, landscape 1536x1024, Portuguese Brazil. White background, black text, light-gray form surfaces, simple rectangular outlines, system sans font. Strictly grayscale, NO blue, NO gradient, NO photographs, NO decorative icons, NO shadows, NO polished UI. Legibility high, generous whitespace, straight simple lines (not messy handwriting). This is a planning prototype, not functional software. Small top strip 'Alpha RH' left and 'Protótipo de baixa fidelidade • Dados ilustrativos' right. Horizontal menu 'Início | Recrutamento | Talentos | Agenda | Admissão | Relatórios | Administração'. Second menu 'Requisições | Aprovações | Vagas'. Keep main content focused, no sidebar nav, do not cram additional screens into image. Reference is only existing business layout: simplify it radically to low fidelity. Image title '01 — Nova requisição' subtitle 'Operações informa a necessidade do posto'. Badge 'Rascunho'. Upper process strip with first step outlined bold: '1 Operações solicita → 2 Diretoria decide → 3 RH cria a vaga'. Main large form 2/3 width and compact explanatory right column 1/3. Main heading 'Necessidade da operação'. Two columns fields 'Posto ativo *' selected 'Leblon Power'; 'Função solicitada *' value 'Auxiliar de Serviços Gerais'; 'Quantidade *' value '5'; 'Motivo *' value 'Aumento de quadro'. Next section 'Jornada e prazo': 'Escala' 6×1, 'Entrada' 06:00, 'Saída' 14:20, 'Início desejado' placeholder dd/mm/aaaa. 'Prioridade' Normal. Large 'Justificativa *' text area with sample 'Reforço da equipe para atender à demanda do posto.' Outlined 'Adicionar anexo' button. Right column header 'Antes de enviar' and three plain lines 'Confira posto, função e quantidade.' 'A Diretoria analisará esta solicitação.' 'O envio não cria nem publica uma vaga.' Small note below Posto 'Somente postos ativos do Weboper. Consulta somente leitura.' Bottom actions 'Cancelar', 'Salvar rascunho', emphasized black button 'Enviar para aprovação'. Footer '* Campos obrigatórios'. All sample data illustrative.
```

### approve

Referência: `../../system-screen-pack/04-aprovacao-diretoria.png`

```text
Use case: ui-mockup. Create ONE standalone desktop web low-fidelity wireframe image, landscape 1536x1024, Portuguese Brazil. White background, black text, light-gray form surfaces, simple rectangular outlines, system sans font. Strictly grayscale, NO blue, NO gradient, NO photographs, NO decorative icons, NO shadows, NO polished UI. Legibility high, generous whitespace, straight simple lines (not messy handwriting). This is a planning prototype, not functional software. Small top strip 'Alpha RH' left and 'Protótipo de baixa fidelidade • Dados ilustrativos' right. Horizontal menu 'Início | Recrutamento | Talentos | Agenda | Admissão | Relatórios | Administração'. Second menu 'Requisições | Aprovações | Vagas'. Keep main content focused, no sidebar nav, do not cram additional screens into image. Reference existing approval layout, but IMPORTANT correct stale reference text: requester is Operações, NEVER RH. Title '02 — Aprovação da requisição' subtitle 'Diretoria analisa as solicitações de Operações'. Process strip highlights middle: '1 Operações solicita → 2 Diretoria decide → 3 RH cria a vaga'. Left 55 percent: tabs 'Pendentes (3)', 'Aprovadas', 'Devolvidas', 'Rejeitadas'; search field 'Buscar por posto ou função'. Simple table columns 'Requisição', 'Posto / Função', 'Quantidade', 'Situação'. Rows 'REQ-001 | Leblon Power / Auxiliar de Serviços Gerais | 5 | Pendente', 'REQ-002 | Posto exemplo / Porteiro | 2 | Pendente', 'REQ-003 | Sede / Auxiliar Administrativo | 1 | Pendente'. First row light gray selected. Right 45 percent inspector 'Requisição REQ-001', badge 'Aguardando aprovação'. Readonly details 'Solicitante: Operações', 'Posto: Leblon Power', 'Função: Auxiliar de Serviços Gerais', 'Quantidade: 5', 'Escala: 6×1', 'Horário: 06:00 às 14:20'. Then heading 'Justificativa de Operações' and sentence 'Reforço da equipe para atender à demanda do posto.' Link 'Ver anexos'. 'Parecer da Diretoria *' multiline empty input. Three action buttons, dark 'Aprovar', outlined 'Solicitar ajuste', outlined 'Rejeitar'. Below simple note 'A aprovação libera a criação da vaga pelo RH. Não publica automaticamente.' Bottom narrow 'Histórico da solicitação' with one example line 'Operações enviou a requisição para análise.' No candidate personal information.
```

### vacancy

Referência: `../../system-screen-pack/06-criar-editar-vaga.png`

```text
Use case: ui-mockup. Create ONE standalone desktop web low-fidelity wireframe image, landscape 1536x1024, Portuguese Brazil. White background, black text, light-gray form surfaces, simple rectangular outlines, system sans font. Strictly grayscale, NO blue, NO gradient, NO photographs, NO decorative icons, NO shadows, NO polished UI. Legibility high, generous whitespace, straight simple lines (not messy handwriting). This is a planning prototype, not functional software. Small top strip 'Alpha RH' left and 'Protótipo de baixa fidelidade • Dados ilustrativos' right. Horizontal menu 'Início | Recrutamento | Talentos | Agenda | Admissão | Relatórios | Administração'. Second menu 'Requisições | Aprovações | Vagas'. Keep main content focused, no sidebar nav, do not cram additional screens into image. Simplify referenced create vacancy screen to low fidelity. Title '03 — Criar vaga' subtitle 'RH prepara a vaga a partir da requisição aprovada'. Badge 'Rascunho'. Process strip highlights third '1 Operações solicita → 2 Diretoria aprova → 3 RH cria a vaga'. Slim readonly banner 'Requisição REQ-001 aprovada pela Diretoria • Solicitante: Operações'. Editor tabs 'Detalhes' selected, 'Descrição', 'Requisitos', 'Perguntas', 'Etapas', 'Revisão e publicação'. Main 2/3 width, slim explanatory aside 1/3 width. Main section 'Identificação': fields 'Título da vaga *' filled Auxiliar de Serviços Gerais, 'Posto' readonly Leblon Power, 'Quantidade' 5, 'Responsável do RH *' placeholder Selecionar. Section 'Condições de contratação': 'Contrato *' dropdown CLT, 'Modelo de trabalho' Presencial, 'Salário (R$)' placeholder Informar valor, 'Benefícios' placeholder Selecionar benefícios. Section 'Jornada': Escala 6×1, Entrada 06:00, Saída 14:20, 'Dias de trabalho' placeholder Definir dias da escala. Aside title 'Próximas etapas' list 'Descrição: escrever ou gerar com IA.' 'Requisitos: obrigatórios e desejáveis.' 'Perguntas: criar e marcar obrigatoriedade.' 'Etapas: conferir o processo seletivo.' 'Revisão: conferir antes de publicar.' Note 'Perguntas são configuradas dentro desta vaga.' No separate templates menu. Bottom 'Cancelar', 'Salvar rascunho', primary black 'Continuar para descrição'. Footer 'Salvar rascunho não publica a vaga.' This screenshot shows Details step only, no fake complete or published state.
```
