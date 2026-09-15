# Alpha RH — especificação mestre do produto

**Data de consolidação:** 8 de setembro de 2026  
**Situação:** desenho aprovado para documentação; não autoriza novas implementações  
**Escopo atual:** uso interno da Alpha Serviços  
**Autoridade documental:** este documento prevalece quando houver conflito de terminologia, etapas ou situação do projeto em documentos anteriores.

## 1. Finalidade deste documento

Consolidar, em uma única fonte, tudo o que foi confirmado desde o início do projeto, as descobertas feitas na Quickin, as capacidades já existentes no protótipo, as decisões ainda pendentes e as regras canceladas ou substituídas.

As marcações usadas são:

- **Confirmado:** decisão aprovada para o produto.
- **Implementado:** existe no ambiente local e foi verificado.
- **Planejado:** aprovado, mas ainda não construído.
- **Pendente:** depende de informação, fornecedor, validação técnica, orçamento ou parecer jurídico.
- **Descartado:** não deve orientar a construção.

### Inventário desta versão

| Situação | Quantidade |
|---|---:|
| Confirmado | 138 |
| Implementado | 5 |
| Planejado e aprovado | 62 |
| Pendente de validação | 8 |
| Evidência registrada | 1 |
| Cancelado ou substituído | 9 |
| **Total de itens rastreáveis** | **223** |

“Implementado” significa que existe evidência técnica no ambiente local. Capacidades implementadas também respeitam as decisões confirmadas, mas foram contadas separadamente para tornar visível a diferença entre intenção e realidade.

## 2. Visão do produto

O Alpha RH será um sistema web interno para conduzir o recrutamento por posto de trabalho, da requisição da vaga à contratação ou ao encerramento da candidatura. O produto deve reduzir o trabalho manual necessário para tratar mais de 1.000 currículos, mantendo revisão humana, evidências, auditoria e proteção de dados.

Os diferenciais são:

- vagas vinculadas a postos ativos do Weboper;
- currículos reunidos de vários canais;
- extração estruturada e comparação explicável por IA;
- mobilidade por transporte público calculada nos horários reais da vaga;
- currículo original, perguntas, evidências e histórico na mesma área de trabalho;
- perfil único do candidato, com participações independentes em várias vagas;
- processo configurável, mas sem decisões discriminatórias ou inferências indevidas.

## 3. Situação real em 8 de setembro de 2026

### Implementado e verificado

- Frontend local em React com navegação superior, Kanban, filtros, modal do candidato, laboratório de extração e área demonstrativa de mobilidade.
- Backend local em Python 3.12, FastAPI, SQLAlchemy, Alembic e MySQL próprio `alpha_rh`.
- Upload, validação e extração local de PDF, DOCX e TXT; DOC legado pode exigir revisão.
- Adaptadores de OpenAI e Gemini com validação estruturada.
- Ação explícita para adicionar uma extração escolhida ao Kanban.
- Persistência de candidatos e candidaturas no banco próprio.
- Movimentação de candidatura entre etapas com evento de auditoria.
- Pipeline atual com nove etapas: Candidatura, Triagem, Contato, Entrevista RH, Entrevista Gestor, Pesquisa, Entrega de documentos, Treinamento e Contratação.
- Migração do pipeline aplicada somente no banco `alpha_rh`.
- Testes existentes: 21 testes do backend e 7 testes do frontend aprovados na última verificação registrada; o build do frontend também foi aprovado.

### Ainda não implementado

- Cadastro real de requisições e vagas.
- Aprovação pela diretoria.
- Perguntas e respostas de candidatura persistidas.
- Scorecards, automações, agenda, página pública, relatórios completos e administração.
- Autenticação e permissões reais.
- Sincronização automática com Weboper.
- Conector da API Quickin.
- Importadores de Gmail, Indeed e WhatsApp.
- Google Maps e cálculo real de mobilidade/tarifas.
- Fluxo de admissão e documentos.

## 4. Usuários, papéis e autoridade

- **GOV-001 — Confirmado:** Operações cria a requisição da vaga.
- **GOV-002 — Confirmado:** a Diretoria aprova, rejeita ou solicita correção da requisição.
- **GOV-003 — Confirmado:** a diretoria possui acesso a todos os módulos e registros.
- **GOV-004 — Planejado:** Operações poderá editar rascunhos e requisições devolvidas para correção.
- **GOV-005 — Planejado:** a diretoria poderá aprovar, rejeitar ou solicitar correção, registrando motivo.
- **GOV-006 — Planejado:** cada vaga terá responsável e equipe de trabalho.
- **GOV-007 — Planejado:** permissões serão concedidas por função e pelo princípio do menor acesso.
- **GOV-008 — Planejado:** candidatos usarão links individuais e seguros; não terão acesso ao painel interno.
- **GOV-009 — Confirmado:** administrador comercial multiempresa e cobrança não fazem parte do escopo interno atual.

## 5. Weboper, postos e banco próprio

