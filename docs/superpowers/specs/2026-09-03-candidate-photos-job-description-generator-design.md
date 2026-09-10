# Fotos de candidatos e gerador de descrição de vagas

## Objetivo

Acrescentar duas capacidades ao sistema de recrutamento:

1. Mostrar nos cartões do Kanban a foto encontrada no currículo, desde a entrada do candidato na coluna “Novos”.
2. Permitir que o RH gere, revise, versione e reaproveite descrições completas de vagas a partir de dados estruturados.

As duas capacidades devem reduzir trabalho operacional sem transferir à IA decisões sobre candidatos ou autorização para publicar vagas.

## Escopo

### Foto do candidato

- A origem inicial da foto será exclusivamente o currículo importado pelo sistema.
- A extração tentará localizar uma imagem compatível com retrato em PDF, Word ou imagem digitalizada.
- O arquivo original do currículo continuará preservado sem alterações.
- O sistema produzirá uma miniatura derivada para uso na interface.
- A miniatura aparecerá no cartão desde a coluna “Novos” e no cabeçalho do modal 360.
- Quando não houver foto ou a extração falhar, serão exibidas as iniciais do candidato.
- O RH poderá remover a associação incorreta e retornar à exibição das iniciais.
- A foto não será enviada à OpenAI ou a outro modelo de análise.
- A foto não poderá ser usada em filtros, busca, pontuação, ordenação, recomendação ou compatibilidade.
- Os logs registrarão o resultado técnico da extração sem copiar a imagem ou descrever características da pessoa.

### Gerador de descrição

O gerador trabalhará somente com dados estruturados informados pelo RH. A IA redigirá e organizará esses dados, mas não criará fatos ausentes.

O fluxo será:

1. O RH cria ou duplica uma vaga em rascunho.
2. Preenche os campos estruturados.
3. Seleciona os blocos que deseja incluir no texto.
4. Seleciona tom, tamanho e linguagem.
5. Solicita a geração.
6. Revisa o texto ao lado dos dados de origem.
7. Edita, salva ou solicita nova versão.
8. Envia a vaga para aprovação da diretoria.
9. Somente após aprovação a vaga pode ser publicada.

## Catálogo inicial de blocos

O RH poderá selecionar:

- Apresentação da empresa.
- Título da vaga.
- Objetivo da função.
- Posto e endereço.
- Quantidade de vagas.
- Principais atividades.
- Requisitos obrigatórios.
- Requisitos desejáveis.
- Experiência necessária.
- Escolaridade.
- Cursos e certificações.
- CNH e categoria.
- Conhecimentos de informática.
- Tipo de contratação: CLT, PJ, temporário, intermitente, estágio ou aprendiz.
- Modelo presencial, híbrido ou remoto.
- Escala e dias de trabalho.
- Horário de entrada e saída.
- Salário: exibir valor, ocultar ou informar “a combinar”.
- Benefícios.
- Disponibilidade para finais de semana e feriados.
- Necessidade de viagem.
- Exigências físicas ou equipamentos relacionados às atividades.
- Data prevista de início.
- Etapas do processo seletivo.
- Perguntas da candidatura.
- Informações aprovadas de acessibilidade e inclusão.
- Instruções para candidatura.

O catálogo será configurável no futuro, mas a primeira versão usará essa lista controlada para manter consistência e auditabilidade.

## Controles de redação

- Tom: formal, direto ou acolhedor.
- Tamanho: curto, padrão ou detalhado.
- Linguagem: simples ou corporativa.

Esses controles afetam apenas a redação. Não alteram requisitos, remuneração, benefícios, contrato, escala ou qualquer outro fato da vaga.

## Prevenção de conteúdo inventado

- O backend enviará à IA somente os campos selecionados e seus valores.
- A resposta será estruturada por bloco e validada antes de compor o texto final.
- Um bloco selecionado sem dados será marcado como pendente; a IA não preencherá a lacuna.
- Salário, benefícios, endereço, escala, horários, contratação, requisitos e quantidade terão validação direta contra os valores estruturados.
- Divergências serão destacadas para revisão e impedirão o envio para aprovação.
- A IA não publicará ou aprovará a vaga.

