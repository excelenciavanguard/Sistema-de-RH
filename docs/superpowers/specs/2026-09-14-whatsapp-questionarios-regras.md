# Alpha RH — regras de WhatsApp para questionários complementares

Data: 14/09/2026. Situação: proposta documental, sem implementação ou envio. Escopo: uso interno.

Este documento detalha AUT-007 e as pendências AUT-010 da especificação mestre. Não autoriza migração de número, contratação de fornecedor ou disparos reais. O objetivo é reduzir contato indesejado, duplicação e restrições; não existe garantia de ausência de bloqueio.

## 1. Contexto e limites da pesquisa

Confirmado pelo usuário: recebimento de mais de 1.000 currículos, por vários canais. Não foi confirmado se esse volume é diário, mensal ou acumulado. Currículos, pessoas únicas, candidaturas e destinatários autorizados são contagens diferentes.

Fontes consultadas em 14/09/2026:

- [Meta — política de mensagens](https://whatsappbusiness.com/policy/): autorização, janela de atendimento, modelos e atendimento humano.
- [AWS — template pacing](https://docs.aws.amazon.com/social-messaging/latest/userguide/managing-templates-pacings.html): retenção de mensagens para observar feedback.
- [Infobip — modelos e qualidade](https://www.infobip.com/docs/whatsapp/compliance/template-compliance): estados de modelos, qualidade e controle de envio no portfólio.
- [AWS — limites](https://docs.aws.amazon.com/social-messaging/latest/userguide/increase-message-limit.html): limites e janela móvel. A página ainda descreve níveis por número; não é utilizada aqui para fixar níveis atuais da Meta.

As páginas técnicas da Meta sobre [limites](https://developers.facebook.com/docs/whatsapp/messaging-limits/) e [erros](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes/) retornaram HTTP 429 na consulta. Não foram tratadas como documentação lida. Limites numéricos, escopo de compartilhamento de cota e códigos de erro serão conferidos na conta e na documentação vigente antes da implementação. Fontes de fornecedores não substituem a configuração real da Meta.

## 2. Requisitos externos confirmados na política

As cinco regras abaixo resumem a [política oficial da Meta](https://whatsappbusiness.com/policy/):

- **WA-01:** para contatos iniciados pela empresa, exigir número fornecido e autorização para comunicações subsequentes. Telefone no currículo não comprova autorização.
- **WA-02:** respeitar pedidos de interrupção, inclusive recebidos fora do WhatsApp.
- **WA-03:** responder livremente apenas dentro de 24 horas da última mensagem do usuário. Fora da janela, usar modelo aprovado.
- **WA-04:** modelos podem ser revistos, pausados ou rejeitados pela Meta.
- **WA-05:** automação deve oferecer acesso claro a atendimento humano. Perfil empresarial deve identificar corretamente a empresa.

## 3. Regras propostas para o Alpha RH

Todos os parâmetros abaixo são decisões de produto propostas, pendentes de validação pelo RH. Não são uma receita da Meta nem um volume garantido contra bloqueio.

### Autorização e identificação

- **WA-06:** guardar origem, data, finalidade e versão do texto aceito. A autorização deve abranger o acompanhamento da candidatura; novas campanhas de vagas exigem escopo adequado. Não marcar caixas previamente nem presumir autorização de currículos encaminhados por funcionários.
- **WA-07:** quando a pessoa iniciar uma conversa, permitir atendimento contextual na janela aberta. Não transformar essa iniciativa em autorização permanente para campanhas futuras. Registrar autorização para acompanhamentos posteriores.
- **WA-08:** cadastro sem prova de autorização não entra na fila de contato iniciado pelo RH. Disponibilizar o formulário e a escolha de canal na candidatura ou no canal de origem, quando este permitir. Não enviar WhatsApp não solicitado apenas para pedir autorização de WhatsApp.
- **WA-09:** manter suspensão de contato por destinatário. Reconhecer SAIR, PARAR, CANCELAR e linguagem equivalente; pedido ambíguo suspende automação até leitura humana. Receber novo currículo não reativa a permissão automaticamente. Interromper WhatsApp não desclassifica a candidatura.
- **WA-10:** telefone ajuda a localizar cadastro, mas não prova identidade. Números compartilhados, trocados e currículos enviados por terceiros exigem conferência antes de expor dados ou associar mensagens. Não unir pessoas só por nome ou telefone.

### Questionário individual

- **WA-11:** IA seleciona perguntas de um conjunto profissional definido pelo RH na vaga. Dado não encontrado é pendência, não reprovação. Dúvida de extração gera pedido de confirmação, sem afirmar que a pessoa não possui a qualificação.
- **WA-12:** proposta inicial: até cinco perguntas por solicitação, reunidas em um formulário. Se houver mais, priorizar as necessárias para a etapa e deixar o restante para revisão humana. Evitar perguntar novamente o que já foi confirmado. Não gerar perguntas sobre características pessoais sem relação com o trabalho.
- **WA-13:** mensagem identifica empresa, candidatura e propósito. Link HTTPS individual no domínio da empresa, token opaco e sem nome, telefone ou CPF na URL. Proposta: validade de sete dias, revogação após conclusão e possibilidade de reabertura pelo RH. Não colocar currículo ou documentos pessoais acessíveis diretamente pelo link.
- **WA-14:** um ciclo por solicitação: uma mensagem inicial e no máximo um lembrete após 48 horas da entrega confirmada. Nenhum lembrete sem confirmação de entrega. Qualquer resposta, preenchimento, desistência, encerramento da vaga ou descadastramento cancela o lembrete. Resposta incompleta vai para acompanhamento humano.
- **WA-15:** limitar mensagens automáticas de questionário a uma por destinatário em 24 horas e duas em sete dias, somando todas as vagas. Reenvio de currículo e nova versão da extração não reiniciam esses contadores. Solicitação explícita de reenvio pelo candidato pode ser atendida e registrada pelo RH.
- **WA-16:** proativamente enviar em dias úteis, de 09h a 18h no horário do destinatário; no piloto regional, America/Sao_Paulo. Atendimento iniciado pela pessoa pode ocorrer fora desse horário. Esse horário é uma proposta operacional, não exigência da Meta.

### Modelos e envio

- **WA-17:** criar modelos específicos para complemento de candidatura e lembrete; submeter à Meta antes de usar fora da janela. A categoria Utility é hipótese para atualização de candidatura existente, não aprovação garantida. Convites para outras vagas não serão disfarçados de atualização transacional.
- **WA-18:** revisão da IA ocorre antes da fila. Imediatamente antes de transmitir, revalidar: autorização/contexto, suspensão, vaga aberta, pergunta ainda pendente, limites por pessoa, horário, validade do link, janela e modelo, qualidade, cota e orçamento. Esperar na fila pode fazer a janela de 24 horas expirar.
- **WA-19:** fila central coordena todos os usuários e automações. Separar cota de destinatários na janela móvel, velocidade técnica e retenções por qualidade. Incluir consumo de outros sistemas/números quando compartilharem a cota. Se consumo externo ou limite forem desconhecidos, suspender novos lotes proativos até reconciliação.
- **WA-20:** usar o menor orçamento entre cota disponível validada, teto do piloto, capacidade de atendimento do RH e orçamento financeiro. Não fixar 1.000 envios por dia nem supor que o limite reinicia à meia-noite. Volume recebido não gera obrigação de enviar questionário a todos.
- **WA-21:** registrar solicitação, mensagem, identificador do provedor e estados preparado, na fila, aceito, retido, entregue, lido, respondido, falhou e cancelado, conforme eventos disponíveis. Aceito não significa entregue. Ausência de leitura não comprova desinteresse.
- **WA-22:** impedir dupla emissão por clique, evento repetido, duas pessoas do RH ou vários workers. Em timeout com resultado incerto, aguardar reconciliação antes de reenviar. Mensagem retida pela Meta não deve ser duplicada. Para falha temporária confirmada, no máximo duas novas tentativas com espera progressiva, respeitando o provedor e revalidando WA-18. Falha permanente, restrição ou pausa não têm repetição automática.

### Pausas, controle e revisão

AWS documenta que a Meta pode reter mensagens para avaliar feedback antes de liberar mais envios. Portanto, retenção será tratada como espera, não falha. [Fonte](https://docs.aws.amazon.com/social-messaging/latest/userguide/managing-templates-pacings.html).

Infobip documenta estados ativos, pausados e desabilitados e controles de qualidade por modelo e portfólio. Nem todo indicador permite identificar individualmente quem bloqueou ou denunciou; não inferiremos essa identidade. [Fonte](https://www.infobip.com/docs/whatsapp/compliance/template-compliance).

- **WA-23:** qualidade média: suspender expansão do piloto e revisar público/texto. Qualidade baixa: interromper novos questionários automáticos no escopo afetado. Modelo pausado/desabilitado: interromper suas mensagens. Restrição de conta/portfólio: interromper todos os envios abrangidos. Atendimento humano só continua se permitido pela plataforma.
- **WA-24:** qualidade ainda pendente em modelo aprovado permite apenas piloto controlado. Falta de consulta válida de status ou de monitoramento impede liberar novos lotes. Retomada exige causa registrada, status permitido e liberação pelo responsável; não trocar número ou modelo para contornar restrição.
- **WA-25:** painel de integração apresenta fila, motivo de espera, cota validada e horário da consulta, qualidade, entregas/falhas, respostas, formulários concluídos, descadastros e custo. Métricas de bloqueio/denúncia somente quando disponibilizadas pelo fornecedor. Alertas de qualidade criam tarefa para o RH; não inventar percentuais oficiais de tolerância.
- **WA-26:** no modal do candidato, mostrar questionário, pendências, histórico de comunicação, autorização e motivo de eventual bloqueio de envio. Botões Enviar questionário, Cancelar envio e Assumir atendimento devem obedecer às mesmas regras da fila. Não exige nova tela operacional de templates.

## 4. Mensagens propostas para submissão

Convite, ainda não aprovado pela Meta:

> Olá, {{1}}! Aqui é o RH da Alpha Serviços. Para continuar sua candidatura à vaga {{2}}, precisamos confirmar algumas informações profissionais. Responda pelo botão abaixo. Se precisar de ajuda, responda esta mensagem. Para parar os contatos pelo WhatsApp, responda SAIR.

Botão: Completar candidatura. URL individual, cadastrada conforme o modelo permitido pelo fornecedor.

Lembrete, ainda não aprovado pela Meta:

> Olá, {{1}}! Seu questionário da candidatura à vaga {{2}} ainda está pendente. Se quiser continuar, use o botão abaixo. Precisa de ajuda? Fale com o RH por aqui. Para parar os contatos pelo WhatsApp, responda SAIR.

Campos variáveis vêm de dados revisados, não de instruções contidas no currículo. Nunca afirmar contratação garantida, criar urgência falsa ou cobrar para participar.

## 5. Piloto e volume de mais de mil currículos

Proposta de piloto: 25 destinatários elegíveis, com autorização comprovada, distribuídos na fila e dentro do limite real da conta. Observar entregas, respostas, qualidade e capacidade do RH por pelo menos 48 horas. Esse número foi escolhido para permitir revisão humana; não é limite oficial nem garante ausência de bloqueio.

Se monitoramento estiver estável, sem alertas pendentes e com capacidade de atendimento, o responsável pode liberar o próximo lote de até 50. Não aumentar automaticamente por passagem do tempo. Qualidade pendente impede expansão até avaliação do fornecedor ou evidência suficiente para revisão responsável. O piloto não dispara mensagem só para obter aumento de cota.

Exemplo hipotético de planejamento, sem representar dados reais: 1.200 arquivos podem resultar em 900 pessoas; 400 precisam completar dados e 250 têm autorização válida para contato. Apenas os 250 entram na avaliação de envio. Os demais permanecem no processo pelo canal apropriado. Distribuição em dias depende da cota, da janela, dos horários e do atendimento; não há prazo de disparo prometido.

Pendências: periodicidade do volume; tipo e controle do número atual; conta/portfólio e consumo por outros sistemas; fornecedor; limites e qualidade reais; textos autorizados; classificação/aprovação dos modelos; orçamento; responsável por responder e acompanhar alertas.

## 6. Critérios de aceite para futura implementação

1. Importar 1.000 currículos não dispara 1.000 mensagens automaticamente.
2. Ausência de autorização bloqueia início proativo; atendimento contextual a mensagem recebida segue a janela.
3. Descadastramento cancela inclusive mensagens já enfileiradas, ainda não transmitidas.
4. Janela expirada na espera exige modelo válido ou mantém envio pendente.
5. Pergunta respondida, vaga encerrada ou candidato que respondeu cancela lembrete.
6. Eventos repetidos e execução concorrente não geram duas solicitações iguais.
7. Timeout incerto e retenção não provocam reenvio cego.
8. Falha de cota, status ou orçamento mantém registro e motivo de espera, sem contornar controles.
9. Restrição de modelo pausa só seu escopo; restrição compartilhada pausa todo o escopo correspondente.
10. Duas candidaturas da mesma pessoa respeitam o teto global de contato.
11. RH pode assumir a conversa; IA não decide rejeição por silêncio ou por bloqueio do canal.
12. O candidato acessa apenas seu formulário; logs de operação não contêm currículo, respostas completas ou token do link.

## 7. Situação final

Pesquisa e regras documentadas. Parâmetros internos propostos; acesso, capacidade, aprovação dos modelos e integração ainda pendentes. Nenhuma mensagem enviada, conta configurada ou funcionalidade implementada nesta tarefa.
