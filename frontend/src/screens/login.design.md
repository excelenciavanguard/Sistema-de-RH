# Login — opção 3 aprovada

Superfície operacional de entrada do protótipo, aprovada em 17/09/2026. Registro limitado à tela construída, sem estabelecer regras globais para o produto.

Referência: `.impeccable/mocks/approved/login-office-approved.png`, na raiz do repositório.

- Fotografia corporativa em toda a página, sem texto na parede. O cenário é uma imagem gerada, não uma fotografia apresentada como sendo da empresa.
- Overlay verde escuro à esquerda; logotipo real Alpha RH em branco (`frontend/public/assets/Logo Rh.png`, não o logo ilustrativo do mock), título e apoio preservados da referência.
- Copy aprovada: “Pessoas no centro. Gestão com propósito.” e “Equipes mais fortes constroem amanhãs melhores.”
- Painel branco à direita, raio de 16px, sombra suave deslocada; Inter local, títulos semibold e campos com ícones Lucide.
- Usuário e senha, mostrar/ocultar senha, Manter conectado ilustrativo, ajuda de recuperação e ação Entrar. Sem login social ou cadastro.
- O formulário permanece claro mesmo com o tema escuro interno salvo; campos e títulos usam cores locais para evitar herança global.
- Em até 760px, a apresentação e o formulário passam para uma coluna, com rolagem vertical normal e campos de 16px para leitura e preenchimento em celular.
- No celular, o overlay verde uniforme (`rgba(5,31,32,.68)`) cobre a fotografia inteira para preservar o contraste da mensagem. Foco de teclado sólido em `#235347`, com contorno de 3px e afastamento de 3px, visível no painel branco.

## Limite funcional

Não há autenticação: campos não vazios apenas abrem a página inicial demonstrativa; o formulário é limpo antes da navegação. Nenhuma senha ou credencial é persistida ou enviada ao backend. O formulário informa esse limite. Recuperação orienta procurar o administrador, sem simular envio de mensagem. A raiz sem hash e `#/login` abrem a entrada; rotas internas continuam abertas para avaliação do protótipo.

## Arquivos

- `LoginScreen.tsx`: conteúdo semântico, estados do formulário e navegação demonstrativa.
- `login.css`: composição responsiva e compatibilidade com tema interno.
- `LoginScreen.test.jsx`: rotas, validação, entrada e recuperação/visibilidade.
- `frontend/public/assets/login/office-background.png`: cenário produzido a partir do mock, com prompt exato embutido e salvo no arquivo irmão.
- `.impeccable/review/login/desktop.png` e `mobile.png`: evidência visual da tela construída.
