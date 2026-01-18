# 🚀 Como Executar a Migração no Supabase

## ✅ Passo 1: Acesse o SQL Editor

1. Abra https://app.supabase.com no seu navegador
2. Faça login na sua conta
3. Selecione seu projeto `mycash-plus` (ou o nome que você deu)
4. No menu lateral esquerdo, clique em **"SQL Editor"** (ícone de banco de dados)

---

## ✅ Passo 2: Abra o Arquivo SQL

1. No SQL Editor, clique no botão **"New Query"** (ou use o botão "+" no topo)
2. Você verá um editor de texto vazio
3. Abra o arquivo `supabase/migrations/000_complete_schema.sql` no seu editor de código (VS Code, etc)
4. Selecione TODO o conteúdo do arquivo (Ctrl+A / Cmd+A)
5. Copie (Ctrl+C / Cmd+C)

---

## ✅ Passo 3: Cole e Execute

1. Cole o conteúdo no editor SQL do Supabase (Ctrl+V / Cmd+V)
2. Verifique se todo o SQL foi colado corretamente (deve ter ~700 linhas)
3. Clique no botão **"Run"** no canto superior direito do editor (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
4. Aguarde alguns segundos...

---

## ✅ Passo 4: Verificar Sucesso

### Você deve ver a mensagem:
```
Success. No rows returned
```

### Verifique as Tabelas:
1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver estas 6 tabelas:
   - ✅ `users`
   - ✅ `family_members`
   - ✅ `categories`
   - ✅ `accounts`
   - ✅ `transactions`
   - ✅ `recurring_transactions`

### Verifique os Buckets de Storage:
1. No menu lateral, clique em **"Storage"**
2. Você deve ver estes 3 buckets:
   - ✅ `avatars`
   - ✅ `account-logos`
   - ✅ `documents`

---

## ⚠️ Se Der Erro

### Erro: "relation already exists"
- Isso significa que algumas tabelas já existem
- **Solução:** O SQL está preparado para isso (usa `IF NOT EXISTS`)
- Continue executando normalmente, mas ignore avisos sobre objetos já existentes

### Erro: "permission denied"
- Certifique-se de estar logado no projeto correto
- Verifique se você tem permissão de administrador no projeto

### Erro: "syntax error"
- Certifique-se de copiar TODO o arquivo, sem cortar nada
- Verifique se não há caracteres estranhos no final
- Tente copiar novamente do arquivo original

### Outros erros
- Me envie a mensagem de erro completa
- Tire um screenshot se possível

---

## 📝 Próximos Passos

Após executar a migração com sucesso:

1. ✅ Configure as variáveis de ambiente (`.env.local`)
2. ✅ Teste a conexão com o banco
3. ✅ Refatore o `FinanceContext` para usar Supabase

---

## 🎉 Pronto!

Se tudo deu certo, seu banco de dados está configurado e pronto para uso! 🚀