# Lote 7 — Agenda, Entrevista, Banco de Talentos e Importação

Propostas estáticas de baixa fidelidade; não representam funcionalidades prontas. Este lote reduz a quantidade de páginas: ações ligadas a uma candidatura permanecem no modal sobre o Kanban.

## Imagens

- `18-agenda-entrevistas.png`: agenda global do RH em visão semanal, com filtros e acesso ao candidato.
- `19-modal-entrevista-rh.png`: preparação, perguntas e registro da entrevista dentro do modal do candidato.
- `20-banco-de-talentos.png`: busca e reaproveitamento de perfis, preservando candidaturas separadas por vaga.
- `21-modal-importar-candidato.png`: entrada manual de currículo pelo botão `Adicionar candidato`, com extração, revisão, duplicidade e inclusão no Kanban no mesmo fluxo.

## Organização aprovada para o protótipo

- `Agenda` é uma tela global porque reúne compromissos de várias vagas.
- `Banco de Talentos` é uma tela global porque reúne perfis e históricos de várias candidaturas.
- A entrevista não cria uma nova tela de navegação; é registrada no modal do candidato aberto pelo Kanban.
- A importação manual não exige um módulo principal separado; abre pelo botão `Adicionar candidato`.
- O fluxo da importação ocorre no mesmo modal: Arquivo → Extração → Revisão → Adicionar ao Kanban.
- Nenhum candidato entra no Kanban automaticamente após a extração; o RH revisa e confirma.
- Possíveis duplicidades são mostradas para revisão, sem união automática de pessoas.
- O currículo original é preservado e documentos ilegíveis podem exigir OCR e revisão humana.

## Limites mantidos

- Entrevistas usam critérios profissionais e observações objetivas, sem pontuação genérica de personalidade.
- Não foram incluídas perguntas sobre filhos, moradia, aluguel, tabagismo, consumo de álcool, sexo ou outros critérios pessoais sem finalidade profissional validada.
- `Não informado` não é tratado como resultado negativo.
- Nenhuma entrevista movimenta, contrata ou desclassifica automaticamente.
- A agenda não afirma que convites foram enviados; canais externos ainda dependem de integração.
- Filtros do Banco de Talentos não incluem idade ou sexo.

## Próximo lote proposto

- Entrega e conferência de documentos de admissão.
- Treinamento e conclusão da contratação.
- Página de integrações e falhas de processamento.
- Usuários, funções e permissões.
