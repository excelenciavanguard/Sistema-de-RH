# Lote 8 — Documentos, Treinamento e Contratação

Propostas estáticas de baixa fidelidade; não representam funcionalidades prontas nem regras trabalhistas já validadas. As três imagens detalham o trabalho nas últimas colunas do Kanban sem criar páginas independentes.

## Imagens

- `22-modal-entrega-documentos.png`: conferência de documentos aplicáveis, pendências, acesso restrito e bloqueio do avanço enquanto faltar revisão humana.
- `23-modal-treinamento.png`: agenda, participação, comprovantes e pendências dos treinamentos definidos pelas áreas responsáveis.
- `24-modal-contratacao.png`: conferência final da vaga e admissão, resultado final, autorização e encerramento da candidatura.

## Fluxo representado

`Entrega de documentos → Treinamento → Contratação`

Cada etapa continua sendo uma coluna do Kanban. Ao clicar no candidato, o sistema abre o mesmo modal 360 e apresenta o conteúdo de trabalho adequado à etapa atual.

## Comportamentos propostos

### Entrega de documentos

- O Departamento Pessoal define quais documentos são aplicáveis.
- O sistema diferencia `Pendente`, `Recebido` e `A revisar`.
- Arquivos originais são preservados e visualizações, downloads e correções são auditados.
- Dados sensíveis não aparecem diretamente no card do Kanban.
- O avanço para Treinamento depende de conferência humana.

### Treinamento

- O RH ou a Operação registra treinamento, formato, data, presença, responsável e comprovante.
- Pendências impedem a conclusão da etapa até a conferência.
- Os exemplos de treinamento do protótipo não definem obrigação legal ou conteúdo obrigatório.

### Contratação

- A conferência final reúne posto, função, contrato, escala, horário, data de início e responsável do DP.
- O salário aparece somente para perfis autorizados.
- A contratação exige confirmação da data de início e declaração de autorização do responsável.
- Ao confirmar, a candidatura sai do Kanban ativo, mas o perfil, o currículo e o histórico permanecem preservados.
- O resultado final admite `Contratado`, `Finalista não contratado`, `Banco de talentos`, `Desistiu` ou `Não compareceu`.
- Responsável, data e justificativa ficam registrados na auditoria.

## Pendências de validação

- Relação definitiva de documentos de admissão e permissões de acesso: Departamento Pessoal e Jurídico.
- Treinamentos exigidos por função e posto: áreas responsáveis.
- Quais dados serão enviados para folha, Weboper ou outro sistema: integração ainda não definida.
- Regras de reabertura após contratação e correção de data de início.

## Observação técnica

As imagens 22 e 23 foram produzidas com a ferramenta nativa de geração de imagens. Após o limite temporário da ferramenta, a imagem 24 foi composta de forma determinística em HTML/CSS e capturada como PNG no mesmo padrão de baixa fidelidade. O arquivo `24-modal-contratacao.html` foi preservado como fonte editável do wireframe.
