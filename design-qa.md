# Design QA — Kanban de recrutamento

## Escopo

- Página verificada: `http://localhost:4173/`
- Referência aprovada: `.impeccable/mocks/approved/kanban-filtros-aprovado.png`
- Evidência desktop: `.impeccable/review/kanban-desktop.png`
- Evidência compacta: `.impeccable/review/kanban-mobile.png`
- Viewports: 1672 × 938 e 390 × 844

## Comparação visual

A referência e a captura desktop foram inspecionadas juntas. A implementação preserva a hierarquia aprovada: cabeçalho azul-marinho, navegação horizontal em dois níveis, superfície elevada para o Kanban, filtros compactos, colunas claras, cartões com sombra suave e linha vertical colorida por etapa.

Diferenças intencionais:

- A vaga usa o código demonstrativo `2026-0157`.
- Foi incluído o botão `Testar extração` para o laboratório OpenAI × Gemini solicitado.
- A guia `Desclassificados` recebeu contador para demonstrar o histórico fora do fluxo ativo.
- A regra de mobilidade foi atualizada para até duas conduções na ida e até duas na volta.

## Interações verificadas

- Abertura e fechamento da ficha 360º do candidato.
- Navegação da ficha por Resumo, Currículo, Evidências, Mobilidade e Histórico.
- Abertura do laboratório de extração, seleção de provedor e comunicação explícita do modo demonstração.
- Abertura do personalizador de filtros, com filtros visíveis e ocultos.
- Busca de candidatos e estrutura de arrastar e soltar cobertas pelos testes de componente.

## Acessibilidade e responsividade

- Botões e controles possuem nomes acessíveis.
- Modais usam títulos associados e ações de fechamento identificadas.
- O Kanban mantém rolagem horizontal em telas estreitas, preservando a legibilidade dos cartões e a comparação entre etapas.
- Estados não dependem somente de cor: usam texto, ícones e rótulos.

## Verificação técnica

- `npm test`: 3 testes aprovados.
- `npm run build`: build Vite concluído.
- `npm run test:sites`: 4 testes aprovados.
- Detector Impeccable: dois avisos aceitos por intenção de design — fonte Inter alinhada à referência e faixa lateral solicitada explicitamente nos cartões.

## Pendências fora desta entrega

- OpenAI e Gemini ainda não estão conectados a chaves reais; o laboratório está deliberadamente em modo demonstração.
- Upload e extração reais devem passar por backend FastAPI, armazenamento protegido, antivírus/validação e trilha de auditoria.
- A API de rotas e transporte ainda não foi configurada.

## Revisão adicional — modal de mobilidade

- Referência: `.impeccable/mocks/candidate-modal-directions/02-modal-mobilidade.png`
- Captura desktop: `.impeccable/review/mobility-modal-desktop.png`
- Captura compacta: `.impeccable/review/mobility-modal-mobile.png`
- Estado comparado: candidato Rafael Santos com a aba Mobilidade aberta, em 1680 × 943.
- O conteúdo anterior dividido entre currículo e um resumo de rota foi substituído pelo workspace 64/36 aprovado: mapa amplo, ida/volta, horários, percurso por etapas, alternativa, painel de custos e pendências e rodapé operacional.
- O mapa é um ativo demonstrativo e está rotulado como tal; nenhuma chamada ao Google Maps é simulada como real.
- A alternância Ida/Volta foi testada no navegador: atualiza total de 38 para 42 minutos e a alternativa de 46 para 49 minutos.
- Console do navegador: sem erros ou avisos.
- Testes: 4 aprovados; build Vite concluído.

final result: passed
