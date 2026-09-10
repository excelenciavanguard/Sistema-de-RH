# Backend do laboratório de extração — desenho técnico

## Escopo confirmado

Esta etapa implementa somente o backend necessário para testar currículos reais no laboratório comparativo já existente. O restante do ATS permanece fora desta entrega.

Stack confirmada: Python 3.12, FastAPI e MySQL 8.4 instalados no Windows. O banco próprio será `alpha_rh`, separado do MySQL do Weboper. Nenhuma operação de escrita será feita no Weboper.

## Componentes

- API FastAPI versionada em `/api/v1`.
- Persistência MySQL com SQLAlchemy 2 e migrações Alembic.
- Armazenamento privado em `backend/var/uploads`, fora de qualquer pasta pública.
- Serviço de validação de arquivo por extensão, tamanho, MIME detectado e assinatura binária.
- Serviço de extração local para PDF com texto, DOCX e TXT. DOC legado é aceito, mas pode retornar `needs_review` quando não houver extração segura.
- Adaptadores independentes para OpenAI e Gemini.
- Validação da resposta estruturada com Pydantic antes de persistir ou devolver ao frontend.

## Fluxo

1. O frontend envia um arquivo e o provedor desejado.
2. A API valida o arquivo e calcula SHA-256.
3. Arquivo idêntico reutiliza a extração existente, mantendo um novo registro de tentativa quando necessário.
4. O original é salvo com UUID e sem nome fornecido pelo candidato no caminho físico.
5. O texto é extraído localmente.
6. Se o provedor ainda não estiver configurado, a execução fica em `provider_not_configured` sem resultado fictício.
7. Quando as chaves forem fornecidas, o adaptador envia somente o conteúdo necessário, recebe saída estruturada, valida e persiste o resultado.

## Dados

Tabelas iniciais:

- `resume_files`: metadados, hash, formato, tamanho e caminho privado.
- `extraction_jobs`: estado, provedor solicitado, timestamps e erro sanitizado.
- `extraction_results`: dados estruturados, evidências, perguntas e metadados do provedor.
- `audit_events`: eventos técnicos mínimos sem conteúdo integral do currículo.

## API inicial

- `GET /api/v1/health`
- `GET /api/v1/providers`
- `POST /api/v1/extractions`
- `GET /api/v1/extractions/{job_id}`

## Segurança

- API vinculada inicialmente a `127.0.0.1`.
- CORS restrito a `http://localhost:4173`.
- Limite inicial de 12 MB.
- Nomes físicos aleatórios, prevenção de path traversal e nenhuma rota pública para arquivos.
- Segredos somente em `.env`, ignorado pelo controle de versão.
- Senha do banco gerada localmente; a conversa não receberá o segredo.
- Logs não registrarão texto do currículo, chave de API ou senha.

## Erros e estados

Estados previstos: `uploaded`, `extracting`, `ready_for_provider`, `completed`, `needs_review`, `provider_not_configured` e `failed`.

Arquivos vazios, corrompidos, protegidos por senha, incompatíveis ou com extração duvidosa não gerarão conteúdo inventado. O erro devolvido ao frontend indicará a ação necessária.

## Verificação

- Testes unitários de validação, hash e extração.
- Testes de API para upload válido, formato inválido, tamanho, duplicidade e provedor ausente.
- Migração aplicada em banco MySQL exclusivo.
- Teste integrado do frontend com a API local sem chave de provedor.

