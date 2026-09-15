# Lote 5 — Modal do candidato

Propostas estáticas de baixa fidelidade; não representam funcionalidades prontas. Geradas pela ferramenta nativa de imagens, com o Kanban v2 como referência. Nomes e conteúdo são ilustrativos.

## Imagens

- `11-modal-candidato-resumo.png`: visão rápida da candidatura, estados da extração, requisitos, pendências e próximas ações.
- `12-modal-candidato-curriculo.png`: prévia segura, versão recebida, abertura e download do original, além do aviso de auditoria.
- `13-modal-candidato-mobilidade.png`: estrutura de ida, volta, percurso, escala, conduções e custos. Todos os resultados ficam pendentes porque a API de mapas ainda não foi configurada ou testada.

O modal abre sobre o Kanban e, ao fechar, retorna ao mesmo quadro. O lote 6 acrescentou a aba `Respostas` e desenhou Evidências e Histórico; a ordem atual está registrada no `LOTE-06.md`.

## Conferência

- O currículo inteiro não aparece no card; a prévia fica no modal.
- “Não informado” permanece diferente de “não atende”.
- Mobilidade é separada da qualificação profissional.
- Não foram inventados rotas, linhas, tarifas ou resultados de API.
- O botão de consultar rota aparece indisponível enquanto a integração não existir.
- As ações do rodapé são propostas e não foram executadas.

## Prompts utilizados

### Resumo

```text
Use case: ui-mockup.
Create ONE standalone 1536x1024 desktop low-fidelity wireframe of Alpha RH.
Input image role: the attached image is the existing Kanban visual reference and must remain visibly recognizable BEHIND the modal.
Style: white, black and light gray only; flat rectangles, simple dividers, system sans typography. NO blue, gradients, shadows, photos, decorative art, real map tiles, real people, real personal contact data.
Composition: dim the recognizable Kanban background with a translucent gray overlay. On top, place a LARGE work modal occupying about 92% width and 88% height, centered, not a small popup. Keep enough background visible at all four edges to prove the user remains on the same Kanban.
Modal header: generic initials avatar "AS"; candidate name "Ana Souza"; status badge "Triagem"; subtitle "Auxiliar de Serviços Gerais • Leblon Power"; right buttons "Abrir currículo", "•••", and "X".
Modal tab row in this exact order: "Resumo | Currículo | Evidências | Mobilidade | Histórico".
All data is explicitly synthetic. Put "Protótipo de baixa fidelidade • Dados ilustrativos" in a small modal header note.
Footer fixed inside modal: left outlined button "Fechar e voltar ao Kanban"; right buttons "Desclassificar", "Salvar observação", and black primary "Mover para próxima etapa".
Do not display age, sex, photo, family, judicial data, personality score, or automatic hiring/rejection.

Active tab: "Resumo".
Main body uses two columns, 62% left and 38% right, with one vertical divider.
Left top heading "Resumo profissional" with helper "Dados extraídos para revisão do RH." Below a simple definition list:
"Objetivo: Auxiliar de Serviços Gerais"
"Experiência identificada: limpeza e conservação"
"Escolaridade: ensino médio completo"
"Disponibilidade: não informada"
Each row must have a small state at right: first two "Extraído", escolaridade "A confirmar", disponibilidade "Pendente".
Below, heading "Requisitos da vaga" and exactly three plain rows:
"Experiência em limpeza profissional — Evidência encontrada — Ver trecho"
"Disponibilidade para a escala — Não informado — Confirmar com candidato"
"Curso de técnicas de limpeza — Não informado — Requisito desejável"
Include a clear note "Não informado não significa que não atende."
Right column heading "Informações desta candidatura". Show:
"Origem: Gmail"
"Recebida: hoje"
"Currículo: 1 arquivo"
"Versão: 1"
"Última etapa: Candidatura → Triagem"
Then a gray warning row "Mobilidade pendente — endereço precisa ser confirmado."
Then heading "Próximas ações" with two checkboxes:
"Confirmar disponibilidade"
"Revisar evidências da extração"
At bottom of body show a short text field "Observação interna" placeholder "Registrar informação relevante para esta vaga".
No CV document preview and no map on this active tab.

```

### Currículo

