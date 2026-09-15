# Documentação do Alpha RH

## Fonte de verdade

A especificação principal é:

- [`superpowers/specs/2026-09-08-alpha-rh-master-spec.md`](superpowers/specs/2026-09-08-alpha-rh-master-spec.md)

Ela consolida regras, situação atual, telas, integrações, referências da Quickin, privacidade, pendências, decisões canceladas e a sequência futura. Em caso de conflito, ela prevalece sobre documentos anteriores.

O arquivo [`../PRODUCT.md`](../PRODUCT.md) é o resumo permanente do produto.

## Descoberta antes do desenvolvimento

- [`discovery/2026-09-10-fluxo-requisicao-aprovacao-vaga.md`](discovery/2026-09-10-fluxo-requisicao-aprovacao-vaga.md): primeiro fluxo detalhado, com responsáveis, campos, seis histórias, critérios de aceite e pendências para validação. Proposta de backlog; não implementado.
- [`discovery/2026-09-08-discovery-design-sprint-pbb.md`](discovery/2026-09-08-discovery-design-sprint-pbb.md): método combinado de Design Thinking, Design Sprint e Product Backlog Building, com pesquisa, oficina no Miro, testes, gates, Definition of Ready e Definition of Done.

Esse documento organiza a validação anterior a qualquer nova fase de programação. Decisões confirmadas na oficina devem ser transferidas para a especificação mestre.

## Especificações especializadas existentes

- [`superpowers/specs/2026-09-14-whatsapp-questionarios-regras.md`](superpowers/specs/2026-09-14-whatsapp-questionarios-regras.md): regras propostas de questionários por WhatsApp, fontes consultadas, fila, limites, pausas e piloto; não implementado.
- `superpowers/specs/2026-09-03-candidate-photos-job-description-generator-design.md`
- `superpowers/specs/2026-09-04-kanban-extraction-lab-design.md`
- `superpowers/specs/2026-09-04-extraction-backend-fastapi-mysql-design.md`
- `superpowers/specs/2026-09-04-extraction-to-kanban-design.md`

Alguns desses arquivos registram versões antigas do protótipo, como a coluna “Novos” ou o pipeline de seis etapas. Eles foram preservados como histórico; a terminologia atual está na especificação mestre.

## Planos históricos

Os arquivos em `superpowers/plans` registram etapas já planejadas ou executadas. Eles não autorizam automaticamente novas implementações.

## Regra para futuras alterações

Toda nova decisão deverá:

1. ser marcada como confirmada, implementada, planejada, pendente ou descartada;
2. indicar qual regra anterior substitui, quando aplicável;
3. atualizar a especificação mestre;
4. não apresentar uma integração ou funcionalidade como pronta sem implementação e verificação.
