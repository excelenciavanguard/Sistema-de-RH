# Extração de currículo para o Kanban

## Objetivo

Permitir que o RH transforme um resultado de extração escolhido em um candidato persistente da vaga atual e o exiba imediatamente na coluna **Novos**. A criação do registro não representa aprovação ou recomendação da IA; o candidato entra com revisão humana pendente.

## Escopo aprovado

- Após uma extração válida, exibir **Adicionar ao Kanban** em cada resultado concluído.
- Ao clicar, criar ou localizar o candidato no banco próprio do Alpha RH usando somente o provedor escolhido.
- Criar a candidatura vinculada à vaga aberta no Kanban.
- Definir a etapa inicial como `new` e a situação de revisão como `pending`.
- Relacionar candidatura, arquivo original, processamento e resultado estruturado do Gemini.
- Retornar o candidato no mesmo resultado do upload para inclusão imediata no Kanban.
- Ao recarregar a página, buscar no backend os candidatos persistidos para a vaga.
- Não alterar nem gravar no banco do Weboper.

## Modelo de dados

### `vacancies`

Representa a vaga que recebe candidaturas. Para o laboratório será criada a vaga `2026-0157`, “Auxiliar de Serviços Gerais · Leblon Power”.

Campos mínimos: identificador, código público único, título, posto, situação e datas de criação/atualização.

### `candidates`

Representa a pessoa independentemente de uma vaga.

Campos mínimos: identificador, nome, localidade, experiência, escolaridade, disponibilidade e datas. Os campos extraídos continuam pendentes de confirmação humana.

### `applications`

Relaciona candidato e vaga. Contém etapa do Kanban, situação da revisão, fonte, responsável e datas. A combinação de candidato e vaga é única.

### Ligação com a extração

`extraction_jobs` receberá uma referência opcional para a candidatura criada. O currículo original continuará em `resume_files`; a saída completa e validada continuará em `extraction_results`.

## Fluxo

1. O frontend envia o currículo e o provedor para extração.
2. O backend valida e armazena o original, extrai o texto e consulta o Gemini.
3. O frontend mostra os resultados concluídos; nenhum deles entra automaticamente no Kanban.
4. O RH clica em **Adicionar ao Kanban** no resultado da OpenAI ou do Gemini.
5. O backend recebe processamento, provedor escolhido e código da vaga, e executa em uma única transação:
   - cria ou encontra o candidato associado ao mesmo arquivo;
   - cria ou encontra sua candidatura à vaga;
   - vincula o processamento à candidatura;
   - mantém a etapa `new` e a revisão `pending`.
6. A resposta inclui um resumo seguro do candidato, sem caminho interno do arquivo.
7. O frontend adiciona o resumo à coluna **Novos** sem recarregar a página.
8. Na inicialização, o frontend consulta as candidaturas persistidas e as combina com os dados demonstrativos enquanto o protótipo ainda estiver ativo.

## Duplicidade

Nesta entrega, duplicidade exata será determinada pelo SHA-256 do arquivo original:

- mesmo arquivo e mesma vaga: reutiliza a candidatura e não cria outro card;
- mesmo arquivo em outra vaga: reutiliza o candidato e cria outra candidatura;
- arquivo diferente da mesma pessoa: não será unido automaticamente apenas pelo nome; ficará disponível para futura revisão de possível duplicidade.

## Estados e erros

- Falha na extração de texto: processamento fica em revisão, sem criar candidato no Kanban.
- Falha ou resposta inválida do provedor: processamento fica com erro, sem criar candidato incompleto.
- Resultado válido sem nome: cria o card como “Nome não informado”, destacado para revisão.
- Vaga inexistente ou inativa: retorna erro controlado e não cria candidatura.
- Falha ao persistir candidato/candidatura: toda a transação é revertida; o arquivo e o erro permanecem rastreáveis conforme o estado do processamento.

## Interface

- Cada provedor concluído mostrará **Adicionar ao Kanban**.
- Após o clique, o laboratório informará “Candidato adicionado em Novos”.
- Em **Comparar ambos**, somente o resultado escolhido pelo RH será usado.
- Um upload duplicado informará “Candidato já estava no Kanban” e manterá apenas um card.
- O card novo usará os campos extraídos disponíveis e estados neutros para dados ainda não calculados, como “Mobilidade pendente”.
- A ficha do candidato exibirá dados não informados como “Não informado”, nunca como reprovação.

## Segurança e privacidade

- Nenhuma credencial ou caminho de armazenamento será retornado ao frontend.
- Logs e auditoria registrarão identificadores e estados, sem copiar o conteúdo do currículo.
- O laboratório permanece acessível apenas localmente nesta fase.
- O currículo não será enviado novamente ao Gemini ao apenas listar ou abrir o Kanban.

## Verificação

- Testes de migração e restrições de unicidade.
- Testes do serviço de criação/reutilização de candidato e candidatura.
- Teste da API comprovando criação na primeira importação e reutilização na segunda.
- Teste do frontend comprovando entrada em **Novos**, contador atualizado e ausência de card duplicado.
- Teste manual com o currículo fictício antes de liberar o teste com dados pessoais.
