# 📋 Sequência de Prompts - mycash+ Dashboard

## 🎯 PROMPT 0: Análise e Planejamento Inicial ✅
**Status:** Concluído
- [x] Mapeamento de componentes visuais
- [x] Identificação de variáveis do design system
- [x] Análise da estrutura de navegação
- [x] Definição da arquitetura proposta

---

## 🏗️ PROMPT 1: Estrutura Base e Configuração

**Objetivo:** Criar a estrutura base do projeto com todas as configurações necessárias.

**Tarefas:**
1. Configurar estrutura de pastas seguindo boas práticas de arquitetura React
2. Criar diretórios: components, contexts, hooks, types, utils, constants
3. Organizar subpastas dentro de components por domínio: layout (sidebar, header), dashboard, cards, modals
4. Configurar Tailwind CSS para reconhecer e utilizar as variables do Figma como classes customizadas
5. Garantir que todos os tokens semânticos e primitivos estejam mapeados corretamente no arquivo de configuração do Tailwind
6. Criar os tipos TypeScript fundamentais que representam as cinco entidades principais:
   - Transaction (tipo: "income" | "expense")
   - Goal
   - CreditCard
   - BankAccount
   - FamilyMember
7. Cada tipo deve conter todos os campos descritos na documentação, com tipagens precisas incluindo tipos de união onde apropriado
8. Configurar React Router para gerenciar as cinco rotas principais do sistema
9. Manter o conceito de single page application onde apenas o conteúdo central muda

**Requisitos de Responsividade:**
- Desktop (≥1024px): [comportamento]
- Tablet (641-1023px): [comportamento]
- Mobile (≤640px): [comportamento]

**Entregáveis:**
- Estrutura de pastas completa e organizada
- Tailwind configurado com tokens do Figma
- Tipos TypeScript completos para todas as entidades
- React Router configurado e funcionando

---

## 🎨 PROMPT 2: Design Tokens e Sistema de Cores

**Objetivo:** Extrair e implementar todos os tokens do design system do Figma.

**Tarefas:**
1. Consultar Figma para tokens primitivos (cores, espaçamentos, tipografia, shapes)
2. Consultar Figma para tokens semânticos
3. Criar arquivo `styles/tokens.css` com todas as variáveis
4. Mapear tokens no Tailwind config (quando necessário)
5. Documentar todas as conversões (hex/px → tokens)
6. Criar utilitário `tokenMapper.ts` para conversões futuras
7. Garantir que `npm run build` passe

**Entregáveis:**
- Todos os tokens primitivos implementados
- Todos os tokens semânticos implementados
- Documentação de conversões
- Utilitário de mapeamento

---

## 📱 PROMPT 3: Sistema de Layout e Navegação Desktop

**Objetivo:** Implementar o sistema de navegação desktop com a sidebar.

**Tarefas:**
1. Criar componente Sidebar que ocupa o lado esquerdo da tela com altura total do viewport
2. Implementar dois estados visuais distintos: expandido e colapsado
3. Estado expandido: mostrar logotipo completo "mycash+", nomes das seções e informações completas do perfil do usuário
4. Estado colapsado: mostrar apenas ícone do logotipo, ícones das seções e apenas o avatar do perfil
5. Implementar lógica de alternância entre estados através de um botão circular posicionado na borda direita da sidebar
6. Ícone dentro do botão deve mudar: seta para esquerda quando expandida, seta para direita quando colapsada
7. Configurar transições suaves entre os dois estados
8. Quando a sidebar expande ou colapsa, o conteúdo principal à direita deve ajustar sua margem esquerda de forma fluida e animada
9. Todas as transições devem ter duração adequada para serem perceptíveis mas não lentas
10. Implementar sistema de tooltip que aparece ao passar o mouse sobre itens de navegação quando a sidebar está colapsada
11. Tooltip deve aparecer ao lado direito do item com leve delay e conter o nome completo da seção
12. Adicionar comportamento de item ativo: item correspondente à seção atual deve ter fundo preto com texto branco e ícone verde-limão
13. Itens inativos devem ter fundo transparente com texto cinza
14. Utilizar exclusivamente as variables do design system do Figma para todas as cores, espaçamentos, tamanhos de fonte e raios de borda
15. Priorizar sempre tokens semânticos e, quando não disponíveis, utilizar tokens primitivos

**Requisitos de Responsividade:**
- Desktop (≥1024px): [comportamento]
- Tablet (641-1023px): [comportamento]
- Mobile (≤640px): [comportamento]

**Entregáveis:**
- Sidebar funcional com dois estados
- Animações suaves de transição
- Tooltips funcionais
- Item ativo destacado

---

## 📱 PROMPT 4: Sistema de Layout e Navegação Mobile

**Objetivo:** Criar a versão mobile da navegação.

**Tarefas:**
1. Implementar componente HeaderMobile que substitui completamente a sidebar em viewports menores que 1024 pixels
2. Header deve ser fixo no topo, ocupar largura total e permanecer visível mesmo durante scroll
3. Header deve conter o logotipo "mycash+" à esquerda em tamanho apropriado para mobile
4. Avatar do usuário à direita, clicável e funcionando como trigger para o menu dropdown
5. Criar componente MenuDropdown que aparece quando o avatar é tocado
6. Menu deve deslizar de cima para baixo com animação suave e cobrir o conteúdo abaixo sem ocupar a tela inteira (não é fullscreen)
7. Dentro do dropdown, listar todos os itens de navegação com ícone e texto
8. Item da seção atual deve aparecer destacado com fundo preto
9. Adicionar botão vermelho "Sair" na parte inferior do menu para logout
10. Implementar lógica de fechamento: fechar ao clicar em qualquer item de navegação, ao clicar no botão X no canto superior direito do menu, ou ao clicar/tocar fora da área do menu no overlay escuro semi-transparente
11. Configurar breakpoints corretamente: em desktop (acima de 1024px) apenas a sidebar aparece, e em mobile/tablet (abaixo de 1024px) apenas o header aparece
12. Nunca devem aparecer simultaneamente
13. Utilizar as variables do design system para todos os estilos visuais, respeitando a hierarquia de tokens semânticos primeiro, primitivos depois

