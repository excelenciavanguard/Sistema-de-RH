# Revisão visual — navegação explícita

Propostas visuais estáticas; nenhuma mudança no código ou em aplicações externas. Imagens editadas pela ferramenta nativa de geração de imagens, preservando os originais.

## Versões para revisão

- `03-criacao-vaga-rh-v2-navegacao.png`: botão Voltar para vagas e explicação do aviso ao sair sem salvar. Representa a aba Detalhes; aplicar o mesmo retorno ao cabeçalho das demais abas no futuro protótipo interativo. O aviso é comportamento proposto, não implementado.
- `10-kanban-vaga-v2-navegacao.png`: botão Voltar para vagas; Lista renomeada para Lista de candidatos. Mantém Editar vaga e Adicionar candidato.
- `09-lista-vagas.png`: preservada, pois já exibe Criar vaga e Abrir Kanban.

Conferência visual: retorno legível nos dois destinos, nome da aba sem ambiguidade, campos e contadores mantidos. Há texto explicativo repetido no Kanban (abaixo do título e no rodapé); simplificar na etapa de protótipo interativo sem mudar a navegação.

Navegação: lista → criar/editar; lista → Kanban; Kanban → editar; criar/editar e Kanban → lista. Modal do candidato fecha retornando ao mesmo Kanban. As demais abas do formulário não foram re-renderizadas nesta revisão.

## Prompts utilizados

### create

```text
Edit this existing low-fidelity Alpha RH vacancy creation screenshot with ONLY scoped navigation clarifications. Preserve 1536x1024 size, white gray black visual style, all fields, content, input values, sections, right panel, tab order and existing footer buttons. Do NOT redesign or introduce new screens. Add a very visible outlined navigation button '← Voltar para vagas' in the vacant upper-right area aligned with the '03 — Criar vaga' title; enough generous padding and black readable type. Keep Rascunho badge unchanged. Below this new button add a small short two-line helper: 'Retorna à lista de vagas.' 'Ao sair sem salvar, será exibido um aviso.' This helper describes planned behavior only. Keep existing 'Cancelar', 'Salvar rascunho' and 'Continuar para descrição' footer actions. Change top context menu label 'Vagas' to 'Vagas' unchanged; keep it selected. Do not display confirmation modal now, no fake success. Ensure all grayscale, including required asterisks which should now be BLACK not red. Keep top disclaimer 'Protótipo de baixa fidelidade • Dados ilustrativos'. Everything else must stay as close to reference as possible.
```

### kanban

```text
Edit provided Alpha RH grayscale Kanban screenshot ONLY to clarify navigation. Preserve original 1536x1024 frame, all candidate names, counts, statuses, grayscale card left stripes, five visible columns and remaining stage note, filter controls, horizontal scroll, overall style and positions except small shifts essential for label width. Replace tiny breadcrumb 'Vagas / VAG-001' at upper left by an outlined clearly visible button '← Voltar para vagas' then a small 'VAG-001' beside it. Keep vacancy title, subtitle, existing 'Editar vaga' and '+ Adicionar candidato' buttons exactly. In view tabs change ONLY 'Lista' into 'Lista de candidatos', with enough width and spacing before 'Mobilidade'. Keep 'Kanban' selected. Below main subtitle or in footer add one concise helper 'Kanban e Lista de candidatos mostram as pessoas desta vaga.' Prefer replacing bottom footer sentence with TWO lines: 'Kanban e Lista de candidatos mostram as pessoas desta vaga.' and 'Clique em um card para abrir o modal do candidato.' Do not put +Criar vaga within this kanban because that action belongs to lista de vagas; +Adicionar candidato remains. Keep top navigation Vagas selected and top disclaimer 'Protótipo de baixa fidelidade • Dados ilustrativos'. Do not create open modal, alter any counts, introduce routes or change sample data. Pure scoped edit of screenshot in low fidelity.
```