- **DAT-001 — Confirmado:** o Weboper usa MySQL e será consultado somente para leitura.
- **DAT-002 — Confirmado:** nenhuma operação do Alpha RH gravará ou alterará dados do Weboper.
- **DAT-003 — Confirmado:** os postos usados pelo recrutamento estão na tabela `CAD_CLIENTE`.
- **DAT-004 — Confirmado:** somente registros com situação ativa poderão ser selecionados em novas vagas.
- **DAT-005 — Confirmado:** serão preservados os identificadores originais para sincronização e rastreabilidade.
- **DAT-006 — Confirmado:** os campos identificados são `CHAVE`, `RAZAO_SOCIAL`, `NOME_FANTASIA`, `SITUACAO`, `ENDERECO`, `BAIRRO`, `MUNICIPIO`, `UF` e `CEP`.
- **DAT-007 — Confirmado:** o banco do recrutamento é próprio e separado do Weboper.
- **DAT-008 — Implementado:** o banco local próprio se chama `alpha_rh`.
- **DAT-009 — Planejado:** a integração usará usuário MySQL exclusivo de leitura e rede restrita.
- **DAT-010 — Pendente:** frequência, estratégia incremental e tratamento de alterações dependerão do volume e da infraestrutura de produção.
- **DAT-011 — Evidência:** na verificação registrada, `CAD_CLIENTE` possuía 300 registros: 134 ativos, 165 inativos e 1 sem situação.

## 6. Requisição, aprovação e criação da vaga

- **VAC-001 — Planejado:** a primeira fase futura começará por requisição, aprovação, vaga e perguntas.
- **VAC-002 — Confirmado:** o fluxo é Operações cria a requisição, Diretoria aprova e RH cria a vaga.
- **VAC-003 — Planejado:** estados da requisição: Rascunho, Aguardando aprovação, Correção solicitada, Aprovada, Rejeitada e Convertida em vaga.
- **VAC-004 — Planejado:** a aprovação habilitará o RH a criar a vaga, aproveitando os dados da requisição sem publicá-la automaticamente.
- **VAC-005 — Planejado:** a vaga somente poderá ser publicada depois da aprovação.
- **VAC-006 — Confirmado:** cada vaga será vinculada a um posto ativo e ao seu endereço sincronizado.
- **VAC-007 — Confirmado:** cada vaga terá função, atividades, quantidade, salário, benefícios, contrato, escala, dias, entrada, saída, requisitos obrigatórios e desejáveis, experiência, cursos/certificações, responsável e situação.
- **VAC-008 — Planejado:** modelos de trabalho: presencial, remoto ou híbrido.
- **VAC-009 — Planejado:** modos de publicação: pública, interna, não listada ou não publicada.
- **VAC-010 — Planejado:** o RH poderá escolher quais informações públicas exibir, como salário, contrato e benefícios.
- **VAC-011 — Confirmado:** uma vaga poderá ser duplicada, mas a cópia receberá novo código, voltará a rascunho e exigirá nova aprovação.
- **VAC-012 — Confirmado:** descrição e campos copiados serão marcados para revisão.
- **VAC-013 — Confirmado:** a IA poderá gerar descrição usando somente dados estruturados informados pelo RH.
- **VAC-014 — Confirmado:** o RH escolherá blocos, tom formal/direto/acolhedor, tamanho curto/padrão/detalhado e linguagem simples/corporativa.
- **VAC-015 — Confirmado:** a IA não inventará salário, benefícios, endereço, escala, contrato, requisitos ou quantidade.
- **VAC-016 — Confirmado:** gerações e edições da descrição serão versionadas, comparáveis e restauráveis.
- **VAC-017 — Planejado:** arquivos internos poderão ser anexados à vaga com acesso controlado.
- **VAC-018 — Planejado:** vaga poderá ser restrita à equipe indicada, exceto para a diretoria.
- **VAC-019 — Planejado:** haverá acompanhamento de prazo de abertura e previsão de fechamento.

## 7. Perguntas de candidatura

- **QUE-001 — Confirmado:** uma vaga poderá ter várias perguntas.
- **QUE-002 — Confirmado:** cada pergunta poderá ser obrigatória ou opcional.
- **QUE-003 — Confirmado:** tipos iniciais: Sim/Não, escolha única, escolha múltipla, texto curto, texto longo, número e data.
- **QUE-004 — Planejado:** perguntas poderão ser adicionadas, removidas e reordenadas.
- **QUE-005 — Planejado:** perguntas objetivas terão opções configuráveis.
- **QUE-006 — Confirmado:** as perguntas serão criadas e configuradas diretamente dentro de cada vaga; não haverá tela ou biblioteca separada de templates de perguntas.
- **QUE-007 — Planejado:** o editor mostrará uma prévia do formulário do candidato.
- **QUE-008 — Confirmado:** respostas serão vinculadas à candidatura e à versão da pergunta apresentada.
- **QUE-009 — Confirmado:** respostas aparecerão no perfil, no card quando necessário e nos filtros do Kanban.
- **QUE-010 — Confirmado:** o questionário complementar poderá ser enviado por link individual via e-mail ou WhatsApp.
- **QUE-011 — Planejado:** o link terá validade, registro de envio, resposta e lembretes controlados.
- **QUE-012 — Planejado:** uma resposta poderá ser marcada como incompatível quando existir critério profissional objetivo relacionado à vaga.
- **QUE-013 — Confirmado:** resposta incompatível será sinalizada para revisão; não haverá eliminação silenciosa.
- **QUE-014 — Planejado:** alterações depois da publicação criarão nova versão e não modificarão retroativamente respostas antigas.
- **QUE-015 — Planejado:** vaga não poderá ser publicada com pergunta obrigatória incompleta ou sem opções válidas.
- **QUE-016 — Pendente jurídico:** perguntas sobre idade, sexo, filhos, moradia, aluguel, fumar, beber e situação familiar não poderão alimentar ranking ou eliminação sem hipótese legal específica e documentada.