**Requisitos de Responsividade:**
- Desktop (≥1024px): [comportamento]
- Tablet (641-1023px): [comportamento]
- Mobile (≤640px): [comportamento]

**Entregáveis:**
- Header Mobile funcional
- Menu Dropdown com animação
- Renderização condicional (apenas mobile/tablet)

---

## 💾 PROMPT 5: Context Global e Gerenciamento de Estado

⚠️ **REGRA CRÍTICA:** Este sistema NÃO suporta localStorage, sessionStorage ou qualquer browser storage API. TODO o estado deve ser gerenciado EXCLUSIVAMENTE via React state (useState, useReducer). Os dados são temporários e existem apenas durante a sessão do navegador.

**Objetivo:** Criar o coração do sistema - o gerenciamento de estado global.

**Tarefas:**
1. Criar Context Provider chamado FinanceProvider que vai armazenar e gerenciar todo o estado da aplicação
2. Provider deve ser colocado no nível mais alto da árvore de componentes
3. Dentro deste context, manter os cinco arrays principais: transactions, goals, creditCards, bankAccounts e familyMembers
4. Cada array deve ser tipado corretamente com os tipos TypeScript criados anteriormente
5. Implementar funções CRUD básicas para cada entidade: adicionar novo item, atualizar item existente, deletar item
6. Estas funções devem atualizar os arrays no estado e causar re-renderização de todos os componentes dependentes
7. Criar segundo conjunto de estados para os filtros globais:
   - selectedMember (ID do membro ou null)
   - dateRange (objeto com startDate e endDate)
   - transactionType (string: "all", "income" ou "expense")
   - searchText (string para busca textual)
8. Implementar funções de cálculo derivadas que outros componentes vão consumir:
   - getFilteredTransactions: retorna array de transações após aplicar todos os filtros ativos
   - calculateTotalBalance: soma saldos de contas e subtrai faturas de cartões
   - calculateIncomeForPeriod: soma todas as receitas do período filtrado
   - calculateExpensesForPeriod: soma todas as despesas do período filtrado
   - calculateExpensesByCategory: agrupa despesas por categoria e retorna array ordenado por valor decrescente
   - calculateCategoryPercentage: para cada categoria, calcula percentual em relação à receita total
   - calculateSavingsRate: calcula (receitas - despesas) / receitas × 100
9. Criar hook customizado useFinance que encapsula o useContext e fornece acesso limpo a todo o estado e funções
10. Este hook deve ser o único ponto de acesso ao contexto em toda a aplicação
11. Popule o estado inicial com dados mock realistas: três membros da família brasileira, três cartões de bancos conhecidos, vinte a trinta transações distribuídas nos últimos três meses, quatro objetivos variados, e categorias padrão brasileiras

**Entregáveis:**
- FinanceProvider funcional
- Funções CRUD para todas as entidades
- Funções de cálculo derivadas
- Hook useFinance
- Dados mock iniciais

---

## 📊 PROMPT 6: Cards de Resumo Financeiro

**Objetivo:** Criar os três cards de resumo que aparecem no topo do dashboard.

**Tarefas:**
1. Implementar componente BalanceCard (Card de Saldo Total) com fundo completamente preto e texto branco
2. Card deve ter destaque visual através de um elemento decorativo de fundo: um círculo grande desfocado (blur intenso) na cor verde-limão com opacidade baixa, parcialmente cortado pelas bordas do card
3. No topo do card colocar label pequeno "Saldo Total" em cinza claro
4. Abaixo, em fonte muito grande, mostrar o valor do saldo total formatado como moeda brasileira completa
5. Abaixo do valor adicionar badge arredondado com fundo semi-transparente branco contendo ícone de gráfico crescente e texto mostrando crescimento percentual comparado ao mês anterior
6. Valor deve vir da função calculateTotalBalance do contexto global
7. Criar componente IncomeCard (Card de Receitas) com fundo branco e borda sutil
8. No topo à esquerda colocar label "Receitas" em preto negrito
9. No topo à direita adicionar círculo com fundo cinza claro contendo ícone de seta diagonal apontando para baixo-esquerda
10. Abaixo, em fonte grande e negrito, mostrar o valor total das receitas formatado como moeda
11. Valor deve vir da função calculateIncomeForPeriod e respeitar os filtros ativos
12. Criar componente ExpenseCard (Card de Despesas) com estrutura similar ao de receitas mas com diferenças visuais
13. Label "Despesas" em cinza médio, ícone em círculo com fundo vermelho muito claro
14. Valor deve vir de calculateExpensesForPeriod e também respeitar os filtros
15. Organizar estes três cards horizontalmente no desktop e verticalmente no mobile
16. No desktop devem ter larguras proporcionais (o card de saldo pode ser um pouco maior)
17. No mobile cada card ocupa largura total
18. Implementar animações suaves de contagem nos valores: quando um valor muda, anime de zero até o valor final em aproximadamente 800ms
19. Seguir rigorosamente a hierarquia de variáveis das Project Rules

**Entregáveis:**
- BalanceCard implementado
- IncomeCard implementado
- ExpenseCard implementado
- Animações de contagem funcionais

---

## 🎯 PROMPT 7: Header do Dashboard com Controles

**Objetivo:** Implementar a barra de controles no topo do dashboard.

