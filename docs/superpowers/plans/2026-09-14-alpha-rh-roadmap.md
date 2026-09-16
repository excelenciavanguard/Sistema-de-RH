# Alpha RH — ordem de implementação

**Base existente:** React/Vite em `frontend/`, FastAPI/SQLAlchemy/Alembic em `backend/`, banco próprio MySQL, laboratório OpenAI/Gemini, importação manual e Kanban inicial.

**Referência funcional:** `docs/superpowers/specs/2026-09-08-alpha-rh-master-spec.md`.

## Pré-condição de segurança

Antes de qualquer conexão com o Weboper, a credencial mostrada anteriormente deve ser revogada e substituída. O Alpha RH usará outro usuário MySQL, limitado a `SELECT` somente nas tabelas ou views necessárias, com acesso de rede restrito. A senha não será reutilizada, copiada para o frontend, registrada no Git ou enviada em conversa.

## Ordem recomendada

| Fase | Entrega testável | Motivo da posição |
|---:|---|---|
| 0 | Fundação local: organização dos módulos, banco próprio, migrações, auditoria técnica, padrão de erros e testes | Prepara a base sem criar a tela de login nesta etapa |
| 1 | Postos ativos do Weboper + requisição de Operações + aprovação da Diretoria | Forma a entrada oficial do processo e valida a integração somente leitura |
| 2 | Criação, edição, descrição, requisitos, perguntas e publicação da vaga | Constrói a vaga somente a partir da requisição aprovada |
| 3 | Barreira de segurança: login, sessão e permissões | Deve estar concluída antes de currículos reais, dados pessoais ou acesso pela rede |
| 4 | Lista de vagas, Kanban, candidato, importação manual e histórico | Entrega o núcleo diário do RH com dados persistentes |
| 5 | Extração por IA, evidências, revisão, correções e duplicidades | Evolui o laboratório existente depois que candidato e vaga estiverem sólidos |
| 6 | Entradas e comunicação: Gmail/Rio Vagas, KingHost, Quickin e WhatsApp | Cada canal passa a alimentar o mesmo candidato/candidatura, com idempotência e auditoria |
| 7 | Mobilidade com Google Maps, ida/volta, conduções e custos | Depende de endereço confirmado, posto sincronizado, vaga e escala |
| 8 | Entrevistas, questionários, Agenda e decisões humanas | Usa o modal, o histórico e as perguntas já implementados |
| 9 | Documentos, treinamento e contratação | Fecha o processo depois que permissões e auditoria estão maduras |
| 10 | Banco de Talentos, relatórios, integrações/erros e administração | Consolida busca, gestão, operação e observabilidade após o fluxo principal funcionar |
| 11 | Piloto interno, backup, recuperação, controle de custos e implantação | Liberação controlada com dados reais somente após testes funcionais e de proteção |

## Marcos do MVP interno

### Marco A — Processo de vaga

Fases 0 a 2. Operações solicita, Diretoria aprova e RH cria/publica a vaga usando somente postos ativos. Durante o desenvolvimento sem login, usar apenas dados sintéticos e execução local restrita.

### Marco B — Recrutamento utilizável

Fases 3 a 5. Depois da barreira de segurança, o RH importa currículo, revisa a extração, adiciona ao Kanban, movimenta etapas e consulta histórico.

### Marco C — Diferenciais e entradas reais

Fases 6 a 8. Currículos entram pelos canais validados, questionários são enviados conforme as regras do canal e mobilidade é calculada sem inventar rotas ou tarifas.

### Marco D — Processo completo

Fases 9 a 11. Documentos, treinamento, contratação, relatórios e piloto interno controlado.

## Regra de execução

Cada fase terá plano próprio, testes automatizados e demonstração funcional. Não avançar para a fase seguinte com falhas críticas, migração irreversível não revisada ou ausência de controle de acesso sobre dados pessoais.
