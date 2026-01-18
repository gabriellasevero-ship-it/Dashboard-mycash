# ✅ Checklist de Integração Supabase

Use este checklist para acompanhar o progresso da migração.

## 📦 Fase 1: Setup e Configuração

- [ ] Criar projeto no Supabase Dashboard
- [ ] Obter URL e anon key do projeto
- [ ] Configurar variáveis de ambiente (`.env.local`)
- [ ] Instalar dependências: `npm install @supabase/supabase-js`
- [ ] Executar migrations SQL na ordem:
  - [ ] `001_initial_schema.sql`
  - [ ] `002_rls_policies.sql`
  - [ ] `003_auth_trigger.sql`
  - [ ] `004_storage_setup.sql`
  - [ ] `005_helper_functions.sql`

## 🔐 Fase 2: Autenticação

- [ ] Criar cliente Supabase (`src/lib/supabase.ts`)
- [ ] Implementar hook `useAuth`
- [ ] Criar componente de Login/Signup
- [ ] Testar signup (deve criar registro em `users` automaticamente)
- [ ] Testar login/logout
- [ ] Adicionar proteção de rotas (se necessário)

## 📝 Fase 3: Migração de Entidades

### Family Members
- [ ] Criar service `familyMemberService.ts`
- [ ] Migrar CRUD de FamilyMembers
- [ ] Atualizar `FinanceContext` para usar Supabase
- [ ] Testar: criar, listar, atualizar, deletar membro

### Categories
- [ ] Criar service `categoryService.ts`
- [ ] Migrar CRUD de Categories
- [ ] Atualizar `FinanceContext`
- [ ] Testar todas operações

### Accounts (Contas + Cartões)
- [ ] Criar service `accountService.ts`
- [ ] Migrar CRUD de Accounts
- [ ] Lidar com campos condicionais (balance vs credit_limit)
- [ ] Atualizar `FinanceContext`
- [ ] Testar criação de conta bancária
- [ ] Testar criação de cartão de crédito

### Transactions
- [ ] Criar service `transactionService.ts`
- [ ] Migrar CRUD de Transactions
- [ ] Implementar lógica de parcelamento
- [ ] Implementar lógica de recorrência
- [ ] Atualizar `FinanceContext`
- [ ] Testar criação de transação simples
- [ ] Testar transação parcelada
- [ ] Testar transação recorrente

### Recurring Transactions (Opcional - Fase 2)
- [ ] Criar service `recurringTransactionService.ts`
- [ ] Implementar lógica de geração automática
- [ ] Testar criação de template recorrente

## 📊 Fase 4: Funções de Cálculo

- [ ] Migrar `calculateTotalBalance` para usar função SQL
- [ ] Migrar `calculateIncomeForPeriod`
- [ ] Migrar `calculateExpensesForPeriod`
- [ ] Migrar `calculateExpensesByCategory`
- [ ] Migrar `calculateSavingsRate`
- [ ] Testar todos os cálculos com dados reais

## 📁 Fase 5: Storage

- [ ] Criar service `storageService.ts`
- [ ] Implementar upload de avatar de usuário
- [ ] Implementar upload de avatar de membro
- [ ] Implementar upload de logo de conta/cartão
- [ ] Integrar upload nos modais relevantes
- [ ] Testar upload/download de imagens

## 🧹 Fase 6: Limpeza

- [ ] Remover dados mock de `FinanceContext`
- [ ] Remover função `generateId()` (usar UUIDs do Supabase)
- [ ] Atualizar tipos TypeScript se necessário
- [ ] Gerar tipos do Supabase: `npx supabase gen types typescript`
- [ ] Atualizar imports em todos os componentes
- [ ] Remover código não utilizado

## 🧪 Fase 7: Testes

- [ ] Testar autenticação completa
- [ ] Testar CRUD de todas as entidades
- [ ] Testar RLS (tentar acessar dados de outro usuário)
- [ ] Testar cálculos com diferentes cenários
- [ ] Testar upload/download de arquivos
- [ ] Testar performance com muitos dados
- [ ] Testar em diferentes browsers
- [ ] Testar responsividade com dados reais

## 📚 Fase 8: Documentação

- [ ] Documentar configuração do Supabase
- [ ] Documentar estrutura de serviços
- [ ] Documentar como adicionar novas entidades
- [ ] Atualizar README.md com instruções de setup
- [ ] Criar guia de troubleshooting

## 🚀 Fase 9: Deploy

- [ ] Configurar variáveis de ambiente em produção
- [ ] Executar migrations em produção
- [ ] Testar autenticação em produção
- [ ] Monitorar logs do Supabase
- [ ] Configurar backup automático (Supabase faz isso)

---

## 📝 Notas

- Migração pode ser feita gradualmente (não precisa migrar tudo de uma vez)
- Manter compatibilidade com componentes existentes durante migração
- Usar React Query ou SWR para cache e otimização de queries
- Considerar implementar paginação para grandes volumes de dados
