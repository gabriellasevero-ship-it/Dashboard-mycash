# ⚙️ Configuração do Supabase - Passo a Passo

## 🎯 Objetivo

Este guia te ajudará a configurar o Supabase do zero para o projeto mycash+.

---

## 📋 Passo 1: Criar Projeto no Supabase

1. **Acesse o Dashboard:**
   - Vá para [https://app.supabase.com](https://app.supabase.com)
   - Faça login ou crie uma conta

2. **Criar Novo Projeto:**
   - Clique em **"New Project"**
   - Preencha:
     - **Name:** `mycash-plus` (ou qualquer nome)
     - **Database Password:** (anote esta senha! Você precisará se for usar PostgreSQL direto)
     - **Region:** Escolha a mais próxima (South America se estiver no Brasil)
   - Clique em **"Create new project"**
   - ⏳ Aguarde 2-3 minutos para o projeto ser criado

---

## 📋 Passo 2: Obter Credenciais

1. **No Dashboard do projeto, vá em:**
   - **Settings** → **API** (menu lateral esquerdo)

2. **Copie as seguintes informações:**
   - **Project URL** (exemplo: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (chave longa começando com `eyJ...`)

   ⚠️ **IMPORTANTE:** Não compartilhe essas chaves publicamente!

---

## 📋 Passo 3: Configurar Variáveis de Ambiente

### Opção A: Usando o Script Automático

```bash
./scripts/setup-supabase.sh
```

O script irá pedir:
- Project URL
- Anon Key

E criará o arquivo `.env.local` automaticamente.

### Opção B: Manual

1. **Crie o arquivo `.env.local` na raiz do projeto:**

```bash
touch .env.local
```

2. **Adicione as seguintes linhas:**

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

3. **Substitua os valores pelos que você copiou no Passo 2**

---

## 📋 Passo 4: Executar Migrations SQL

As migrations criam todas as tabelas, políticas RLS, triggers e funções necessárias.

### Como Executar:

1. **No Dashboard do Supabase:**
   - Vá em **SQL Editor** (menu lateral)

2. **Execute cada arquivo na ordem:**

   **Migration 001: Schema Inicial**
   - Clique em **"New Query"**
   - Copie todo o conteúdo de `supabase/migrations/001_initial_schema.sql`
   - Cole no editor
   - Clique em **"Run"** (ou pressione Ctrl/Cmd + Enter)
   - ✅ Verifique se aparece "Success. No rows returned"

   **Migration 002: RLS Policies**
   - Criar nova query
   - Copiar `supabase/migrations/002_rls_policies.sql`
   - Executar

   **Migration 003: Auth Trigger**
   - Criar nova query
   - Copiar `supabase/migrations/003_auth_trigger.sql`
   - Executar

   **Migration 004: Storage Setup**
   - Criar nova query
   - Copiar `supabase/migrations/004_storage_setup.sql`
   - Executar

   **Migration 005: Helper Functions**
   - Criar nova query
   - Copiar `supabase/migrations/005_helper_functions.sql`
   - Executar

### Verificar Migrations

Após executar todas, verifique:

1. **Tabelas criadas:**
   - Vá em **Table Editor**
   - Você deve ver: `users`, `family_members`, `categories`, `accounts`, `transactions`, `recurring_transactions`

2. **Buckets de Storage:**
   - Vá em **Storage**
   - Você deve ver: `avatars`, `account-logos`, `documents`

---

## 📋 Passo 5: Verificar Configuração

Execute o script de verificação:

```bash
./scripts/check-supabase-config.sh
```

Ou verifique manualmente:

```bash
cat .env.local
```

Deve mostrar:
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## 📋 Passo 6: Reiniciar Servidor

```bash
# Parar servidor se estiver rodando (Ctrl+C)

# Reiniciar
npm run dev
```

O sistema agora está conectado ao Supabase!

---

## ✅ Checklist Final

- [ ] Projeto criado no Supabase
- [ ] Credenciais copiadas (URL e anon key)
- [ ] `.env.local` criado com credenciais
- [ ] Migration 001 executada (schema)
- [ ] Migration 002 executada (RLS)
- [ ] Migration 003 executada (auth trigger)
- [ ] Migration 004 executada (storage)
- [ ] Migration 005 executada (funções)
- [ ] Tabelas verificadas no Table Editor
- [ ] Buckets verificados no Storage
- [ ] Servidor reiniciado

---

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"

**Causa:** `.env.local` não existe ou está vazio

**Solução:**
```bash
# Verificar se arquivo existe
ls -la .env.local

# Criar se não existir
./scripts/setup-supabase.sh
```

### Erro: "User not authenticated"

**Causa:** RLS está bloqueando acesso

**Solução:** Isso é esperado! Você precisa implementar autenticação primeiro (useAuth hook já está criado).

### Erro ao executar migrations SQL

**Causa:** Ordem incorreta ou erro de sintaxe

**Solução:**
- Execute na ordem: 001 → 002 → 003 → 004 → 005
- Verifique se copiou o arquivo completo
- Veja logs no SQL Editor para detalhes do erro

### Erro: "relation already exists"

**Causa:** Migration já foi executada

**Solução:** Ignore ou delete as tabelas no Table Editor antes de executar novamente.

---

## 📚 Próximos Passos

Após configurar:

1. ✅ Testar autenticação (criar telas de login/signup)
2. ✅ Migrar FinanceContext para usar services
3. ✅ Testar CRUD de todas as entidades
4. ✅ Integrar Storage para upload de avatares

Veja `INTEGRATION-CHECKLIST.md` para progresso detalhado.

---

## 🔗 Links Úteis

- [Supabase Dashboard](https://app.supabase.com)
- [Documentação Supabase](https://supabase.com/docs)
- [SQL Editor](https://app.supabase.com/project/_/sql/new)