## 8. Canais, importação e currículos

- **ING-001 — Confirmado:** canais atuais: Gmail do Rio Vagas, Quickin/People, Indeed, WhatsApp e currículo físico/manual.
- **ING-002 — Confirmado:** toda entrada registrará canal e origem.
- **ING-003 — Confirmado:** formatos: PDF, DOC, DOCX, TXT e imagens quando aplicável.
- **ING-004 — Confirmado:** texto do corpo do e-mail poderá ser aproveitado quando contiver o currículo.
- **ING-005 — Confirmado:** PDF digitalizado e imagem usarão OCR quando necessário.
- **ING-006 — Confirmado:** TXT terá detecção de codificação para preservar acentos.
- **ING-007 — Confirmado:** o arquivo original será preservado quando a candidatura for admitida no sistema.
- **ING-008 — Confirmado:** mensagem e anexo de origem permanecerão rastreáveis.
- **ING-009 — Confirmado:** extensão, MIME, assinatura e tamanho serão validados; executáveis serão recusados.
- **ING-010 — Confirmado:** arquivo vazio, corrompido, protegido ou duvidoso irá para revisão sem inventar dados.
- **ING-011 — Confirmado:** hash identificará arquivos exatamente iguais.
- **ING-012 — Confirmado:** novo recebimento do mesmo arquivo será registrado sem executar novamente a mesma extração.
- **ING-013 — Confirmado:** currículos diferentes da mesma pessoa serão preservados como versões.
- **ING-014 — Confirmado:** coincidência somente de nome nunca unirá pessoas automaticamente.
- **ING-015 — Confirmado:** possíveis duplicidades usarão sinais como telefone, e-mail e identificador legitimamente coletado, com revisão humana quando houver dúvida.
- **ING-016 — Confirmado:** card mostrará “Currículo reenviado” ou “Possível cadastro existente”, com quantidade e data do último envio.
- **ING-017 — Confirmado:** falhas serão registradas e poderão ser reprocessadas.
- **ING-018 — Confirmado:** a primeira versão do importador de e-mail não responderá, moverá ou apagará mensagens.
- **ING-019 — Pendente:** endereço da caixa do RH, pasta, plano KingHost e importação de mensagens antigas.
- **ING-020 — Pendente:** processo definitivo para arquivos recebidos por WhatsApp e currículos físicos.

## 9. Candidato, perfil único e banco de talentos

- **CAN-001 — Confirmado:** candidato representa a pessoa independentemente da vaga.
- **CAN-002 — Confirmado:** candidatura representa a participação da pessoa em uma vaga.
- **CAN-003 — Confirmado:** um candidato poderá participar de várias vagas com históricos independentes.
- **CAN-004 — Confirmado:** desclassificação em uma vaga não bloqueará automaticamente outras candidaturas.
- **CAN-005 — Confirmado:** candidatos e candidaturas não serão apagados ao sair do Kanban ativo.
- **CAN-006 — Confirmado:** desclassificados ficarão em área própria, com motivo, observação, etapa de origem, responsável e data.
- **CAN-007 — Confirmado:** usuário autorizado poderá reabrir a candidatura sem apagar o histórico.
- **CAN-008 — Confirmado:** resultados finais poderão incluir Contratado, Finalista não contratado, Banco de talentos, Desistiu e Não compareceu.
- **CAN-009 — Confirmado:** currículo original ficará acessível para visualização ou download conforme permissão.
- **CAN-010 — Confirmado:** PDF terá visualização direta; DOC, DOCX e TXT terão prévia segura gerada no servidor.
- **CAN-011 — Confirmado:** falha de prévia não apagará o original e será mostrada como “Prévia indisponível”.
- **CAN-012 — Confirmado:** visualizações e downloads de currículo serão auditados.
- **CAN-013 — Confirmado:** quando houver foto no currículo, poderá ser criada miniatura para o card desde Candidatura e para o modal.
- **CAN-014 — Confirmado:** foto não será enviada à IA nem usada em filtro, ranking, compatibilidade ou recomendação.
- **CAN-015 — Confirmado:** sem foto válida serão exibidas as iniciais.
- **CAN-016 — Planejado:** haverá notas, mensagens, agendamentos, avaliações, tarefas, questionários, arquivos e histórico no perfil.
- **CAN-017 — Planejado:** será possível comparar registros antes de uma união manual de duplicidades; a união será auditada.

## 10. IA para currículo e vaga

