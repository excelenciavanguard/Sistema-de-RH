# Lote 6 — Respostas, Evidências, Histórico e Desclassificados

Propostas estáticas de baixa fidelidade; não representam funcionalidades prontas. Geradas a partir do Kanban e do modal aprovados nos lotes anteriores. Nomes, datas e conteúdos são ilustrativos.

## Imagens

- `14-modal-candidato-respostas.png`: respostas da candidatura, origem, data, versão, obrigatoriedade e pendências.
- `15-modal-candidato-evidencias.png`: conferência humana das informações extraídas, com fonte, página e trecho do currículo.
- `16-modal-candidato-historico.png`: trilha cronológica de eventos do sistema e ações humanas, com responsável e data.
- `17-desclassificados-vaga.png`: candidaturas retiradas do Kanban daquela vaga, com motivo, responsável, histórico e opção de reabertura.

## Decisões consolidadas neste lote

- O modal do candidato passa a usar a ordem: **Resumo, Currículo, Evidências, Respostas, Mobilidade e Histórico**.
- As respostas completas ficam na aba `Respostas`; o card do Kanban mostra somente um resumo de pendências.
- Cada resposta registra pergunta, conteúdo, origem, data, versão e se era obrigatória.
- Resposta pendente não é tratada como resposta negativa e não elimina automaticamente.
- Evidências da IA apontam a fonte e o trecho; o RH confirma, corrige ou envia para revisão.
- `Não informado` continua diferente de `não atende`.
- Histórico separa eventos automáticos de ações humanas e não permite apagar eventos de auditoria.
- Desclassificar encerra somente a candidatura naquela vaga e a retira do Kanban ativo.
- O perfil permanece no Banco de Talentos e pode participar de outras vagas.
- Reabrir uma candidatura preserva o histórico e exige confirmação.
- Nenhuma pessoa é contratada ou desclassificada automaticamente nestas propostas.

## Dependências ainda não configuradas

- Envio de questionários por e-mail e WhatsApp depende das integrações, modelos aprovados, consentimento aplicável e regras do canal.
- A extração por IA e suas referências ainda precisam de piloto e validação do RH.
- Estas telas documentam comportamento esperado; não comprovam backend, banco, APIs ou automações em funcionamento.

## Critérios para teste com o RH

- O usuário encontra as respostas sem sair do Kanban?
- Fica claro o que foi respondido, o que está pendente e de onde veio cada informação?
- A evidência permite conferir rapidamente a extração no currículo original?
- O histórico deixa claro quem fez cada ação e quando?
- Ao desclassificar, o usuário entende que o candidato continua no Banco de Talentos?
- A reabertura e a preservação do histórico estão compreensíveis?
