# Alpha RH — backend do laboratório de extração

API local FastAPI com MySQL próprio. O banco do Weboper não é usado por este serviço.

## Fluxo disponível

- Validação e armazenamento privado de currículos PDF com texto, DOCX e TXT.
- Extração estruturada por Gemini e OpenAI, quando a conta possuir chave e cota.
- Em **Comparar ambos**, os resultados permanecem separados.
- O RH escolhe um resultado concluído e clica em **Adicionar ao Kanban**.
- A candidatura entra em **Candidatura** com revisão pendente e permanece após recarregar a página.
- O mesmo arquivo na mesma vaga reutiliza a candidatura existente, sem criar outro card.

PDF digitalizado e imagens ainda não possuem OCR nesta versão. Arquivos `.doc` antigos seguem para revisão.

## Execução local

1. Execute `scripts/start-mysql.ps1`.
2. Execute `scripts/start-backend.ps1`.
3. Acesse `http://127.0.0.1:8000/docs`.

As credenciais ficam em `.env` e não devem ser compartilhadas nem versionadas.

Novos currículos adicionados ao processo entram na etapa **Candidatura**. O pipeline padrão segue: Candidatura, Triagem, Contato, Entrevista RH, Entrevista Gestor, Pesquisa, Entrega de documentos, Treinamento e Contratação.