**Tarefas:**
1. Criar componente DashboardHeader que contém todos os controles de filtro e ação
2. Componente deve ser uma barra horizontal responsiva
3. Implementar campo de busca à esquerda com ícone de lupa, placeholder "Pesquisar..."
4. Configurar busca em tempo real: a cada caractere digitado, disparar atualização do filtro searchText no contexto global
5. Busca deve ser case-insensitive e procurar correspondências parciais tanto na descrição quanto na categoria das transações
6. Adicionar botão de filtros ao lado da busca: botão circular com ícone de controles deslizantes
7. No desktop este botão abre um popover flutuante abaixo dele
8. No mobile abre um modal fullscreen que desliza de baixo para cima
9. Criar componente FilterPopover para desktop com fundo branco semi-transparente e efeito glassmorphism
10. Dentro colocar seção "Tipo de Transação" com três opções de rádio: "Todos", "Receitas", "Despesas"
11. A opção selecionada deve ter fundo preto com texto branco
12. Ao clicar em uma opção, atualizar imediatamente o filtro transactionType no contexto global
13. Implementar seletor de período: botão que mostra o período atual formatado como "01 jan - 31 jan, 2024"
14. Ao clicar, abrir um calendário interativo
15. No desktop mostrar dois meses lado a lado
16. No mobile mostrar um mês por vez com setas de navegação
17. Calendário deve permitir seleção de intervalo: primeiro clique define data inicial, segundo clique define data final
18. Adicionar botões de atalho rápido: "Este mês", "Mês passado", "Últimos 3 meses", "Este ano"
19. Quando o usuário confirma a seleção, atualizar o filtro dateRange no contexto
20. Criar widget de membros da família: mostrar avatares circulares dos membros parcialmente sobrepostos
21. Ao clicar em um avatar, aplicar o filtro de membro
22. Adicionar botão circular com "+" após os avatares que abre o modal de adicionar novo membro
23. No canto direito colocar botão "Nova Transação" com fundo preto e texto branco
24. No mobile este botão ocupa largura total com altura maior
25. Utilizar as variables do design system rigorosamente

**Entregáveis:**
- DashboardHeader funcional
- Campo de busca em tempo real
- FilterPopover com opções
- Seletor de período com calendário
- Widget de membros da família

---

## 🍩 PROMPT 8: Carrossel de Gastos por Categoria

**Objetivo:** Criar o widget de categorias com gráficos donut.

**Tarefas:**
1. Implementar componente ExpensesByCategoryCarousel que processa e exibe despesas agrupadas por categoria
2. Componente deve buscar os dados da função calculateExpensesByCategory do contexto global
3. Para cada categoria retornada, calcular o percentual que ela representa em relação à receita total do período usando calculateCategoryPercentage
4. Se a receita total for zero, tratar este caso retornando 0% para evitar divisão por zero
5. Criar componente CategoryDonutCard que representa visualmente cada categoria
6. Cada card deve ter fundo branco, borda cinza clara, largura fixa de 160px e altura automática
7. Cards ficam alinhados horizontalmente com espaço entre eles
8. No topo de cada card renderizar um gráfico donut com diâmetro de 64 pixels
9. Donut deve ter anel externo colorido representando o percentual e anel interno vazio (branco)
10. Cor do anel externo vem de um array de cores que rota: primeira categoria verde-limão, segunda preta, terceira cinza médio
11. No centro exato do donut, sobreposto, mostrar o percentual calculado em texto formatado com uma casa decimal
12. Abaixo do donut, centralizado, mostrar o nome da categoria em texto pequeno
13. Se o nome for muito longo, truncar com reticências
14. Abaixo do nome mostrar o valor total da categoria formatado como moeda brasileira
15. Configurar o carrossel para ser scrollável horizontalmente
16. Implementar três formas de navegação: mouse wheel, clique e arrasta, e setas de navegação
17. As setas devem aparecer quando o mouse está sobre a área do carrossel
18. Adicionar gradiente de máscara nas bordas: borda esquerda e direita do carrossel ficam progressivamente transparentes
19. Implementar hover nos cards individuais: quando o mouse passa, borda muda de cinza clara para verde-limão
20. No mobile remover as setas de navegação e permitir apenas scroll por toque/deslize
21. Utilizar variables do design system para todas as cores, espaçamentos e tamanhos

**Entregáveis:**
- ExpensesByCategoryCarousel implementado
- CategoryDonutCard com gráfico donut
- Navegação do carrossel funcional
- Gradientes de máscara aplicados

---

## 📈 PROMPT 9: Gráfico de Fluxo Financeiro

**Objetivo:** Criar o gráfico de evolução de receitas e despesas.

**Tarefas:**
1. Implementar componente FinancialFlowChart usando uma biblioteca de gráficos que suporte gráficos de área responsivos (sugestão: Recharts)
2. Componente deve ser um card grande contendo título, legenda e o gráfico
3. No topo do card colocar título "Fluxo Financeiro" com ícone de gráfico crescente à esquerda
4. À direita adicionar legenda horizontal mostrando dois itens: círculo pequeno verde-limão com texto "Receitas" e círculo preto com texto "Despesas"
5. Configurar gráfico com altura fixa de 300 pixels e largura responsiva ocupando 100% do card
6. Fundo deve ser cinza claro muito suave
7. Configurar dois eixos: eixo horizontal (X) mostrando os nomes dos meses abreviados (Jan, Fev, Mar, etc) na parte inferior
8. Eixo vertical (Y) mostrando valores monetários formatados de forma compacta (R$ 2k, R$ 4k, etc) do lado esquerdo
9. Adicionar linhas horizontais tracejadas muito sutis atravessando o gráfico em cada marca do eixo Y
10. Renderizar duas áreas representando receitas e despesas
11. Área de receitas deve ter linha de borda verde-limão com 3 pixels de espessura conectando os pontos com curva suave
12. Preenchimento abaixo usa gradiente vertical: topo com verde-limão 30% opaco, base transparente
13. Área de despesas tem linha de borda preta com 3 pixels de espessura, também com curva suave
14. Preenchimento usa gradiente: topo com preto 10% opaco, base transparente
15. Implementar tooltip interativo: quando o mouse se move sobre o gráfico, linha vertical fina acompanha o cursor
16. Ao parar sobre um ponto, mostrar tooltip flutuante com fundo branco, sombra elevada e bordas arredondadas
17. Dentro do tooltip exibir três linhas: nome do mês em negrito, "Receitas: R$ X.XXX,XX" em verde escuro, e "Despesas: R$ X.XXX,XX" em preto
18. Por enquanto usar dados mock fixos para sete meses
19. Estruturar o código de forma que no futuro estes dados possam vir de transações reais agrupadas por mês
20. Utilizar variables do design system para todas as cores e espaçamentos

