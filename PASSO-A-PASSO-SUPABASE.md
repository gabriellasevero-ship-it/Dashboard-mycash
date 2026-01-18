# 🎯 Passo a Passo SIMPLES - Criar Banco no Supabase

## O que você precisa fazer:

### ✅ Passo 1: Criar o Projeto (isso cria o banco automaticamente)

1. **Abra seu navegador e vá para:**
   ```
   https://app.supabase.com
   ```

2. **Faça login** (ou crie uma conta grátis)

3. **Clique no botão "New Project"** (canto superior direito ou na página inicial)

4. **Preencha o formulário:**
   - **Name:** `mycash-plus` (ou qualquer nome)
   - **Database Password:** Escolha uma senha forte (anote em algum lugar!)
   - **Region:** Escolha a mais próxima (ex: South America - São Paulo)

5. **Clique em "Create new project"**

6. **Aguarde 2-3 minutos** enquanto o Supabase cria tudo automaticamente
   - ✅ Um banco de dados PostgreSQL é criado automaticamente
   - ✅ Você já tem um banco funcionando!

---

### ✅ Passo 2: Copiar as Credenciais (URL e chave)

Depois que o projeto terminar de criar:

1. **No menu lateral esquerdo, clique em "Settings"** (ícone de engrenagem ⚙️)

2. **Clique em "API"**

3. **Você verá duas informações importantes:**
   
   **a) Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   👆 **Copie essa URL**
   
   **b) anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```
   👆 **Copie essa chave** (é bem longa, certifique-se de copiar tudo)

---

### ✅ Passo 3: Criar arquivo .env.local no projeto

1. **Na raiz do seu projeto** (onde está o `package.json`)

2. **Crie um arquivo chamado `.env.local`**

3. **Cole isso no arquivo:**
   ```env
   VITE_SUPABASE_URL=https://cole-aqui-a-url-do-passo-2
   VITE_SUPABASE_ANON_KEY=cole-aqui-a-chave-do-passo-2
   ```

   **Exemplo real:**
   ```env
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYz...
   ```

---

### ✅ Passo 4: Criar as Tabelas no Banco (executar SQLs)

O banco já existe, mas está vazio. Agora precisamos criar as tabelas executando SQLs:

1. **No Dashboard do Supabase, no menu lateral esquerdo, clique em "SQL Editor"**

2. **Clique no botão "New Query"** (ou use o botão "+ New Query")

3. **Abra o arquivo `supabase/migrations/001_initial_schema.sql` no seu editor de código**

4. **Selecione TODO o conteúdo do arquivo** (Ctrl+A / Cmd+A)

5. **Copie** (Ctrl+C / Cmd+C)

6. **Cole no editor SQL do Supabase**

7. **Clique no botão "Run"** (ou pressione Ctrl+Enter / Cmd+Enter)

8. **Aguarde e veja a mensagem:** "Success. No rows returned" ✅

9. **Repita os passos 3-8 para os outros arquivos:**
   - `002_rls_policies.sql`
   - `003_auth_trigger.sql`
   - `004_storage_setup.sql`
   - `005_helper_functions.sql`

   **IMPORTANTE:** Execute na ordem! (001, 002, 003, 004, 005)

---

### ✅ Passo 5: Verificar se funcionou

1. **No menu lateral, clique em "Table Editor"**

2. **Você deve ver estas tabelas:**
   - ✅ `users`
   - ✅ `family_members`
   - ✅ `categories`
   - ✅ `accounts`
   - ✅ `transactions`
   - ✅ `recurring_transactions`

   Se aparecerem essas tabelas = **SUCESSO!** 🎉

3. **Clique em "Storage" no menu lateral**

4. **Você deve ver estes buckets:**
   - ✅ `avatars`
   - ✅ `account-logos`
   - ✅ `documents`

---

## 📝 Resumo Visual:

```
1. Criar projeto no Supabase → Banco criado automaticamente ✅
2. Copiar URL e chave → Colar no .env.local ✅
3. Executar SQLs (001→002→003→004→005) → Tabelas criadas ✅
4. Verificar tabelas no Table Editor → Pronto! ✅
```

---

## ⚠️ Erros Comuns:

**"Project URL não funciona"**
- Certifique-se de copiar a URL completa (começa com https://)
- Verifique se não tem espaços extras

**"Erro ao executar SQL"**
- Execute os arquivos na ordem (001 primeiro, depois 002, etc.)
- Certifique-se de copiar o arquivo SQL completo
- Verifique se não há erros de sintaxe (os arquivos já estão corretos)

**"Tabelas não aparecem"**
- Verifique se executou TODAS as migrations (5 arquivos)
- Recarregue a página do Table Editor

---

## 🆘 Precisa de ajuda?

Se der algum erro, me envie:
1. Qual passo você estava fazendo
2. A mensagem de erro completa
3. Screenshot se possível
