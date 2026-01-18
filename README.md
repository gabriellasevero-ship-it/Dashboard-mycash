# mycash+ - Dashboard Financeiro Familiar

Sistema de gestão financeira familiar desenvolvido com React, TypeScript e Vite.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento SPA

## 📦 Instalação

```bash
npm install
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── components/      # Componentes React
│   ├── layout/     # Sidebar, Header, MainLayout
│   ├── dashboard/  # Componentes do dashboard
│   ├── cards/      # Componentes de cartões
│   ├── transactions/ # Componentes de transações
│   ├── profile/    # Componentes de perfil
│   ├── modals/     # Modais do sistema
│   └── ui/         # Componentes base reutilizáveis
├── contexts/       # Context API providers
├── hooks/          # Hooks customizados
├── pages/          # Páginas principais
├── styles/         # CSS global e tokens
├── types/          # Tipos TypeScript
├── utils/          # Funções utilitárias
└── constants/      # Constantes do sistema
```

## 🎨 Design System

O projeto utiliza CSS Variables (tokens) que serão extraídos do Figma no PROMPT 2.

Hierarquia de tokens:
1. **Semânticos** - `--color-primary`, `--spacing-container`
2. **Primitivos** - `--gray-900`, `--spacing-md`
3. **Conversão** - hex/px → tokens mais próximos

## 📐 Breakpoints

- **Mobile:** < 768px
- **Tablet:** ≥ 768px e < 1280px
- **Desktop:** ≥ 1280px e < 1920px
- **Wide/4K:** ≥ 1920px

## 🔗 Rotas

- `/` - Dashboard
- `/cards` - Cartões de Crédito
- `/transactions` - Transações
- `/profile` - Perfil

## 📝 Status do Projeto

Em desenvolvimento - Sequência de prompts sendo implementada.