**Entregáveis:**
- FinancialFlowChart implementado
- Gráfico de área com duas séries
- Tooltip interativo funcional
- Estilos aplicados com tokens

---

## 💳 PROMPT 10: Widget de Cartões de Crédito

**Objetivo:** Criar o widget que exibe os cartões de crédito.

**Tarefas:**
1. Implementar componente CreditCardsWidget com container de fundo cinza muito claro, bordas amplamente arredondadas
2. No header do widget colocar ícone de cartão de crédito à esquerda seguido do título "Cartões"
3. À direita adicionar botão circular com fundo branco, bordas arredondadas e ícone "+"
4. Este botão abre o modal de criação de novo cartão
5. Configurar hover no botão: fundo muda suavemente para cinza claro
6. Abaixo do header renderizar a lista de cartões verticalmente
7. Cada cartão deve vir do array creditCards do contexto global
8. Estruture cada card de cartão horizontalmente em três zonas: ícone à esquerda, informações ao centro e indicador de uso à direita
9. À esquerda criar bloco visual quadrado com cantos arredondados que recebe a cor do tema do cartão (preto, verde-limão ou branco com borda)
10. Dentro deste bloco mostrar ícone de cartão em estilo outline com cor contrastante ao fundo
11. Ao centro organizar verticalmente: nome do cartão/banco, valor da fatura atual formatado como moeda, e final do número mascarado no formato "•••• 1234"
12. À direita criar badge circular ou levemente oval mostrando o percentual de uso calculado como (fatura atual ÷ limite total) × 100
13. Cor do badge varia com o tema do cartão
14. Implementar interatividade: ao passar mouse, card eleva levemente com aumento sutil da sombra
15. Transição suave de 200-300ms
16. Ao clicar em um card, abrir o modal de detalhes do cartão
17. Se houver mais de três cartões visíveis, implementar paginação simples abaixo da lista
18. No mobile suportar também gesto de swipe horizontal
19. Utilizar rigorosamente variables do design system

**Entregáveis:**
- CreditCardsWidget implementado
- Cards de cartão com design completo
- Interatividade e hover funcionais
- Paginação (se necessário)

---

## 📋 PROMPT 11: Widget de Próximas Despesas

**Objetivo:** Criar o widget de próximas despesas com lista cronológica de contas a pagar.

**Tarefas:**
1. Criar widget com fundo branco, borda clara e cantos arredondados
2. No header mostrar à esquerda ícone de carteira seguido do título "Próximas despesas"
3. À direita adicionar botão circular com ícone "+" e borda clara
4. Ao clicar neste botão, abrir o modal de adicionar nova transação
5. No corpo do widget renderizar lista vertical de despesas pendentes
6. Buscar todas as transações do tipo "despesa" que ainda não foram pagas
7. Ordenar estas despesas por data de vencimento em ordem crescente
8. Cada item da lista ocupa uma linha horizontal com padding vertical generoso
9. Separar os itens com linha divisória fina cinza clara
10. Estruture cada item em duas colunas: esquerda com três informações, direita com valor e botão
11. Do lado esquerdo: título da despesa em negrito, data de vencimento formatada como "Vence dia DD/MM", e nome da conta ou cartão
12. Para identificar origem do pagamento: se for conta bancária, mostrar apenas nome; se for cartão, mostrar "Crédito [Banco] **** [últimos 4 dígitos]"
13. Do lado direito alinhar à direita: valor formatado como moeda, e botão circular com ícone de check
14. Configurar botão de check: ao passar mouse aparecer fundo verde claro, borda verde e ícone verde
15. Ao clicar no botão: marcar despesa como paga, animar botão, remover item da lista com animação, criar nova ocorrência se recorrente, exibir mensagem de confirmação
16. Quando não houver despesas pendentes, mostrar área centralizada com ícone de check circular verde e mensagem "Nenhuma despesa pendente"
17. Por enquanto usar dados fictícios de despesas pendentes
18. Utilizar as variáveis do design system para cores, espaçamentos e tamanhos

**Entregáveis:**
- Widget de próximas despesas implementado
- Lista ordenada por data de vencimento
- Botão de marcação como paga funcional
- Estado vazio quando não há despesas

---

## 📋 PROMPT 12: Tabela de Transações Detalhada

**Objetivo:** Criar a tabela completa de transações no dashboard.

