# mycash+ — Documentação do Projeto

## 📊 Progresso Geral

- [x] **PROMPT 0:** Análise e Planejamento Inicial
- [x] **PROMPT 1:** Estrutura Base e Configuração
- [x] **PROMPT 2:** Design Tokens e Sistema de Cores
- [ ] **PROMPT 3:** Sistema de Layout e Navegação Desktop
- [ ] **PROMPT 4:** Sistema de Layout e Navegação Mobile
- [ ] **PROMPT 5:** Context Global e Gerenciamento de Estado
- [ ] **PROMPT 6:** Cards de Resumo Financeiro
- [ ] **PROMPT 7:** Header do Dashboard com Controles
- [ ] **PROMPT 8:** Carrossel de Gastos por Categoria
- [ ] **PROMPT 9:** Gráfico de Fluxo Financeiro
- [ ] **PROMPT 10:** Widget de Cartões de Crédito
- [ ] **PROMPT 11:** Widget de Próximas Despesas
- [ ] **PROMPT 12:** Tabela de Transações Detalhada
- [ ] **PROMPT 13:** Modal de Nova Transação
- [ ] **PROMPT 14:** Modal de Adicionar Membro
- [ ] **PROMPT 15:** Modal de Adicionar Cartão
- [ ] **PROMPT 16:** Modal de Detalhes do Cartão
- [ ] **PROMPT 17:** Modal de Filtros Mobile
- [ ] **PROMPT 18:** View Completa de Cartões
- [ ] **PROMPT 19:** View Completa de Transações
- [ ] **PROMPT 20:** View de Perfil - Aba Informações
- [ ] **PROMPT 21:** View de Perfil - Aba Configurações
- [ ] **PROMPT 22:** Animações e Transições Globais
- [ ] **PROMPT 23:** Formatação e Utilitários
- [ ] **PROMPT 24:** Responsividade e Ajustes Finais
- [ ] **PROMPT 25:** Testes e Validação Final
- [ ] **PROMPT 26:** Revisão e Entrega

---

## ✅ PROMPT 0: Análise e Planejamento Inicial

**Status:** ✅ Concluído | **Data:** 2024 | **Build:** N/A (análise)

### Objetivos Alcançados
- ✓ Análise completa da estrutura do projeto
- ✓ Mapeamento de componentes visuais
- ✓ Identificação da hierarquia de tokens (semânticos e primitivos)
- ✓ Definição da arquitetura proposta
- ✓ Estrutura de navegação mapeada

### Arquivos Criados
- `PROMPT-0-ANALISE.md` - Análise detalhada completa
- `PROMPTS-SEQUENCIA.md` - Sequência de todos os prompts
- `DOCUMENTATION.md` - Este arquivo

### Arquitetura Definida

**Estrutura de Pastas:**
```
src/
├── components/
│   ├── layout/        # Sidebar, HeaderMobile, MainLayout
│   ├── dashboard/     # Componentes específicos do dashboard
│   ├── cards/         # Componentes da página Cartões
│   ├── transactions/  # Componentes da página Transações
│   ├── profile/       # Componentes da página Perfil
│   └── ui/            # Componentes base reutilizáveis
├── pages/             # Páginas principais (composição)
├── hooks/             # Hooks customizados
├── styles/            # Tokens CSS e globals
├── utils/             # Funções auxiliares
└── types/             # Tipos TypeScript
```

**Hierarquia de Tokens:**
1. **Semânticos** (--color-primary, --spacing-container)
2. **Primitivos** (--gray-900, --spacing-md)
3. **Conversão** (hex/px → tokens mais próximos)

### Decisões de Arquitetura

- **Stack:** React + TypeScript + Vite + Tailwind CSS
- **Breakpoints:** Mobile (<768px), Tablet (≥768px), Desktop (≥1280px), Wide (≥1920px)
- **Layout:** Mobile-first, 100% fluido
- **Navegação:** Sidebar (desktop) OU HeaderMobile (mobile/tablet), nunca ambos
- **Componentização:** Componentes pequenos e reutilizáveis, lógica em hooks