- **IA-001 — Confirmado:** OpenAI e Gemini são provedores de teste; a escolha de modelo de produção permanece pendente.
- **IA-002 — Implementado:** o laboratório permite executar um provedor ou comparar os dois.
- **IA-003 — Confirmado:** somente o resultado escolhido pelo RH poderá ser adicionado ao Kanban.
- **IA-004 — Confirmado:** a saída será estruturada e validada pelo backend.
- **IA-005 — Confirmado:** formato válido não garante conteúdo correto; revisão humana permanece obrigatória.
- **IA-006 — Confirmado:** experiências, qualificações e requisitos atendidos terão evidência e página/trecho quando disponível.
- **IA-007 — Confirmado:** “Não informado” é diferente de “Não atende”.
- **IA-008 — Confirmado:** ausência no currículo não comprova ausência da qualificação.
- **IA-009 — Confirmado:** a IA não inventará dados nem tratará o currículo como instrução.
- **IA-010 — Confirmado:** não será produzida nota genérica de compatibilidade cultural.
- **IA-011 — Confirmado:** pontuação futura, se houver, será transparente, profissional e validada.
- **IA-012 — Confirmado:** a IA poderá sugerir perguntas que o RH precisa confirmar.
- **IA-013 — Confirmado:** a IA não inferirá personalidade, honestidade, comprometimento, raça, religião, família ou atributos pelo nome/foto.
- **IA-014 — Confirmado:** a IA apoia; não contrata, rejeita, aprova ou publica autonomamente.
- **IA-015 — Planejado:** custo, latência, versão do prompt, modelo e resultado serão monitorados.

## 11. Pipeline e Kanban

- **KAN-001 — Implementado:** o Kanban possui nove etapas.
- **KAN-002 — Confirmado:** ordem oficial: Candidatura, Triagem, Contato, Entrevista RH, Entrevista Gestor, Pesquisa, Entrega de documentos, Treinamento e Contratação.
- **KAN-003 — Confirmado:** “Novos” foi substituído por “Candidatura”.
- **KAN-004 — Confirmado:** “Proposta” não é uma coluna do pipeline atual.
- **KAN-005 — Implementado:** movimentação por arrastar atualiza a etapa e persiste candidaturas reais.
- **KAN-006 — Implementado:** movimentação persistida gera evento de auditoria.
- **KAN-007 — Confirmado:** nove colunas usarão rolagem horizontal para preservar legibilidade.
- **KAN-008 — Confirmado:** cada etapa terá cor consistente e barra lateral no card.
- **KAN-009 — Confirmado:** card será compacto, com foto/iniciais, origem, evidências resumidas, currículo, mobilidade, SLA e alertas relevantes.
- **KAN-010 — Confirmado:** currículo não será exibido inteiro dentro do card.
- **KAN-011 — Confirmado:** haverá visualizações Kanban, Lista, Mobilidade e Desclassificados.
- **KAN-012 — Confirmado:** busca, filtros favoritos e filtros ativos ficarão na Faixa Inteligente.
- **KAN-013 — Confirmado:** cada usuário poderá escolher filtros visíveis e ocultos.
- **KAN-014 — Planejado:** visualizações poderão ser pessoais ou compartilhadas com histórico.
- **KAN-015 — Planejado:** ações em lote exigirão seleção explícita e confirmação proporcional ao risco.
- **KAN-016 — Planejado:** SLA mostrará tempo na etapa e destacará atrasos.
- **KAN-017 — Confirmado:** abrir um candidato exibirá o modal 360 amplo, não um pop-up pequeno.

## 12. Mobilidade

- **MOB-001 — Confirmado:** qualificação profissional e deslocamento são dimensões separadas.
- **MOB-002 — Confirmado:** bairro, município, região ou distância em linha reta não reprovarão por si sós.
- **MOB-003 — Confirmado:** a melhor rota viável poderá ter no máximo duas conduções na ida e duas na volta.
- **MOB-004 — Confirmado:** cada novo embarque em ônibus, metrô, trem, barca, BRT, van ou equivalente conta como condução.
- **MOB-005 — Confirmado:** caminhada não conta como condução.
- **MOB-006 — Confirmado:** ida e volta serão avaliadas separadamente.
- **MOB-007 — Confirmado:** serão usados os horários reais de entrada e saída da vaga.
- **MOB-008 — Confirmado:** fins de semana, feriados e horários noturnos serão considerados quando aplicáveis.
- **MOB-009 — Confirmado:** serão mostrados duração, caminhada, conexões, disponibilidade no horário e alternativas.
- **MOB-010 — Confirmado:** serão mostrados custos por trecho, diário e mensal.
- **MOB-011 — Confirmado:** o mensal usará dias presenciais da escala, não 22 dias fixos.
- **MOB-012 — Confirmado:** tarifa ausente será “Custo pendente de validação”, nunca zero.
- **MOB-013 — Confirmado:** fonte e data da consulta serão exibidas.
- **MOB-014 — Confirmado:** localização ausente, ambígua ou falha do fornecedor irá para “Mobilidade pendente”.
- **MOB-015 — Confirmado:** falha técnica não será tratada como reprovação de rota.
- **MOB-016 — Confirmado:** quando nenhum trecho respeitar o limite, não será criada candidatura para aquela vaga.
- **MOB-017 — Confirmado:** se já existir candidato por outra vaga, o perfil permanecerá sem novo vínculo.
- **MOB-018 — Confirmado:** arquivo recusado antes da entrada não será copiado para o armazenamento próprio; será mantido apenas registro técnico mínimo e o original continuará no canal de origem.
- **MOB-019 — Confirmado:** Google Maps Platform foi escolhido como fornecedor pretendido.
- **MOB-020 — Confirmado:** RH e candidatos não precisarão fazer login Google.
- **MOB-021 — Pendente:** conta Google Cloud, faturamento, chaves, quotas, cobertura e tarifas ainda não foram configurados nem testados.
- **MOB-022 — Pendente:** duração máxima, caminhada máxima, margem de chegada e tolerância de conexão.
- **MOB-023 — Confirmado:** custo estimado não será tratado automaticamente como valor final de vale-transporte.