```text
Use case: ui-mockup.
Create ONE standalone 1536x1024 desktop low-fidelity wireframe of Alpha RH.
Input image role: the attached image is the existing Kanban visual reference and must remain visibly recognizable BEHIND the modal.
Style: white, black and light gray only; flat rectangles, simple dividers, system sans typography. NO blue, gradients, shadows, photos, decorative art, real map tiles, real people, real personal contact data.
Composition: dim the recognizable Kanban background with a translucent gray overlay. On top, place a LARGE work modal occupying about 92% width and 88% height, centered, not a small popup. Keep enough background visible at all four edges to prove the user remains on the same Kanban.
Modal header: generic initials avatar "AS"; candidate name "Ana Souza"; status badge "Triagem"; subtitle "Auxiliar de Serviços Gerais • Leblon Power"; right buttons "Abrir currículo", "•••", and "X".
Modal tab row in this exact order: "Resumo | Currículo | Evidências | Mobilidade | Histórico".
All data is explicitly synthetic. Put "Protótipo de baixa fidelidade • Dados ilustrativos" in a small modal header note.
Footer fixed inside modal: left outlined button "Fechar e voltar ao Kanban"; right buttons "Desclassificar", "Salvar observação", and black primary "Mover para próxima etapa".
Do not display age, sex, photo, family, judicial data, personality score, or automatic hiring/rejection.

Use the attached modal summary image as exact structural reference. Preserve the modal size, header, background Kanban, footer actions and all tab names. Change only the active tab content.
Active tab: "Currículo".
Main body uses 68% left secure document preview and 32% right file/version panel separated by one vertical divider.
Left heading "Visualização do currículo". Directly under it a narrow gray file bar:
"curriculo-ana-souza.pdf" and right labels "PDF • 1 página • Recebido hoje".
Below, create a large white document-sheet preview inside a light-gray viewer. The synthetic document sheet shows only:
"ANA SOUZA"
"OBJETIVO"
"Auxiliar de Serviços Gerais"
"EXPERIÊNCIA"
"Atuação em limpeza e conservação de ambientes."
"ESCOLARIDADE"
"Ensino médio completo."
Footer on preview sheet "Conteúdo ilustrativo — não representa pessoa real."
At top of viewer provide small controls "Página 1 de 1", "−", "100%", "+".
Do not display address, phone, e-mail, age, photo, CPF or any real data.
Right column heading "Arquivo e versões". Show a selected row:
"Versão 1"
"Recebida hoje • Origem: Gmail"
"Arquivo original preservado"
Two outlined buttons: "Abrir original" and "Baixar original".
Below heading "Outras versões" and empty state "Nenhuma versão anterior."
Below heading "Segurança e auditoria" with plain text:
"Visualizações e downloads ficam registrados."
"Arquivos DOC, DOCX e TXT usam prévia segura."
Then a gray informational box:
"Se a prévia falhar, será exibido 'Prévia indisponível' e o original continuará disponível conforme a permissão."
No resume analysis, no requirement evidence list, and no map inside this active tab.

```

### Mobilidade

```text
Use case: ui-mockup.
Create ONE standalone 1536x1024 desktop low-fidelity wireframe of Alpha RH.
Input image role: the attached image is the existing Kanban visual reference and must remain visibly recognizable BEHIND the modal.
Style: white, black and light gray only; flat rectangles, simple dividers, system sans typography. NO blue, gradients, shadows, photos, decorative art, real map tiles, real people, real personal contact data.
Composition: dim the recognizable Kanban background with a translucent gray overlay. On top, place a LARGE work modal occupying about 92% width and 88% height, centered, not a small popup. Keep enough background visible at all four edges to prove the user remains on the same Kanban.
Modal header: generic initials avatar "AS"; candidate name "Ana Souza"; status badge "Triagem"; subtitle "Auxiliar de Serviços Gerais • Leblon Power"; right buttons "Abrir currículo", "•••", and "X".
Modal tab row in this exact order: "Resumo | Currículo | Evidências | Mobilidade | Histórico".
All data is explicitly synthetic. Put "Protótipo de baixa fidelidade • Dados ilustrativos" in a small modal header note.
Footer fixed inside modal: left outlined button "Fechar e voltar ao Kanban"; right buttons "Desclassificar", "Salvar observação", and black primary "Mover para próxima etapa".
Do not display age, sex, photo, family, judicial data, personality score, or automatic hiring/rejection.

Use the attached modal image as exact structural reference. Preserve the modal size, header, recognizable dimmed Kanban background, tab order and fixed footer. Change only active content.
Active tab: "Mobilidade".
This is the product differentiator, so give the central route area visual priority, but remain low fidelity and honest because no Google Maps API is configured.
Main body: 66% left and 34% right separated by one vertical divider.
Left heading "Mobilidade até o posto". Under it a status strip:
"Origem: endereço declarado — precisa confirmar"
"Destino: Leblon Power — endereço sincronizado"
Below make a large rectangular PLACEHOLDER map area with faint street-like grid lines only, no real geography, no coastline, no Google logo, no map provider tiles, no invented route. Center text:
"Mapa da rota"
"Disponível após configurar e consultar o Google Maps"
Place generic outlined marker A at left and marker B at right but no drawn route between them.
Below map a segmented control "Ida" selected and "Volta". Beside it fields:
"Entrada da vaga: 06:00"
"Saída da vaga: 14:20"
Then heading "Percurso" and a simple placeholder sequence:
"Caminhada → Transporte 1 → possível integração → Caminhada"
Each element has sublabel "A calcular".
Below a second row "Alternativa de rota — ainda não consultada".
Right heading "Resumo da mobilidade". Definition rows:
"Situação: Pendente"
"Ida: Não calculada"
"Volta: Não calculada"
"Conduções: A calcular"
"Caminhada: A calcular"
"Compatibilidade com a escala: Pendente"
Gray rule box:
"Regra atual: no máximo 2 conduções na ida e 2 na volta."
Then heading "Custos" with:
"Por trecho: Pendente de validação"
"Diário: Pendente de validação"
"Mensal: Pendente de validação"
"Os dias presenciais da escala serão usados no cálculo."
Then heading "Pendências" with bullets:
"Confirmar o endereço de origem."
"Configurar e testar o fornecedor de mapas."
"Confirmar tarifas e integrações tarifárias."
Outlined button "Confirmar endereço" and black button "Consultar rota" shown DISABLED with helper "API ainda não configurada".
At very bottom of body above footer, a narrow note:
"Mobilidade é analisada separadamente das qualificações profissionais."
No real route, place name other than Leblon Power, duration, transit line, fare, number of connections result, green approved state, or automatic rejection claim.

```