---

## ✅ PROMPT 1: Estrutura Base e Configuração

**Status:** ✅ Concluído | **Build:** ✅ Sucesso (2 tentativas)

### Objetivos Alcançados
- ✓ Projeto Vite + React + TypeScript inicializado
- ✓ Estrutura de pastas completa criada
- ✓ Tailwind CSS configurado com breakpoints customizados
- ✓ Tipos TypeScript criados para todas as entidades (Transaction, Goal, CreditCard, BankAccount, FamilyMember)
- ✓ React Router configurado com 5 rotas principais
- ✓ CSS Variables (tokens) estrutura base criada
- ✓ Build passando sem erros

### Arquivos Criados

**Configuração:**
- `package.json` - Dependências e scripts
- `tsconfig.json` / `tsconfig.node.json` - Configuração TypeScript
- `vite.config.ts` - Configuração Vite com path aliases
- `tailwind.config.js` - Tailwind com breakpoints e mapeamento de cores
- `postcss.config.js` - Configuração PostCSS
- `.gitignore` - Arquivos ignorados pelo git
- `index.html` - HTML base

**Código:**
- `src/main.tsx` - Entry point da aplicação
- `src/App.tsx` - Componente principal com React Router
- `src/types/index.ts` - Tipos TypeScript para todas as entidades
- `src/styles/globals.css` - Estilos globais e Tailwind
- `src/styles/tokens.css` - Estrutura base de tokens CSS (placeholders)
- `src/pages/Dashboard.tsx` - Página Dashboard (base)
- `src/pages/Cards.tsx` - Página Cartões (base)
- `src/pages/Transactions.tsx` - Página Transações (base)
- `src/pages/Profile.tsx` - Página Perfil (base)

**Estrutura de Pastas Criada:**
```
src/
├── components/
│   ├── layout/Sidebar/
│   ├── layout/HeaderMobile/
│   ├── dashboard/
│   ├── cards/
│   ├── transactions/
│   ├── profile/
│   ├── modals/
│   └── ui/
├── contexts/
├── hooks/
├── pages/
├── styles/
├── types/
├── utils/
└── constants/
```

### Build

✅ Sucesso (tentativas: 2)
- Primeira tentativa: erro de ordem @import no CSS
- Segunda tentativa: ✅ Build completo sem erros

### Dependências Instaladas

**Produção:**
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.1

**Desenvolvimento:**
- typescript: ^5.2.2
- vite: ^5.0.8
- tailwindcss: ^3.3.6
- @vitejs/plugin-react: ^4.2.1
- eslint e plugins

---

## ✅ PROMPT 2: Design Tokens e Sistema de Cores

**Status:** ✅ Concluído | **Build:** ✅ Sucesso (1 tentativa)

### Objetivos Alcançados
- ✓ Tokens primitivos implementados (cores, espaçamentos, tipografia, shapes, shadows)
- ✓ Tokens semânticos implementados (cores, espaçamentos, tipografia)
- ✓ Arquivo `tokens.css` completo com todas as variáveis
- ✓ Tokens mapeados no Tailwind config
- ✓ Utilitário `tokenMapper.ts` criado para conversões futuras
- ✓ Documentação de conversões criada
- ✓ Build passando sem erros

### Tokens Implementados

**Cores Primitivas:**
- Escala Gray: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Escala Lime: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 (cor da marca)
- Escala Red: 50-900 (estados de erro)
- Escala Green: 50-900 (estados de sucesso)
- Escala Yellow: 50-900 (estados de warning)