## 13. Comunicação e automações

- **AUT-001 — Planejado:** ações configuráveis por etapa poderão ocorrer ao entrar na etapa ou ao desclassificar.
- **AUT-002 — Planejado:** tipos iniciais de ação: preparar/enviar e-mail, criar tarefa, enviar questionário e aplicar tag.
- **AUT-003 — Planejado:** automações terão atraso configurável e opção de pular fins de semana.
- **AUT-004 — Confirmado:** nenhuma automação desclassificará silenciosamente sem rastreabilidade e revisão aplicável.
- **AUT-005 — Planejado:** e-mails, questionários, requisições e scorecards serão configurados dentro dos respectivos fluxos, sem um módulo próprio de templates.
- **AUT-006 — Planejado:** e-mails enviados e recebidos vinculados ao candidato ficarão no histórico.
- **AUT-007 — Planejado:** comunicação via WhatsApp dependerá de integração oficial, opt-in e templates aprovados.
- **AUT-008 — Planejado:** agenda terá visualizações mensal, semanal e diária, próprias e da equipe.
- **AUT-009 — Planejado:** tarefas terão responsável, prazo, situação e vínculo com candidato/vaga.
- **AUT-010 — Pendente:** provedor de WhatsApp, custos, limites e autorização.

Detalhamento documental de 14/09/2026: [regras de questionários por WhatsApp](2026-09-14-whatsapp-questionarios-regras.md). Registra requisitos externos consultados e parâmetros internos propostos (frequência, horários, piloto e pausas), ainda sujeitos à validação. Não altera a situação de implementação nem representa aprovação da Meta. O inventário de itens acima permanece o da consolidação original; as regras WA desta proposta não foram somadas a ele.

## 14. Avaliações e scorecards

- **AVA-001 — Planejado:** RH e gestor usarão scorecards padronizados relacionados aos requisitos da vaga.
- **AVA-002 — Planejado:** cada critério terá definição, evidência, avaliação e comentário.
- **AVA-003 — Planejado:** avaliações de RH e gestor serão registradas separadamente.
- **AVA-004 — Planejado:** alterações serão auditadas e não apagarão avaliações anteriores.
- **AVA-005 — Confirmado:** testes genéricos de personalidade, Big Five, DISC ou “cultura” não serão usados para inferir caráter ou eliminar candidatos sem validade profissional e jurídica demonstrada.
- **AVA-006 — Confirmado:** decisões continuarão humanas e justificadas.

## 15. Relatórios e gestão

- **REL-001 — Planejado:** total, classificados, desclassificados e contratados por vaga.
- **REL-002 — Planejado:** quantidade e conversão por etapa.
- **REL-003 — Planejado:** tempo médio e SLA por etapa.
- **REL-004 — Planejado:** motivos de desclassificação profissionais e configuráveis.
- **REL-005 — Planejado:** fontes dos candidatos e dos contratados.
- **REL-006 — Planejado:** tempo para preencher vagas e candidatos aguardando contato.
- **REL-007 — Planejado:** desempenho operacional por período, vaga e responsável, sem ranking pessoal indevido.
- **REL-008 — Planejado:** exportações autorizadas serão assíncronas, auditadas e protegidas.
- **REL-009 — Confirmado:** o painel inicial não exibirá “Saúde das entradas”.
- **REL-010 — Confirmado:** lembretes duplicados foram removidos; pendências devem aparecer uma única vez em “Próximas ações”.

## 16. Administração e configuração

- **ADM-001 — Planejado:** usuários e grupos de permissões.
- **ADM-002 — Planejado:** empresas/postos, departamentos, contratos e responsáveis.
- **ADM-003 — Planejado:** etapas, tags, fontes, motivos de cancelamento e motivos de desclassificação.
- **ADM-004 — Confirmado:** não haverá tela ou módulo de campos personalizados; novos campos serão incorporados aos fluxos específicos quando houver necessidade validada pelo RH.
- **ADM-005 — Planejado:** fluxos de aprovação configuráveis por empresa/posto e departamento.
- **ADM-006 — Planejado:** auditoria central consultável por usuário autorizado.
- **ADM-007 — Planejado:** importação e exportação controladas.
- **ADM-008 — Planejado:** página de carreiras configurável e páginas adicionais no futuro.
- **ADM-009 — Confirmado:** o escopo interno não inclui cobrança, planos ou autosserviço multiempresa.

## 17. Segurança, privacidade e qualidade

