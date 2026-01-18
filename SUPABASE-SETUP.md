# 🚀 Setup Supabase - Guia Rápido

## 📋 Passo 1: Criar Projeto no Supabase

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Crie um novo projeto
3. Aguarde a criação do banco (2-3 minutos)

## 📋 Passo 2: Executar Migrations

1. No Dashboard do Supabase, vá em **SQL Editor**
2. Execute os arquivos SQL na ordem:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_auth_trigger.sql`
   - `supabase/migrations/004_storage_setup.sql`
   - `supabase/migrations/005_helper_functions.sql`

**Dica:** Copie e cole cada arquivo completo no SQL Editor e execute.

## 📋 Passo 3: Obter Credenciais

1. No Dashboard, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (chave longa)

## 📋 Passo 4: Configurar Variáveis de Ambiente

1. Crie arquivo `.env.local` na raiz do projeto:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Reinicie o servidor de desenvolvimento

```bash
npm run dev
```

## 📋 Passo 5: Testar Conexão

O sistema tentará conectar automaticamente quando:
- Usuário fizer login/signup
- Componentes tentarem carregar dados

## ✅ Checklist Rápido

- [ ] Projeto criado no Supabase
- [ ] Migrations executadas (5 arquivos SQL)
- [ ] Credenciais copiadas
- [ ] `.env.local` criado com credenciais
- [ ] Servidor reiniciado

## 🐛 Troubleshooting

**Erro: "Missing Supabase environment variables"**
- Verifique se `.env.local` existe e tem as variáveis corretas
- Reinicie o servidor após criar/editar `.env.local`

**Erro: "User not authenticated"**
- Configure autenticação primeiro (criar telas de login/signup)
- Ou desabilite temporariamente RLS para testes (NÃO recomendado em produção)

**Erro ao executar migrations**
- Verifique se está executando na ordem correta
- Certifique-se de que o projeto está totalmente criado
- Verifique logs no SQL Editor do Supabase

## 📚 Próximos Passos

Após configurar, continue com a migração gradual:
1. Testar autenticação (useAuth hook)
2. Migrar FamilyMembers (já implementado)
3. Migrar Accounts e Transactions
4. Integrar nos componentes

Veja `INTEGRATION-CHECKLIST.md` para progresso detalhado.