## Histórico e versões

Cada geração ou salvamento manual criará uma versão imutável contendo:

- Identificador da vaga e da versão.
- Data e horário.
- Usuário responsável.
- Origem: geração por IA, edição humana, restauração ou duplicação.
- Blocos selecionados.
- Controles de redação utilizados.
- Texto resultante.
- Diferenças em relação à versão anterior.

A aba “Histórico” permitirá visualizar, comparar e restaurar versões. A restauração criará uma nova versão e não apagará o histórico anterior.

## Duplicação de vaga

“Duplicar vaga” copiará todos os campos e a descrição escolhida, incluindo posto, salário, benefícios, escala, contrato, requisitos e questionário.

A nova vaga:

- Receberá novo identificador.
- Começará em rascunho.
- Guardará referência à vaga de origem.
- Marcará os campos copiados para revisão do RH.
- Não herdará aprovação nem estado de publicação.
- Passará novamente pela aprovação obrigatória da diretoria.

## Componentes e responsabilidades

- Serviço de documentos: identifica e extrai a imagem candidata a miniatura.
- Armazenamento privado: guarda original e derivadas com controle de acesso por empresa.
- API de candidatos: fornece URL temporária ou resposta autorizada para a miniatura.
- Editor de vaga: mantém campos estruturados e seleção de blocos.
- Serviço de geração: monta a solicitação estruturada, chama o modelo e valida a resposta.
- Serviço de versões: persiste o histórico imutável e calcula diferenças.
- Fluxo de aprovação: impede publicação antes da decisão da diretoria.

Cada componente deve respeitar o isolamento de dados entre empresas.

## Falhas e recuperação

- Foto ausente ou ilegível: exibir iniciais e registrar falha reprocessável.
- Foto associada incorretamente: permitir remoção manual, preservando auditoria.
- Falha da IA: manter o rascunho e permitir nova tentativa sem duplicar versões incompletas.
- Resposta inválida: rejeitar a geração e mostrar quais blocos falharam.
- Divergência factual: bloquear envio para aprovação até correção.
- Falha ao salvar versão: não substituir silenciosamente a versão anterior.
- Duplicação parcial: cancelar a operação para evitar vaga inconsistente.

## Segurança e privacidade

- Currículos e miniaturas serão privados e acessíveis apenas a usuários autorizados da empresa correspondente.
- URLs de imagem não serão públicas e permanentes.
- A foto não será registrada em logs, analytics ou payloads da IA.
- Toda visualização e alteração relevante seguirá as regras de auditoria do produto.
- A retenção da miniatura acompanhará a política definida para o currículo de origem.

## Testes necessários

- Currículo com foto válida gera miniatura e mantém o original intacto.
- Currículo sem foto mostra iniciais.
- Falha de extração não impede a criação do candidato.
- Foto nunca aparece no payload enviado à IA.
- Usuário de outra empresa não acessa a miniatura.
- Gerador inclui somente blocos selecionados.
- Campos ausentes geram pendência, não conteúdo inventado.
- Valores de salário, escala, contrato e benefícios permanecem iguais aos dados estruturados.
- Cada geração e edição cria uma versão auditável.
- Restauração não apaga versões anteriores.
- Duplicação copia todos os campos, cria novo identificador e volta para rascunho.
- Vaga duplicada não pode ser publicada sem nova aprovação.

## Critérios de aceite

- O RH identifica visualmente candidatos com foto desde “Novos”, sem usar imagem em análise automatizada.
- O RH monta uma descrição selecionando blocos e controles de redação.
- A IA não preenche dados que não foram fornecidos.
- O RH consegue editar, comparar, restaurar e reaproveitar descrições.
- A diretoria continua sendo a única etapa de aprovação anterior à publicação.