- **SEG-001 — Confirmado:** autenticação e autorização por função serão obrigatórias antes de uso real em rede.
- **SEG-002 — Confirmado:** currículos e dados pessoais terão acesso restrito.
- **SEG-003 — Confirmado:** credenciais e chaves ficarão somente no servidor, em mecanismo seguro.
- **SEG-004 — Confirmado:** nenhuma senha ou chave ficará no frontend, repositório ou documentação.
- **SEG-005 — Confirmado:** logs não copiarão currículos, chaves, senhas ou dados pessoais desnecessários.
- **SEG-006 — Confirmado:** acessos, downloads, decisões e mudanças relevantes serão auditados.
- **SEG-007 — Confirmado:** arquivos terão limite, validação, nomes físicos aleatórios e armazenamento privado.
- **SEG-008 — Confirmado:** backups e recuperação serão definidos antes da produção.
- **SEG-009 — Confirmado:** APIs terão quotas, alertas e controle de custos.
- **SEG-010 — Confirmado:** extrações serão validadas em piloto revisado pelo RH antes de ampliação.
- **SEG-011 — Planejado:** autenticação em duas etapas será prevista para diretoria e perfis privilegiados.
- **SEG-012 — Planejado:** sessões/dispositivos conectados poderão ser revogados.
- **SEG-013 — Planejado:** aviso de privacidade, finalidade, retenção, oposição, correção e remoção serão operacionalizados.
- **SEG-014 — Pendente jurídico:** base legal, prazos de retenção, transparência e contratos com operadores.
- **SEG-015 — Confirmado:** consentimento genérico não será tratado como solução universal para LGPD.
- **SEG-016 — Confirmado:** idade e sexo não serão filtros comuns; exceções exigirão justificativa jurídica documentada, acesso restrito e auditoria.
- **SEG-017 — Confirmado:** processos judiciais não serão usados para eliminação, pontuação ou exposição no card sem parecer jurídico formal e fonte contratualmente autorizada.
- **SEG-018 — Confirmado:** a limitação pública do Jusbrasil impede tratá-lo como integração disponível para recrutamento trabalhista.
- **SEG-019 — Confirmado:** padrões mínimos de acessibilidade pretendidos: WCAG 2.2 nível AA, sujeitos à validação formal.
- **SEG-020 — Confirmado:** LGPD, retenção e solicitações não terão tela própria no frontend; seus controles permanecerão no backend e nos fluxos administrativos autorizados.
- **SEG-021 — Confirmado:** a tela de login foi adiada na primeira rodada de implementação; até sua conclusão, o desenvolvimento será local e utilizará somente dados sintéticos. Autenticação e autorização continuam obrigatórias antes de currículos reais, dados pessoais ou acesso pela rede.

## 18. Interface e experiência

- **UX-001 — Confirmado:** idioma principal será português do Brasil.
- **UX-002 — Confirmado:** navegação principal ficará no topo, com segundo nível contextual.
- **UX-003 — Confirmado:** identidade visual será de sistema empresarial robusto, com topbar azul-marinho, superfícies claras, sombras discretas e botões sólidos sem gradiente obrigatório.
- **UX-004 — Confirmado:** Caixa Financeiro e Central de Limpeza são referências de acabamento, não modelos para cópia literal.
- **UX-005 — Confirmado:** Quickin é referência funcional; o Alpha RH não copiará sua identidade visual.
- **UX-006 — Confirmado:** densidade será adequada ao trabalho diário do RH, sem excesso de informação em uma única tela.
- **UX-007 — Confirmado:** o modal 360 terá abas Resumo, Currículo, Evidências, Respostas, Mobilidade e Histórico, podendo crescer futuramente com avaliações.
- **UX-008 — Confirmado:** a aba de Mobilidade terá mapa amplo, ida, volta, escala, percurso, custos, fonte e pendências.
- **UX-009 — Confirmado:** filtros terão chips removíveis, favoritos, “Mais filtros” e “Personalizar”.
- **UX-010 — Confirmado:** ações perigosas terão confirmação e retorno claro.
- **UX-011 — Planejado:** telas terão estados vazios, carregamento, erro, permissão insuficiente, integração indisponível e reprocessamento.
- **UX-012 — Confirmado:** interface será responsiva; Kanban manterá rolagem horizontal em telas estreitas.
- **UX-013 — Planejado:** atalhos de teclado e foco visível serão usados onde ajudarem a operação.
- **UX-014 — Confirmado:** entrevistas serão preparadas e registradas dentro do modal do candidato aberto pelo Kanban, sem criar uma página independente para cada etapa.
- **UX-015 — Confirmado:** a importação manual abrirá por `Adicionar candidato` e conduzirá Arquivo, Extração, Revisão e inclusão no Kanban no mesmo modal.
- **UX-016 — Confirmado:** Agenda e Banco de Talentos permanecem telas globais por reunirem informações de várias vagas.
- **UX-017 — Confirmado:** Entrega de documentos, Treinamento e Contratação continuam como colunas do Kanban; o conteúdo operacional de cada etapa abre no modal do candidato, sem criar três páginas independentes.
- **UX-018 — Proposto para validação:** a confirmação da contratação exigirá conferência da data de início e autorização explícita do responsável, mantendo perfil, currículo e histórico após retirar a candidatura do Kanban ativo.

## 19. Telas previstas

### Recrutamento

1. Início / Próximas ações.
2. Requisições: Todas, Minhas e Aguardando aprovação.
3. Nova requisição e decisão da diretoria.
4. Vagas: lista, filtros e prazos.
5. Criar/editar vaga: Detalhes, Requisitos, Perguntas, Etapas, Revisão/Publicação e Controle.
6. Kanban da vaga: Lista, Kanban, Mobilidade e Desclassificados.
7. Perfil/modal 360 do candidato.
8. Banco de talentos.
9. Importação manual e laboratório de extração.
10. Pendências de mobilidade e processamento.