**Tarefas:**
1. Implementar componente TransactionsTable começando com header horizontal
2. À esquerda colocar título "Extrato Detalhado"
3. À direita adicionar controles de busca e filtro específicos desta tabela
4. Criar campo de busca local com ícone de lupa, placeholder "Buscar lançamentos..."
5. Configurar busca em tempo real que filtra conforme usuário digita
6. Busca deve procurar correspondências em descrição OU categoria
7. Ao lado da busca adicionar select de tipo: dropdown com opções "Todos", "Receitas", "Despesas"
8. Configurar estrutura da tabela com borda clara arredondada contornando toda ela
9. Header da tabela tem fundo cinza claro diferenciando das linhas de dados
10. Definir sete colunas: Avatar (50px), Data, Descrição, Categoria, Conta/Cartão, Parcelas, Valor
11. Avatar mostra foto circular pequena do membro responsável ou ícone genérico se não houver
12. Data formatada como "DD/MM/AAAA"
13. Descrição com ícone indicativo do tipo seguido do texto
14. Categoria em badge arredondado com fundo cinza claro
15. Conta/Cartão: nome da conta bancária ou cartão vinculado, ou "Desconhecido" se não encontrar
16. Parcelas: mostrar "3x", "6x", etc, ou "-" se à vista
17. Valor alinhado à direita com prefixo de sinal (+ para receitas em verde, - para despesas em preto)
18. Configurar zebra striping sutil: linhas alternam entre fundo branco e fundo levíssimo cinza
19. Implementar hover nas linhas: ao passar mouse, linha inteira fica com fundo cinza claro mais perceptível
20. Criar lógica de filtragem combinada considerando filtros globais e locais da tabela
21. Todos os filtros trabalham em conjunto (AND lógico)
22. Configurar ordenação: transações sempre ordenadas por data em ordem decrescente
23. Implementar paginação mostrando apenas 5 transações por vez
24. Abaixo da tabela mostrar contador "Mostrando 1 a 5 de 47"
25. À direita adicionar controles de navegação: botão Anterior, números de página clicáveis, botão Próxima
26. Página atual tem fundo preto com texto branco
27. Se houver mais de 7 páginas, mostrar apenas primeiras 3, reticências, e últimas 2
28. Ao mudar página, rolar suavemente até o topo da tabela
29. Quando qualquer filtro muda, resetar automaticamente para página 1
30. Se após aplicar todos os filtros não houver transações, mostrar mensagem "Nenhum lançamento encontrado"
31. Buscar dados de getFilteredTransactions do contexto global
32. Utilizar variables do design system

**Entregáveis:**
- TransactionsTable implementada
- Sete colunas com formatação correta
- Filtragem combinada funcional
- Paginação funcional

---

## 🗂️ PROMPT 13: Modal de Nova Transação

**Objetivo:** Criar o modal completo para adicionar transações.

**Tarefas:**
1. Implementar modal que aparece em tela cheia ocupando 100% da largura e altura com fundo branco
2. Dividir em três áreas: header fixo no topo, conteúdo scrollável no centro e footer fixo na base
3. No header criar layout horizontal: ícone grande em círculo (64px) que muda conforme tipo, título "Nova Transação", subtítulo descritivo, e botão X para fechar
4. No conteúdo criar área scrollável com fundo levemente cinza e conteúdo centralizado em largura máxima (600-700px)
5. Organizar formulário verticalmente:
   - Toggle de tipo no topo: dois botões grandes lado a lado ("Receita" e "Despesa")
   - Campo de valor: input numérico grande com símbolo "R$" fixo à esquerda
   - Campo de descrição: input de texto grande
   - Campo de categoria: dropdown com botão "+ Nova Categoria" no topo
   - Grid de duas colunas: select de membro e select de conta/cartão
   - Campo de parcelamento condicional (só aparece se cartão de crédito E despesa)
   - Checkbox de despesa recorrente (só aparece se despesa)
6. No footer colocar dois botões: "Cancelar" e "Salvar Transação"
7. Implementar validação ao clicar em "Salvar Transação"
8. Se houver erro, mostrar mensagem abaixo do campo com borda vermelha
9. Se todas validações passarem, criar novo objeto de transação e adicionar ao array no contexto global
10. Fechar modal com animação
11. Mostrar notificação toast "Transação registrada com sucesso!"
12. Limpar formulário para próxima abertura
13. Utilizar variables do design system

**Entregáveis:**
- Modal de nova transação implementado
- Formulário completo com todos os campos
- Validação funcional
- Integração com contexto global

---

## 👥 PROMPT 14: Modal de Adicionar Membro

**Objetivo:** Criar o modal para adicionar membros da família.

**Tarefas:**
1. Implementar componente AddMemberModal com estrutura similar ao modal de transação
2. No header colocar título "Adicionar Membro da Família" e botão X
3. No footer botões "Cancelar" e "Adicionar Membro"
4. No conteúdo criar formulário com campos:
   - Nome completo: input de texto obrigatório (mínimo 3 caracteres)
   - Função/papel: combobox obrigatório com sugestões comuns (Pai, Mãe, Filho, etc)
   - Avatar: campo com duas opções (URL ou Upload)
   - Renda mensal: input numérico opcional com formatação de moeda
5. Implementar validação ao clicar em "Adicionar Membro"
6. Se válido, criar novo objeto de membro com ID único e adicionar ao array familyMembers do contexto global
7. Fechar modal e mostrar toast de sucesso
8. Novo membro aparece imediatamente nos avatares do header e dropdowns
9. Utilizar variables do design system

**Entregáveis:**
- AddMemberModal implementado
- Formulário com validação
- Integração com contexto global

---

## 💳 PROMPT 15: Modal de Adicionar Cartão

**Objetivo:** Criar o modal para adicionar contas bancárias e cartões de crédito.

**Tarefas:**
1. Implementar modal centralizado sobre overlay escuro
2. Modal tem fundo branco, bordas arredondadas, sombra forte
3. Dividir em três áreas: header fixo, conteúdo scrollável e footer fixo
4. No header título "Adicionar Conta/Cartão" e botão X
5. No footer botões "Cancelar" e "Adicionar"
6. No conteúdo criar formulário vertical:
   - Toggle de tipo no topo: "Conta Bancária" e "Cartão de Crédito"
   - Campo de nome: input de texto obrigatório
   - Campo de titular: dropdown obrigatório listando membros da família
   - Campos condicionais para Conta Bancária: Saldo inicial
   - Campos condicionais para Cartão de Crédito: Dia de fechamento, Dia de vencimento, Limite total, Últimos 4 dígitos (opcional), Tema visual (três opções clicáveis: Black, Lime, White)
7. Implementar validação ao clicar em "Adicionar"
8. Se válido, criar objeto com ID único e campos específicos conforme tipo
9. Adicionar ao array apropriado (bankAccounts ou creditCards) no contexto global
10. Fechar modal e mostrar toast de sucesso apropriado
11. Nova conta/cartão aparece imediatamente nos dropdowns e widgets
12. Utilizar variables do design system

