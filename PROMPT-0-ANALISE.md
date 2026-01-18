# 📋 PROMPT 0: Análise e Planejamento Inicial - mycash+

## 📚 PRÉ-EXECUÇÃO
✓ Rules relidas e compreendidas
✓ Figma link analisado: [Dashboard Principal](https://www.figma.com/design/XdjADyb9gBAGbk1vqa56r3/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=42-3096&t=cx9iPRQ7Ik1lqDNM-4)
✓ Hierarquia de variáveis: semântica → primitiva → conversão
✓ Stack confirmada: React + TypeScript + Vite + Tailwind CSS

---

## 1️⃣ MAPEAMENTO DE COMPONENTES VISUAIS

### Dashboard (Página Principal)
**Componentes identificados (estrutura típica de dashboard financeiro):**

#### Header/Top Bar
- Logo/Identidade visual
- Menu de navegação (provavelmente mobile drawer)
- Ações rápidas (botões CTA)
- Indicadores de estado (notificações, perfil)

#### Sidebar Desktop (≥1280px)
- **Estado Expanded:**
  - Logo/Branding
  - Itens de menu com ícone + texto
  - Seções agrupadas (Dashboard, Cartões, Transações, Perfil)
  - Indicador de item ativo
  - Footer da sidebar (configurações/logout)
- **Estado Collapsed:**
  - Apenas ícones
  - Tooltips on hover
  - Largura reduzida (~64px)

#### Conteúdo Principal (Main)
- **Cards de Métricas:**
  - Saldo atual
  - Receitas do mês
  - Despesas do mês
  - Outros KPIs financeiros
- **Gráficos:**
  - Gráfico de linha (evolução temporal)
  - Gráfico de pizza/barras (distribuição)
- **Tabela/Lista de Transações Recentes:**
  - Colunas: Data, Descrição, Categoria, Valor
  - Paginação ou scroll infinito
  - Filtros/Ordenação

#### Header Mobile (<1280px)
- Botão hambúrguer (abre drawer)
- Título da página/seção
- Botões de ação principais
- **Não renderiza** quando Sidebar está ativa

---

## 2️⃣ VARIÁVEIS DO DESIGN SYSTEM

### Tokens Semânticos (Prioridade 1)
**Cores:**
- `--color-primary` - Cor principal da marca
- `--color-secondary` - Cor secundária
- `--color-bg` / `--color-background` - Fundo principal
- `--color-surface` - Superfícies (cards, modais)
- `--color-text-primary` - Texto principal
- `--color-text-secondary` - Texto secundário
- `--color-border` - Bordas e divisores
- `--color-error` - Estados de erro
- `--color-success` - Estados de sucesso
- `--color-warning` - Avisos

**Espaçamentos:**
- `--spacing-container` - Padding de containers principais
- `--spacing-section` - Espaçamento entre seções
- `--spacing-card` - Espaçamento interno de cards

### Tokens Primitivos (Prioridade 2)
**Cores (escala Gray):**
- `--gray-50`, `--gray-100`, `--gray-200`, `--gray-300`, `--gray-400`, `--gray-500`, `--gray-600`, `--gray-700`, `--gray-800`, `--gray-900`
- `--lime-50` até `--lime-900` (se aplicável - cor da marca)

**Espaçamentos:**
- `--spacing-xs` (4px)
- `--spacing-sm` (8px)
- `--spacing-md` (16px)
- `--spacing-lg` (24px)
- `--spacing-xl` (32px)
- `--spacing-2xl` (48px)
- `--spacing-3xl` (64px)

**Tipografia:**
- `--font-family-base`
- `--font-size-xs`, `--font-size-sm`, `--font-size-base`, `--font-size-lg`, `--font-size-xl`, `--font-size-2xl`, `--font-size-3xl`
- `--font-weight-normal` (400), `--font-weight-semibold` (600), `--font-weight-bold` (700)
- `--line-height-tight`, `--line-height-normal`, `--line-height-relaxed`

**Shape/Radius:**
- `--radius-sm` (4px)
- `--radius-md` (8px)
- `--radius-lg` (12px)
- `--radius-xl` (16px)
- `--radius-full` (9999px)

**Shadow:**
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

### Estratégia de Conversão (Prioridade 3)
Quando encontrar valores hardcoded no Figma:

**Cores Hex → Primitivas:**
- Comparar visualmente com escala gray/primária existente
- Escolher a primitiva mais próxima
- Documentar todas as conversões

**Espaçamentos px → Tokens:**
- Arredondar para o token mais próximo
- Exemplo: 28px → `--spacing-lg` (se lg=32px) ou `--spacing-xl` (se xl=28px)

**Tipografia:**
- Mapear peso: 400→normal, 600→semibold, 700→bold
- Usar escala tipográfica existente

---

## 3️⃣ ESTRUTURA DE NAVEGAÇÃO

### Desktop (≥1280px)
```
Layout:
┌─────────────────────────────────────────┐
│ [Sidebar Expanded/Collapsed] │ [Main]  │
│                                  │      │
│  - Dashboard                      │      │
│  - Cartões                        │      │
│  - Transações                     │      │
│  - Perfil                         │      │
│                                  │      │
└─────────────────────────────────────────┘
```

**Estados da Sidebar:**
- **Expanded (padrão):** ~240px de largura, mostra ícone + texto
- **Collapsed:** ~64px de largura, apenas ícones + tooltips
- **Transição:** Animação suave (300ms ease)
- **Persistência:** Estado salvo em localStorage

### Mobile/Tablet (<1280px)
```
Layout:
┌─────────────────────────┐
│ [Header Mobile]         │
│ [Menu Icon] [Title] [•] │
├─────────────────────────┤
│                         │
│  [Main Content]         │
│                         │
│                         │
└─────────────────────────┘
```

**Header Mobile:**
- Renderiza apenas quando Sidebar NÃO está presente
- Botão hambúrguer abre Drawer (overlay)
- Drawer pode conter mesma estrutura da Sidebar, mas como overlay

**Transição entre seções:**
- Navegação via React Router
- Transição suave entre páginas
- Manter estado de scroll quando apropriado

---

## 4️⃣ ARQUITETURA PROPOSTA

### Estrutura de Pastas

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx              # Componente principal (desktop only)
│   │   │   ├── SidebarItem.tsx          # Item individual de menu
│   │   │   ├── SidebarHeader.tsx        # Logo/branding
│   │   │   ├── SidebarFooter.tsx        # Config/logout
│   │   │   └── useSidebarState.ts       # Hook de estado (expanded/collapsed)
│   │   ├── HeaderMobile/
│   │   │   ├── HeaderMobile.tsx         # Header (mobile/tablet only)
│   │   │   ├── MobileDrawer.tsx         # Drawer overlay
│   │   │   └── MobileMenuButton.tsx     # Botão hambúrguer
│   │   └── MainLayout.tsx               # Wrapper principal (orquestra Sidebar/Header)
│   ├── dashboard/
│   │   ├── MetricCard.tsx               # Card de métrica KPI
│   │   ├── ChartCard.tsx                # Wrapper de gráfico
│   │   ├── TransactionList.tsx          # Lista de transações
│   │   └── RecentTransactions.tsx       # Seção de transações recentes
│   ├── cards/
│   │   ├── CardList.tsx                 # Lista de cartões
│   │   ├── CardItem.tsx                 # Item individual
│   │   └── CardActions.tsx              # Ações rápidas
│   ├── transactions/
│   │   ├── TransactionTable.tsx         # Tabela de transações
│   │   ├── TransactionFilters.tsx       # Filtros/ordenadores
│   │   └── TransactionRow.tsx           # Linha da tabela
│   ├── profile/
│   │   ├── ProfileHeader.tsx            # Cabeçalho do perfil
│   │   ├── ProfileSection.tsx           # Seção genérica
│   │   └── ProfileForm.tsx              # Formulários
│   └── ui/                              # Componentes base reutilizáveis
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Badge.tsx
├── pages/
│   ├── Dashboard.tsx                    # Página principal (composição)
│   ├── Cards.tsx
│   ├── Transactions.tsx
│   └── Profile.tsx
├── hooks/
│   ├── useBreakpoint.ts                 # Detecção de breakpoints
│   ├── useNavigation.ts                 # Navegação e rotas
│   └── useLocalStorage.ts               # Persistência de estado
├── styles/
│   ├── tokens.css                       # CSS Variables (design tokens)
│   └── globals.css                      # Reset + estilos globais
├── utils/
│   ├── tokenMapper.ts                   # Utilitário de conversão hex/px → tokens
│   └── formatCurrency.ts                # Formatação de valores
├── types/
│   ├── design-tokens.ts                 # TypeScript types para tokens
│   └── index.ts                         # Tipos gerais
└── App.tsx                              # Entry point + Router

```

### Hierarquia de Componentes

**MainLayout (Orquestrador):**
```tsx
<MainLayout>
  {isDesktop ? <Sidebar /> : <HeaderMobile />}
  <main>
    <Router>
      <Route path="/" component={Dashboard} />
      <Route path="/cards" component={Cards} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/profile" component={Profile} />
    </Router>
  </main>
</MainLayout>
```

**Estratégia de Componentização:**
1. **Componentes de Layout:** Responsáveis pela estrutura (Sidebar, Header)
2. **Componentes de Página:** Apenas composição, sem lógica
3. **Componentes de Feature:** Específicos de cada seção (MetricCard, TransactionList)
4. **Componentes UI Base:** Reutilizáveis e agnósticos de contexto (Button, Card)
5. **Hooks:** Lógica reutilizável (useSidebarState, useBreakpoint)
6. **Utils:** Funções puras auxiliares

### Responsividade

**Breakpoints (Tailwind):**
```js
screens: {
  'md': '768px',   // Tablet
  'lg': '1280px',  // Desktop
  'xl': '1920px',  // Wide / 4K
}
```

**Estratégia:**
- Mobile-first: Base em mobile (<768px)
- Progressive enhancement: Layout evolui conforme breakpoint
- Sidebar renderiza condicionalmente: `{width >= 1280 && <Sidebar />}`
- Header Mobile renderiza condicionalmente: `{width < 1280 && <HeaderMobile />}`

### Design Tokens (CSS Variables)

**Arquivo `styles/tokens.css`:**
```css
:root {
  /* Cores Semânticas */
  --color-primary: var(--lime-500);
  --color-bg: var(--gray-50);
  --color-surface: #ffffff;
  --color-text-primary: var(--gray-900);
  --color-text-secondary: var(--gray-600);
  
  /* Cores Primitivas */
  --gray-50: #FAFAFA;
  --gray-100: #F5F5F5;
  /* ... resto da escala */
  
  /* Espaçamentos */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Tipografia */
  --font-size-base: 16px;
  --font-size-lg: 18px;
  /* ... */
}
```

**Uso no Tailwind (tailwind.config.js):**
```js
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      gray: {
        50: 'var(--gray-50)',
        100: 'var(--gray-100)',
        // ...
      }
    },
    spacing: {
      // Usar CSS variables quando possível
    }
  }
}
```

---

## 🎯 RESUMO DA ARQUITETURA

### Princípios Guiadores
1. **Componentes pequenos e reutilizáveis**
2. **Separação de responsabilidades:** Layout | Páginas | Features | UI Base
3. **Mobile-first e fluido:** Nunca larguras fixas em containers principais
4. **Hierarquia de tokens:** Semântica → Primitiva → Conversão
5. **Condicional render:** Sidebar OU HeaderMobile, nunca ambos
6. **Hooks para lógica:** Estado e efeitos colaterais isolados

### Fluxo de Desenvolvimento
1. **Design System primeiro:** Tokens CSS definidos
2. **Layout base:** MainLayout + Sidebar/HeaderMobile
3. **Páginas:** Dashboard, Cartões, Transações, Perfil
4. **Componentes de feature:** Conforme necessidade
5. **Refinamento:** Responsividade e polimento

### Validação
- Build passa sem erros (`npm run build`)
- Layout fluido em todos os breakpoints
- Nenhum hardcoded quando existe token
- Sidebar/HeaderMobile nunca juntos
- Zero overflow horizontal

---

## ✅ CONCLUSÃO DO PROMPT 0

**Status:** Análise completa e arquitetura definida
**Próximo passo:** PROMPT 1 - Estrutura Base do Projeto

**Observações:**
- Esta análise foi baseada nas regras e padrões típicos de dashboards financeiros
- Quando tivermos acesso visual ao Figma (via MCP ou screenshots), refinaremos:
  - Componentes específicos e suas hierarquias
  - Tokens exatos do design system
  - Conversões precisas de valores hardcoded
