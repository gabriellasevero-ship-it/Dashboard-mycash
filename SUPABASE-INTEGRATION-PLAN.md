# 🗄️ Plano de Integração Supabase - mycash+ v2.0

## 📋 Sumário Executivo

Este documento detalha o plano completo para migração do sistema de dados mock para Supabase, incluindo:
- Criação de schema completo baseado no Prisma
- Configuração de Row Level Security (RLS)
- Funções CRUD e stored procedures
- Configuração de Storage para assets
- Autenticação simplificada
- Migração gradual do código frontend

---

## 🏗️ FASE 1: Configuração do Banco de Dados

### 1.1. Criar Schema SQL

Arquivo: `supabase/migrations/001_initial_schema.sql`

**Conteúdo:**
- Todas as tabelas do schema Prisma
- Enums necessários
- Índices otimizados
- Foreign keys com cascade apropriado

### 1.2. Tabelas Principais

1. **users** - Autenticação e usuários principais
2. **family_members** - Membros da família
3. **categories** - Categorias de transações
4. **accounts** - Contas bancárias e cartões (unificado)
5. **transactions** - Transações financeiras
6. **recurring_transactions** - Templates de recorrência

### 1.3. Enums PostgreSQL

```sql
CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE account_type AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT_CARD');
CREATE TYPE recurrence_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED');
```

---

## 🔒 FASE 2: Row Level Security (RLS)

### 2.1. Política Geral

**Regra:** Todos os usuários autenticados têm acesso total às suas próprias tabelas.

**Abordagem:**
- Usar `auth.uid()` para identificar o usuário
- Todas as queries filtram automaticamente por `user_id`
- RLS habilitado em todas as tabelas

### 2.2. Policies por Tabela

**Padrão para todas as tabelas:**
```sql
-- SELECT: Usuário vê apenas seus dados
CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid()::text = user_id);

-- INSERT: Usuário cria apenas seus dados
CREATE POLICY "Users can insert own data" ON table_name
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- UPDATE: Usuário atualiza apenas seus dados
CREATE POLICY "Users can update own data" ON table_name
  FOR UPDATE USING (auth.uid()::text = user_id);

-- DELETE: Usuário deleta apenas seus dados
CREATE POLICY "Users can delete own data" ON table_name
  FOR DELETE USING (auth.uid()::text = user_id);
```

---

## 📦 FASE 3: Storage Configuration

### 3.1. Buckets Necessários

1. **avatars** - Avatares de usuários e membros da família
   - Público: Sim (para exibição)
   - Tamanho máximo: 5MB
   - Tipos: image/jpeg, image/png, image/webp

2. **account-logos** - Logos de bancos/cartões
   - Público: Sim
   - Tamanho máximo: 2MB
   - Tipos: image/png, image/svg+xml