**Entregáveis:**
- Modal de adicionar cartão/conta implementado
- Formulário com campos condicionais
- Validação funcional
- Integração com contexto global

---

## 📊 PROMPT 16: Modal de Detalhes do Cartão

**Objetivo:** Criar o modal que mostra informações completas do cartão.

**Tarefas:**
1. Implementar componente CardDetailsModal que abre ao clicar em qualquer cartão no widget
2. Modal maior que os anteriores para acomodar mais informações
3. No header mostrar nome do cartão como título e botão X
4. Dividir conteúdo em duas áreas principais:
   - Área de informações: seção superior com cards mostrando Limite total, Fatura atual, Limite disponível, Percentual de uso, Data de fechamento, Data de vencimento, Últimos 4 dígitos
   - Organizar em grid responsivo de 2 ou 3 colunas no desktop, coluna única no mobile
   - Adicionar representação visual do uso do limite (gráfico donut ou barra de progresso)
   - Área de despesas: seção inferior com tabela listando todas as transações de despesa vinculadas a este cartão
5. Filtrar transações onde type = "expense" E accountId igual ao ID deste cartão
6. Renderizar tabela simplificada com colunas: Data, Descrição, Categoria, Parcelas e Valor
7. Se houver muitas despesas (mais de 10), implementar paginação mostrando 10 por vez
8. Se não houver despesas vinculadas, mostrar mensagem apropriada
9. Adicionar botões de ação: "Ver Extrato Completo", "Adicionar Despesa", "Editar Cartão", "Fechar"
10. Configurar fechamento: clicar em Fechar, X ou fora do modal fecha com fade-out
11. Utilizar variables do design system

**Entregáveis:**
- CardDetailsModal implementado
- Informações completas do cartão
- Tabela de despesas vinculadas
- Botões de ação funcionais

---

## 📱 PROMPT 17: Modal de Filtros Mobile

**Objetivo:** Criar o modal de filtros específico para mobile.

**Tarefas:**
1. Implementar componente FiltersMobileModal que aparece quando usuário toca no botão de filtros
2. Configurar animação de entrada: modal desliza de baixo para cima em 300ms
3. Estruturar em três áreas fixas: header fixo no topo, conteúdo scrollável no centro, footer fixo na base
4. Header contém título "Filtros" e botão X grande
5. Footer contém único botão grande "Aplicar Filtros" com altura de 56px
6. No conteúdo organizar seções de filtro:
   - Seção tipo de transação: grid de 3 colunas com botões "Todos", "Receitas", "Despesas"
   - Seção membro da família: botões horizontais com wrap, cada botão mostra avatar e nome
   - Seção período: calendário de um único mês ocupando largura total
7. Calendário permite seleção de intervalo: primeiro toque define início, segundo toque define fim
8. Usuário pode ajustar quantos filtros quiser
9. As seleções ficam em estado temporário local (não aplicadas ao contexto global ainda)
10. Ao tocar em "Aplicar Filtros", copiar filtros temporários para estado global do contexto
11. Fechar modal com animação slide-out
12. Todo o dashboard atualiza automaticamente refletindo os novos filtros
13. Se tocar no X ou fora, fechar SEM aplicar filtros
14. Utilizar variables do design system garantindo touch-friendly

**Entregáveis:**
- FiltersMobileModal implementado
- Animações de slide funcionais
- Filtros temporários e aplicação
- Touch-friendly

---

## 💳 PROMPT 18: View Completa de Cartões

**Objetivo:** Criar a tela completa dedicada aos cartões de crédito.

**Tarefas:**
1. Implementar componente CardsView que é uma das seções principais navegáveis
2. No topo colocar header com título "Cartões de Crédito" e botão "Novo Cartão"
3. Abaixo do header renderizar todos os cartões em grid responsivo: Mobile 1 coluna, Tablet 2 colunas, Desktop 3 colunas
4. Cada cartão deve ser exibido como card grande e detalhado mostrando informações mais completas que no widget
5. Organizar cada card verticalmente: nome do cartão, seção de valores (limite, fatura, disponível, percentual), representação visual (barra de progresso ou donut), datas (fechamento e vencimento), tema visual, últimos dígitos
6. Adicionar botões pequenos no rodapé do card: "Ver Detalhes" e "Adicionar Despesa"
7. Configurar hover: card eleva com sombra aumentada
8. Configurar clicável: tocar/clicar no card abre modal de detalhes
9. Se não houver cartões cadastrados, mostrar estado vazio apropriado
10. Buscar dados do array creditCards do contexto global
11. Ordenar cartões por fatura decrescente ou alfabeticamente
12. Utilizar variables do design system

**Entregáveis:**
- CardsView implementada
- Grid responsivo de cartões
- Cards detalhados e interativos
- Estado vazio

---

## 📋 PROMPT 19: View Completa de Transações

**Objetivo:** Criar a tela completa dedicada às transações.

**Tarefas:**
1. Implementar componente TransactionsView que é uma das seções principais
2. No topo colocar header com título "Transações" e botão "Nova Transação"
3. Abaixo do header criar barra de filtros avançados horizontal (desktop) ou vertical (mobile)
4. Filtros avançados incluem: busca textual, select de tipo, select de categoria, select de conta/cartão, select de membro, date range picker, select de status
5. Todos os filtros trabalham em conjunto (AND lógico), adicionando-se aos filtros globais
6. Adicionar acima da tabela linha de resumo mostrando estatísticas: total de receitas filtradas, total de despesas filtradas, diferença, quantidade de transações
7. Renderizar tabela de transações usando o mesmo componente TransactionsTable do dashboard
8. Configurar modo expandido: mais linhas por página (10 ao invés de 5) e ocupa largura total
9. Adicionar opção de ordenação clicável nos headers das colunas
10. Mostrar ícone de seta indicando ordem atual
11. Configurar exportação: botão "Exportar" no header que permite baixar transações filtradas em CSV ou PDF
12. Se não houver transações, mostrar estado vazio apropriado
13. Buscar dados através de getFilteredTransactions do contexto
14. Utilizar variables do design system