### Operação complementar

11. Agenda de entrevistas.
12. Tarefas.
13. E-mails e histórico de comunicação.
14. Scorecards e avaliações.
15. Documentos de admissão.
16. Divulgação e página de carreiras.
17. Relatórios.
18. Integrações e erros.

### Administração

19. Usuários e permissões.
20. Postos/empresas, departamentos e contratos.
21. Etapas, fontes, tags e motivos.
22. Auditoria, importação e exportação.

## 20. Quickin: referência, integração e limites

### Recursos observados que serão aproveitados no desenho

- requisições com fila de aprovação;
- editor de vaga dividido por Detalhes, Etapas, Questões, Publicação e Controle;
- ações por etapa para e-mail, tarefa, questionário e tag;
- candidato vinculado a várias vagas;
- SLA, conversão, fontes e motivos de desclassificação;
- página de carreiras e modos de publicação;
- equipe por vaga, grupos de permissões, auditoria e LGPD.

### Recursos que serão adaptados

- respostas eliminatórias serão alertas revisáveis e auditáveis, não eliminação silenciosa;
- automações deverão mostrar condição, prazo, resultado e possibilidade de cancelamento;
- motivos de desclassificação serão profissionais e relacionados à vaga;
- relatórios não substituirão análise humana nem criarão ranking discriminatório.

### Recursos que não serão reproduzidos como estavam configurados

- desclassificação genérica por idade ou sexo;
- desclassificação apenas por distância/localidade, sem avaliar transporte;
- inferência de caráter ou aderência por teste genérico de personalidade;
- exposição de pesquisa judicial no card sem fundamento jurídico e fornecedor autorizado.

### API Quickin confirmada pela documentação pública

- `GET /accounts/{account_id}/jobs`: vagas, etapas, perguntas e resumo do pipeline.
- `POST/PUT /accounts/{account_id}/jobs`: criação/atualização de vaga e `application_questions`.
- `GET /accounts/{account_id}/candidates`: candidatos, filtros incrementais e vínculos `placements`.
- `POST/PUT /accounts/{account_id}/candidates`: criação/atualização de candidato.
- `PUT /accounts/{account_id}/placements/{placement_id}/move`: movimentação entre etapas.
- `POST /public/{account_id}/apply`: candidatura pública e respostas dinâmicas `job_question_{question_id}`.