3. **documents** - Documentos financeiros (opcional futuro)
   - Público: Não
   - Tamanho máximo: 10MB
   - Tipos: application/pdf, image/*

### 3.2. Storage Policies

```sql
-- Upload de avatar: apenas próprio usuário
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Leitura pública de avatares
CREATE POLICY "Public avatar access" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
```

---

## 🔐 FASE 4: Autenticação Simplificada

### 4.1. Estratégia

- Usar Supabase Auth (Email + Password)
- Não usar OAuth inicialmente (pode ser adicionado depois)
- Configurar triggers para criar registro em `users` após signup

### 4.2. Trigger de Criação Automática

```sql
-- Função para criar registro em users após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🔧 FASE 5: Funções e Stored Procedures

### 5.1. Funções de Cálculo

**`calculate_total_balance(user_id UUID)`**
- Calcula saldo total (contas - faturas de cartões)

**`calculate_period_summary(user_id UUID, start_date DATE, end_date DATE)`**
- Retorna resumo de receitas e despesas do período

**`get_expenses_by_category(user_id UUID, start_date DATE, end_date DATE)`**
- Agrupa despesas por categoria

### 5.2. Funções de Validação

**`validate_transaction_installments()`**
- Garante que transações recorrentes não sejam parceladas

**`validate_account_fields()`**
- Valida campos condicionais baseado no tipo de conta

### 5.3. Triggers Automáticos

**`update_account_balance()`**
- Atualiza saldo da conta ao criar/atualizar transação

**`generate_recurring_transactions()`**
- Gera transações baseadas em templates recorrentes (executado diariamente via cron)

---

## 📝 FASE 6: Migração do Código Frontend

### 6.1. Instalação de Dependências

```bash
npm install @supabase/supabase-js
```

### 6.2. Estrutura de Pastas Proposta

```
src/
├── lib/
│   └── supabase.ts           # Cliente Supabase
├── hooks/
│   ├── useSupabase.ts        # Hook base
│   ├── useTransactions.ts    # CRUD de transações
│   ├── useAccounts.ts        # CRUD de contas
│   ├── useFamilyMembers.ts   # CRUD de membros
│   └── useAuth.ts            # Autenticação
├── services/
│   ├── transactionService.ts # Lógica de negócio
│   ├── accountService.ts
│   └── calculationService.ts # Cálculos complexos
└── contexts/
    └── FinanceContext.tsx    # REFATORADO para usar Supabase
```

### 6.3. Ordem de Migração

1. ✅ Configurar cliente Supabase
2. ✅ Implementar autenticação
3. ⬜ Migrar FamilyMembers (mais simples)
4. ⬜ Migrar Categories
5. ⬜ Migrar Accounts
6. ⬜ Migrar Transactions (mais complexo)
7. ⬜ Migrar RecurringTransactions
8. ⬜ Atualizar funções de cálculo
9. ⬜ Integrar Storage
10. ⬜ Remover dados mock

### 6.4. Estratégia de Migração

**Abordagem Gradual:**
- Manter `FinanceContext` durante migração
- Substituir funções CRUD uma a uma
- Usar React Query ou SWR para cache/otimização
- Manter compatibilidade com componentes existentes

---

## 🧪 FASE 7: Testes e Validação

### 7.1. Testes de Integração

- [ ] Testar autenticação completa (signup, login, logout)
- [ ] Testar CRUD de todas as entidades
- [ ] Testar RLS (usuário não acessa dados de outros)
- [ ] Testar upload/download de arquivos
- [ ] Testar cálculos financeiros
- [ ] Testar transações recorrentes

### 7.2. Performance

- [ ] Verificar índices (EXPLAIN ANALYZE)
- [ ] Testar queries com muitos dados
- [ ] Otimizar N+1 queries
- [ ] Implementar paginação onde necessário

---

## 📅 Timeline Estimado

| Fase | Duração | Prioridade |
|------|---------|------------|
| Fase 1: Schema SQL | 2-3 horas | 🔴 Alta |
| Fase 2: RLS | 1-2 horas | 🔴 Alta |
| Fase 3: Storage | 1 hora | 🟡 Média |
| Fase 4: Auth | 2 horas | 🔴 Alta |
| Fase 5: Funções | 3-4 horas | 🟡 Média |
| Fase 6: Migração Frontend | 8-12 horas | 🔴 Alta |
| Fase 7: Testes | 3-4 horas | 🔴 Alta |

**Total estimado:** 20-28 horas

---

## 🚨 Pontos de Atenção

### 7.1. Diferenças Schema Prisma vs Supabase

1. **UUIDs**: Supabase usa `uuid()` nativo, Prisma usa `@default(uuid())`
2. **Decimais**: Converter `@db.Decimal(12, 2)` para `NUMERIC(12, 2)`
3. **Enums**: Criar como TYPE no PostgreSQL
4. **Timestamps**: Usar `TIMESTAMPTZ` para timezone

### 7.2. Compatibilidade TypeScript

- Gerar tipos TypeScript do Supabase: `supabase gen types typescript`
- Ajustar tipos existentes para compatibilidade
- Manter tipagem forte em todo o fluxo

### 7.3. Migração de Dados Mock (Opcional)

Se quiser manter dados para testes:
- Criar script SQL para seed inicial
- Executar apenas em ambiente de desenvolvimento
- Não incluir em produção

---

## 📚 Próximos Passos

1. **Agora**: Revisar e aprovar este plano
2. **Próximo**: Executar Fase 1 (criar migrations SQL)
3. **Depois**: Configurar RLS e testar acesso
4. **Em seguida**: Começar migração frontend gradual

---

## 📖 Referências

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
