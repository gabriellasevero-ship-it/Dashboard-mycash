-- ============================================
-- 🔒 MIGRATION 002: Row Level Security Policies
-- ============================================
-- Habilita RLS e cria políticas para todas as tabelas
-- Regra: Usuário autenticado acessa APENAS seus próprios dados

-- ============================================
-- 👤 USERS
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Nota: INSERT é feito via trigger automático após signup no auth.users
-- DELETE não é permitido (apenas desativação)

-- ============================================
-- 👨‍👩‍👧‍👦 FAMILY MEMBERS
-- ============================================

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own family members" ON family_members
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own family members" ON family_members
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own family members" ON family_members
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own family members" ON family_members
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- ============================================
-- 🏷️ CATEGORIES
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- ============================================
-- 💳 ACCOUNTS
-- ============================================

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own accounts" ON accounts
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own accounts" ON accounts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own accounts" ON accounts
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own accounts" ON accounts
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- ============================================
-- 💰 TRANSACTIONS
-- ============================================

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- ============================================
-- 💫 RECURRING TRANSACTIONS
-- ============================================

ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recurring transactions" ON recurring_transactions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own recurring transactions" ON recurring_transactions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own recurring transactions" ON recurring_transactions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own recurring transactions" ON recurring_transactions
  FOR DELETE USING (auth.uid()::text = user_id::text);