Referência: [coleção oficial da API Quickin](https://intercom.help/quickin/pt-BR/collections/3030952-api).

### Ainda não confirmado na API Quickin

- leitura das respostas já preenchidas;
- download de currículos e outros anexos;
- notas, mensagens, scorecards, avaliações e questionários respondidos;
- histórico/auditoria completos;
- relatórios e motivos de desclassificação;
- webhooks, limites de requisição e estratégia completa de paginação incremental.

O primeiro teste futuro será somente leitura. Token e `account_id` deverão ficar no backend, nunca neste documento.

## 21. Integrações e situação

| Integração | Finalidade | Situação |
|---|---|---|
| Weboper MySQL / `CAD_CLIENTE` | Postos ativos e endereços | Estrutura identificada; conector automático não implementado |
| Quickin API | Migração/transição de vagas e candidatos | Documentação localizada; credenciais e GET real não testados |
| Gmail do Rio Vagas | Importar mensagens e anexos | Caixa, pasta e histórico pendentes |
| KingHost IMAP | Outra caixa corporativa, se aplicável | Parâmetros do provedor conhecidos; plano e conta não testados |
| Indeed | Origem/publicação/candidaturas | Conta gratuita; API disponível ao plano ainda desconhecida |
| WhatsApp | Receber currículo e enviar questionário | Processo e provedor oficial pendentes |
| OpenAI | Extração estruturada | Adaptador local implementado; modelo e custos de produção pendentes |
| Gemini | Extração estruturada comparativa | Adaptador local implementado; estabilidade e modelo de produção pendentes |
| Google Maps Platform | Rotas, horários e tarifas | Escolhido; Google Cloud e teste real pendentes |
| AGINCO | Pesquisa cadastral autorizada | Documentação pública de API não localizada |
| Jusbrasil | Consulta processual | Não disponível como solução de recrutamento trabalhista; uso bloqueado sem parecer jurídico |

## 22. Modelo conceitual futuro

Entidades principais:

- Organização, Usuário, Papel e Permissão.
- Posto sincronizado e versão do endereço.
- Requisição, Aprovação e Decisão.
- Vaga, Versão da vaga, Etapa e Equipe.
- Pergunta, Opção e Versão.
- Candidato, Contato, Currículo e Versão do currículo.
- Candidatura, Resposta, Evidência e Revisão.
- Movimentação, Desclassificação e Encerramento.
- Scorecard, Avaliação, Entrevista, Tarefa e Comentário.
- Mensagem, Template de comunicação e Evento de envio.
- Rota, Trecho, Tarifa e Avaliação de mobilidade.
- Arquivo, Extração, Resultado do provedor e Tentativa de processamento.
- Fonte e Tag.
- Evento de auditoria, Solicitação LGPD e Política de retenção.

Cada entidade que contenha dados da operação terá identificador da organização, timestamps, responsável e regras explícitas de acesso. Identificadores externos serão armazenados separadamente dos identificadores internos.

## 23. Sequência futura aprovada

Antes de iniciar uma nova fase de programação, o fluxo será observado, prototipado, testado e convertido em backlog preparado conforme `docs/discovery/2026-09-08-discovery-design-sprint-pbb.md`. As quantidades de entrevistas, participantes e duração são propostas nesse documento e ainda precisam ser confirmadas com RH, diretoria e gerente de projetos.

O desenvolvimento será feito por fluxos verticais completos:

1. **Requisição, aprovação, vaga e perguntas.**
2. **Perfil único em várias vagas, scorecards e histórico.**
3. **Automações por etapa, e-mails, questionários e tarefas.**
4. **Publicação, página de carreiras e rastreamento das origens.**
5. **Relatórios, SLA, LGPD e administração.**
6. **Integrações de entrada e migração Quickin conforme viabilidade.**
7. **Mobilidade real com Google Maps após validação do fluxo principal.**

Ao terminar cada etapa futura, o resultado será testado e o próximo passo será informado antes de ampliar o escopo.

## 24. Pendências que exigirão resposta futura

1. Hospedagem e arquitetura de produção.
2. Orçamento mensal e limites de APIs.
3. Autenticação, segundo fator e recuperação de conta.
4. Política jurídica de finalidade, base legal, retenção e direitos dos candidatos.
5. Caixa/pasta do Gmail e período de importação retroativa.
6. Processo de WhatsApp e currículo físico.
7. Credenciais e escopo real da API Quickin.
8. Capacidades disponíveis na conta gratuita do Indeed.
9. Conta Google Cloud, faturamento e teste de cobertura/transporte.
10. Duração máxima, caminhada, margem de chegada e conexões.
11. Fornecedor oficial de WhatsApp.
12. Modelo e orçamento de OpenAI/Gemini para produção.
13. Identidade visual definitiva, domínio e nome comercial; “Alpha RH” é o nome de trabalho atual.
14. Padrão formal de acessibilidade, recomendado como WCAG 2.2 AA.

## 25. Decisões canceladas ou substituídas

- **DESC-001:** eliminar por bairro, município, região ou distância foi cancelado; vale a regra de transporte.
- **DESC-002:** impedir entrada apenas porque a pessoa mora longe foi cancelado; rota simples pode ser viável.
- **DESC-003:** pipeline antigo com Novos, Entrevista e Proposta foi substituído pelas nove etapas oficiais.
- **DESC-004:** entrada automática no Kanban após extração foi substituída por botão explícito “Adicionar ao Kanban”.
- **DESC-005:** MCP para e-mail não é requisito; IMAP direto pode atender.
- **DESC-006:** comercialização e SaaS multiempresa foram adiados; foco atual é uso interno.
- **DESC-007:** “Saúde das entradas” não fará parte do painel inicial.
- **DESC-008:** bloco separado de lembretes duplicando Próximas ações foi removido do desenho.
- **DESC-009:** consulta trabalhista via Jusbrasil não é considerada integração viável para recrutamento.

## 26. Critérios globais para uma futura construção

Uma funcionalidade somente será considerada concluída quando:

- tiver regra e estado de erro documentados;
- persistir dados no banco próprio quando aplicável;
- respeitar permissões e auditoria;
- não depender de dados ilustrativos para afirmar funcionamento real;
- distinguir informação extraída, declarada, confirmada e pendente;
- possuir testes proporcionais ao risco;
- tiver sido verificada no fluxo completo pelo RH;
- preservar originais e histórico;
- não escrever no Weboper;
- não expor segredos ou dados pessoais em logs;
- informar limitações de fornecedor e custo;
- manter revisão humana nas decisões de seleção.

## 27. Documentos relacionados e precedência

- `PRODUCT.md`: resumo permanente do produto; deve permanecer alinhado a esta especificação.
- `docs/discovery/2026-09-08-discovery-design-sprint-pbb.md`: protocolo de descoberta, teste e preparação do backlog antes de novas implementações.
- `2026-09-03-candidate-photos-job-description-generator-design.md`: detalhamento de foto e gerador; substituir “Novos” por “Candidatura”.
- `2026-09-04-kanban-extraction-lab-design.md`: histórico do protótipo inicial; pipeline de seis colunas está superado.
- `2026-09-04-extraction-backend-fastapi-mysql-design.md`: arquitetura implementada do laboratório.
- `2026-09-04-extraction-to-kanban-design.md`: histórico da persistência; estágio `new`/“Novos” está superado por `application`/“Candidatura”.
- Planos em `docs/superpowers/plans`: registros de implementações anteriores; não são autorização para iniciar novas fases.

Quando houver conflito, a ordem de autoridade será:

1. esta especificação mestre;
2. `PRODUCT.md` atualizado;
3. especificações especializadas;
4. planos de implementação históricos.

## 28. Controle de mudanças

Novas decisões devem ser registradas com data e uma das situações definidas na seção 1. Mudanças que substituírem regras anteriores devem indicar expressamente a regra cancelada. Nenhuma pendência deve ser apresentada como integração pronta ou comportamento implementado.