**Entregáveis:**
- TransactionsView implementada
- Filtros avançados funcionais
- Resumo de estatísticas
- Ordenação e exportação

---

## 👤 PROMPT 20: View de Perfil - Aba Informações

**Objetivo:** Criar a tela de perfil do usuário - aba Informações.

**Tarefas:**
1. Implementar componente ProfileView que é a última seção principal navegável
2. View deve ter sistema de abas no topo: "Informações" e "Configurações"
3. Ao entrar na view, sempre mostrar aba "Informações" ativa primeiro
4. As abas ficam lado a lado horizontalmente com borda inferior destacando a aba ativa
5. Na aba "Informações" mostrar informações do usuário atual logado (primeiro membro do array que representa usuário principal)
6. Seção de perfil: card grande no topo com avatar grande (120px), nome completo, função na família, email, renda mensal estimada
7. Opcionalmente adicionar botão "Editar Perfil"
8. Seção membros da família: card abaixo com título "Membros da Família" e lista vertical de todos os membros cadastrados
9. Cada item da lista mostra: avatar circular médio (48px), nome e função em duas linhas, renda mensal à direita
10. Fundo cinza claro suave com espaçamento entre items
11. Se houver apenas um membro, mostrar mensagem incentivando adicionar outros com botão
12. Configurar hover nos items: fundo muda para cinza um pouco mais escuro
13. Configurar clicável: tocar em um membro pode abrir modal para editar
14. Adicionar na parte inferior botão vermelho "Sair" com ícone de logout
15. Utilizar variables do design system

**Entregáveis:**
- ProfileView com aba Informações implementada
- Seção de perfil completa
- Lista de membros da família
- Botão de logout

---

## ⚙️ PROMPT 21: View de Perfil - Aba Configurações

**Objetivo:** Criar a aba "Configurações" dentro da view de perfil.

**Tarefas:**
1. Implementar conteúdo da aba "Configurações" que aparece quando usuário clica nesta aba
2. Organizar configurações em seções distintas:
   - Seção preferências de exibição: card com toggles "Modo Escuro" (desabilitado com badge "Em breve"), select de moeda padrão, select de formato de data
   - Seção notificações: card com múltiplos toggle switches (lembrete de vencimento, alerta de limite, resumo mensal, notificações de objetivos)
   - Seção categorias: card com título "Gerenciar Categorias", listas de categorias de receita e despesa, botões para adicionar nova categoria, ícones de editar e deletar
   - Seção dados e privacidade: card com botões "Exportar Todos os Dados" e "Limpar Todos os Dados" (com confirmação)
   - Seção sobre: card final com versão do sistema, texto descritivo, links "Termos de Uso" e "Política de Privacidade"
3. Organizar todos os cards verticalmente com espaçamento generoso
4. No mobile empilhar tudo verticalmente
5. No desktop pode organizar alguns cards lado a lado se houver espaço
6. Por enquanto toggles apenas alteram estado visual local sem integração real
7. Utilizar variables do design system

**Entregáveis:**
- Aba Configurações implementada
- Todas as seções de configuração
- Toggles e controles funcionais

---

## 🎨 PROMPT 22: Animações e Transições Globais

**Objetivo:** Implementar animações e transições suaves em todo o sistema.

**Tarefas:**
1. Configurar transições de navegação entre seções principais: conteúdo atual fade-out, novo conteúdo fade-in (200ms)
2. Implementar animações de entrada para cards e componentes que aparecem em listas ou grids:
   - Cards de transações: fade-in + slide-up com stagger de 50ms
   - Cards de objetivos e cartões: fade-in + slide-up com stagger de 80ms
   - Donuts do carrossel: scale + fade-in com stagger de 100ms
3. Configurar animações de hover consistentes: botões (background-color 200ms), cards clicáveis (translateY + box-shadow 250ms), avatares (scale 200ms)
4. Implementar animações de loading para valores monetários: quando valor muda, animar de zero até valor final em 800ms
5. Configurar animações de barras de progresso: preencher suavemente da esquerda para direita em 1000ms
6. Implementar animações de modais: abertura (overlay fade-in, modal fade-in + scale), fechamento (modal fade-out + scale, overlay fade-out)
7. Modal mobile de filtros: slide-in de translateY(100%) para 0 em 300ms, slide-out inverte direção
8. Configurar animações de toasts: entrada (slide-in da direita + fade-in 300ms), saída (fade-out + slide-out 250ms)
9. Implementar skeleton loaders para estados de carregamento: cards com pulse, linhas com shimmer
10. Adicionar micro-interações: checkboxes/toggles (scale leve ao clicar), inputs em foco (borda transiciona), dropdowns (fade-in + slide-down)
11. Utilizar Framer Motion ou CSS transitions/animations conforme apropriado
12. Garantir que todas as animações respeitem prefers-reduced-motion

**Entregáveis:**
- Animações de navegação funcionais
- Animações de entrada para componentes
- Animações de hover consistentes
- Skeleton loaders implementados

---

## 🎯 PROMPT 23: Formatação e Utilitários

**Objetivo:** Criar funções utilitárias para formatação consistente em todo o sistema.

**Tarefas:**
1. Criar arquivo de utilitários para formatação de valores monetários:
   - formatCurrency: formata número como moeda brasileira "R$ 1.234,56" usando Intl.NumberFormat
   - formatCompactCurrency: formata valores grandes de forma compacta "R$ 2,5k" ou "R$ 1,2M"
   - parseCurrencyInput: converte string de input em número limpo (remove R$, pontos, troca vírgula por ponto)
2. Criar utilitários para formatação de datas:
   - formatDate: formata Date como "DD/MM/AAAA" usando date-fns
   - formatDateLong: retorna formato extenso "15 de Janeiro de 2024"
   - formatDateRange: retorna intervalo formatado "01 jan - 31 jan, 2024"
   - formatRelativeDate: retorna data relativa "Hoje", "Ontem", "Há 3 dias"