**Cores Semânticas:**
- `--color-primary`: `var(--lime-500)` (#84CC16)
- `--color-secondary`: `var(--gray-900)` (#171717)
- `--color-bg`: `var(--gray-50)` (#FAFAFA)
- `--color-surface`: #FFFFFF
- `--color-text-primary`: `var(--gray-900)`
- `--color-text-secondary`: `var(--gray-600)`
- `--color-border`: `var(--gray-200)`
- `--color-error`: `var(--red-500)`
- `--color-success`: `var(--green-500)`
- `--color-warning`: `var(--yellow-500)`

**Espaçamentos:**
- xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px), 3xl (64px), 4xl (96px)
- Semânticos: container, section, card, page-mobile/tablet/desktop

**Tipografia:**
- Font sizes: xs até 5xl (12px até 48px)
- Font weights: light (300) até extrabold (800)
- Line heights: tight (1.25) até loose (2)

**Shape/Radius:**
- sm (4px), md (8px), lg (12px), xl (16px), 2xl (24px), full (9999px)
- Semânticos: button, card, input, modal

**Shadows:**
- xs, sm, md, lg, xl, 2xl, inner
- Semânticos: card, modal, dropdown, button

**Z-Index:**
- dropdown (1000) até toast (1080)

**Transitions:**
- fast (150ms), base (200ms), slow (300ms), slower (500ms)

### Arquivos Criados/Modificados

- `src/styles/tokens.css` - Tokens completos implementados
- `src/utils/tokenMapper.ts` - Utilitário de conversão hex/px → tokens
- `tailwind.config.js` - Mapeamento completo de todos os tokens
- `TOKEN-CONVERSIONS.md` - Documentação de conversões

### Mapeamento Tailwind

Todos os tokens disponíveis via classes Tailwind:
- `bg-primary`, `text-text-primary`, `p-md`, `rounded-lg`, `shadow-card`, etc.

### Build

✅ Sucesso (tentativas: 1)
- Build completo sem erros
- CSS gerado: 10.55 kB (gzip: 3.15 kB)

---

## 📝 Próximos Passos

⏭️ **PROMPT 3:** Sistema de Layout e Navegação Desktop

Implementar:
- Criar componente Sidebar com estados expanded/collapsed
- Implementar botão de alternância com animações
- Adicionar tooltips no estado collapsed
- Implementar item ativo (fundo preto, texto branco, ícone verde-limão)
- Transições suaves entre estados

---

## 🎨 Tokens do Design System

### Tokens Implementados ✅

**Cores Semânticas:**
- `--color-primary`: Verde-limão (#84CC16)
- `--color-secondary`: Preto (#171717)
- `--color-bg`: Cinza claro (#FAFAFA)
- `--color-surface`: Branco
- `--color-text-primary`: Cinza escuro (#171717)
- `--color-text-secondary`: Cinza médio (#525252)
- `--color-border`: Cinza claro (#E5E5E5)
- `--color-error`: Vermelho (#EF4444)
- `--color-success`: Verde (#22C55E)
- `--color-warning`: Amarelo (#EAB308)

**Cores Primitivas:**
- Escalas completas: Gray, Lime, Red, Green, Yellow (50-900)

**Espaçamentos:**
- xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px), 3xl (64px), 4xl (96px)

**Tipografia:**
- Font sizes: xs (12px) até 5xl (48px)
- Font weights: light (300) até extrabold (800)
- Line heights: tight (1.25) até loose (2)

### Conversões Realizadas

Ver arquivo `TOKEN-CONVERSIONS.md` para documentação completa.

---

## 📁 Estrutura de Arquivos

✅ Estrutura base criada no PROMPT 1 (ver seção acima)

---

## 🧪 Build Status

**Histórico:**
- PROMPT 0: N/A (análise, sem build)
- PROMPT 1: ✅ Sucesso (2 tentativas)
- PROMPT 2: ✅ Sucesso (1 tentativa)

---

## 💡 Notas e Observações

- Este documento será atualizado conforme cada prompt é concluído
- Todas as conversões de tokens devem ser documentadas aqui
- Build deve passar sem erros após cada prompt