3. Criar utilitários para manipulação de arrays e objetos:
   - groupByCategory: agrupa transações por categoria com valores somados
   - filterByDateRange: filtra transações por intervalo de datas
   - sortByDate: ordena transações por data (ascendente ou descendente)
4. Criar utilitários para cálculos financeiros:
   - calculatePercentage: calcula percentual com uma casa decimal, trata divisão por zero
   - calculateDifference: calcula diferença absoluta e percentual de variação
   - calculateInstallmentValue: calcula valor de parcela arredondado
5. Criar utilitários para validação:
   - isValidEmail: valida formato de email
   - isValidCPF: valida CPF brasileiro (estrutura)
   - isValidDate: verifica se data é válida
   - isPositiveNumber: verifica se valor é positivo maior que zero
6. Criar utilitário para geração de IDs: generateUniqueId usando UUID v4 ou crypto.randomUUID
7. Organizar todos os utilitários em arquivos separados por categoria: currency.utils.ts, date.utils.ts, array.utils.ts, validation.utils.ts
8. Adicionar JSDoc comments em cada função
9. Criar testes unitários básicos para funções críticas

**Entregáveis:**
- Todos os utilitários de formatação implementados
- Utilitários de validação funcionais
- Utilitários de cálculos financeiros
- Documentação JSDoc completa

---

## 🎨 PROMPT 24: Responsividade e Ajustes Finais

**Objetivo:** Fazer revisão completa de responsividade do sistema, aplicando apenas ajustes incrementais.

**Tarefas:**
1. Revisar todo o sistema seguindo abordagem mobile-first
2. Utilizar exclusivamente os breakpoints oficiais: Mobile (<768px), Tablet (≥768px e <1280px), Desktop (≥1280px e <1920px), Wide (≥1920px)
3. Garantir que layout seja sempre fluido: containers principais usando width: 100%, limite de leitura com max-width
4. Garantir que sidebar só existe no desktop (≥1280px)
5. Garantir que Header Mobile renderiza apenas abaixo de 1280px
6. Revisar todos os grids: mobile 1 coluna, tablet 2 colunas quando fizer sentido, desktop 3 ou 4 colunas
7. Grids devem ser fluidos (auto-fit / auto-fill), nunca hardcoded
8. Revisar espaçamentos do conteúdo principal: px-4 no mobile, px-6 no tablet, px-8 no desktop
9. No desktop, limitar largura de leitura com max-w-[1400px], no wide com max-w-[1600px]
10. Revisar tipografia: reduzir ~15% no mobile, evoluir progressivamente (text-base md:text-lg lg:text-xl)
11. Ajustar tabela de transações: no mobile usar cards verticais, no tablet híbrida, no desktop tabela completa
12. Ajustar gráficos: mobile menor altura, labels simplificados, no tablet/desktop aumentar altura proporcionalmente
13. Revisar modais: no mobile ocupar 100% viewport, no tablet/desktop usar max-width adequado
14. Garantir interações touch: touch targets mínimos 44x44px, espaçamento mínimo 8px, inputs com altura mínima 48px e font-size mínimo 16px
15. Garantir acessibilidade básica: navegação por teclado, foco visível, aria-label, alt em imagens, contraste mínimo 4.5:1
16. Validar obrigatoriamente em 375px, 768px, 1280px e 1920px, corrigindo qualquer problema encontrado

**Entregáveis:**
- Sistema totalmente responsivo
- Zero overflow horizontal
- Acessibilidade básica garantida
- Validação em todos os breakpoints

---

## ✅ PROMPT 25: Testes e Validação Final

**Objetivo:** Finalizar o projeto com testes e validação completa do sistema.

**Tarefas:**
1. Criar fluxo de teste completo simulando jornada de usuário real
2. Validar cálculos financeiros com valores conhecidos
3. Validar filtros combinados ativando múltiplos simultaneamente
4. Validar formatações: valores monetários, datas, percentuais
5. Validar responsividade redimensionando de 1920px até 375px gradualmente
6. Validar modais: abertura, fechamento, validações
7. Validar acessibilidade navegando apenas com teclado e usando leitor de tela
8. Validar performance monitorando DevTools
9. Corrigir quaisquer bugs encontrados durante testes
10. Adicionar tratamento de erros em pontos críticos
11. Adicionar mensagens de feedback apropriadas (toasts, estados vazios, validações)
12. Documentar comportamento não óbvio ou decisões de design
13. Criar README.md do projeto descrevendo: objetivo, tecnologias, instalação, estrutura, componentes

**Entregáveis:**
- Fluxo de testes completo executado
- Todos os bugs corrigidos
- Tratamento de erros implementado
- README.md completo

---

## 🎉 PROMPT 26: Revisão e Entrega

**Objetivo:** Fazer revisão final e preparação para entrega do projeto mycash+.

**Tarefas:**
1. Executar checklist completo de qualidade
2. Revisar organização do código: estrutura de pastas, nomes, responsabilidades
3. Revisar comentários e documentação: JSDoc, comentários explicativos, remover console.logs
4. Otimizar performance final: re-renders, bundle size, imports
5. Preparar para integração futura com Supabase: identificar pontos, adicionar TODOs
6. Criar documentação de componentes principais
7. Gerar relatório final: total de componentes, linhas de código, funcionalidades implementadas

**Entregáveis:**
- Checklist de qualidade completo
- Código otimizado e documentado
- Documentação de componentes
- Relatório final

---

## 🎯 Comandos Úteis

- **"Próximo"** → Avançar para próximo prompt
- **"Revisar [arquivo]"** → Revisar arquivo específico
- **"Refazer"** → Refazer prompt atual
- **"Status"** → Ver progresso geral
- **"Tokens"** → Ver mapeamento completo de conversões
