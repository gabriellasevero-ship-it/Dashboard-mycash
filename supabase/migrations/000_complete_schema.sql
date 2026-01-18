-- ============================================
-- 🗄️ MIGRAÇÃO COMPLETA: Banco de Dados mycash+ v2.0
-- ============================================
-- Este arquivo contém TODAS as migrações necessárias
-- Execute este arquivo no SQL Editor do Supabase (uma única vez)
--
-- INSTRUÇÕES:
-- 1. Abra https://app.supabase.com
-- 2. Selecione seu projeto
-- 3. Vá em "SQL Editor" (menu lateral)
-- 4. Clique em "New Query"
-- 5. Cole TODO este conteúdo
-- 6. Clique em "Run" (ou Ctrl+Enter / Cmd+Enter)
-- 7. Aguarde a mensagem "Success" ✅
-- ============================================

-- ============================================
-- 📦 ENUMS
-- ============================================

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE account_type AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT_CARD');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE recurrence_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 👤 USUÁRIOS E AUTENTICAÇÃO
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 👨‍👩‍👧‍👦 MEMBROS DA FAMÍLIA
-- ============================================

CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- "Pai", "Mãe", "Filho", etc
  avatar_url TEXT,
  monthly_income NUMERIC(12, 2) DEFAULT 0,
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);

-- ============================================
-- 🏷️ CATEGORIAS
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📌',
  type transaction_type NOT NULL,
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id_type ON categories(user_id, type);

-- ============================================
-- 💳 CONTAS E CARTÕES (UNIFICADO)
-- ============================================

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type account_type NOT NULL,
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  last_digits TEXT,
  holder_id UUID NOT NULL REFERENCES family_members(id),
  
  -- Campos para conta corrente/poupança
  balance NUMERIC(12, 2) DEFAULT 0,
  
  -- Campos para cartão de crédito
  credit_limit NUMERIC(12, 2),
  current_bill NUMERIC(12, 2) DEFAULT 0,
  due_day INTEGER CHECK (due_day >= 1 AND due_day <= 31),
  closing_day INTEGER CHECK (closing_day >= 1 AND closing_day <= 31),
  theme TEXT DEFAULT 'black', -- "black", "lime", "white"
  logo_url TEXT,
  
  -- Metadata
  color TEXT DEFAULT '#3247FF',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id_type ON accounts(user_id, type);
CREATE INDEX IF NOT EXISTS idx_accounts_holder_id ON accounts(holder_id);

-- ============================================
-- 💰 TRANSAÇÕES
-- ============================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  
  -- Parcelamento
  installment_number INTEGER CHECK (installment_number >= 1 AND installment_number <= 12),
  total_installments INTEGER DEFAULT 1 CHECK (total_installments >= 1 AND total_installments <= 12),
  parent_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  
  -- Recorrência
  is_recurring BOOLEAN DEFAULT false,
  recurring_transaction_id UUID, -- Será referenciado depois
  
  -- Status
  status transaction_status DEFAULT 'COMPLETED',
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_member_id ON transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_transactions_parent_id ON transactions(parent_transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- ============================================
-- 💫 TRANSAÇÕES RECORRENTES (TEMPLATE)
-- ============================================

CREATE TABLE IF NOT EXISTS recurring_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type DEFAULT 'EXPENSE',
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  
  -- Configuração de recorrência
  frequency recurrence_frequency NOT NULL,
  day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Domingo
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recurring_user_active ON recurring_transactions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_category_id ON recurring_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_recurring_account_id ON recurring_transactions(account_id);

-- Adicionar foreign key de recurring_transaction_id após criar a tabela
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'fk_transactions_recurring'
  ) THEN
    ALTER TABLE transactions 
      ADD CONSTRAINT fk_transactions_recurring 
      FOREIGN KEY (recurring_transaction_id) 
      REFERENCES recurring_transactions(id) 
      ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================
-- 🔄 TRIGGERS PARA UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_family_members_updated_at ON family_members;
CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recurring_transactions_updated_at ON recurring_transactions;
CREATE TRIGGER update_recurring_transactions_updated_at BEFORE UPDATE ON recurring_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 🔒 ROW LEVEL SECURITY (RLS)
-- ============================================

-- USERS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- FAMILY MEMBERS
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own family members" ON family_members;
CREATE POLICY "Users can view own family members" ON family_members
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own family members" ON family_members;
CREATE POLICY "Users can insert own family members" ON family_members
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own family members" ON family_members;
CREATE POLICY "Users can update own family members" ON family_members
  FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own family members" ON family_members;
CREATE POLICY "Users can delete own family members" ON family_members
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- CATEGORIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own categories" ON categories;
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own categories" ON categories;
CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own categories" ON categories;
CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own categories" ON categories;
CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- ACCOUNTS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own accounts" ON accounts;
CREATE POLICY "Users can view own accounts" ON accounts
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own accounts" ON accounts;
CREATE POLICY "Users can insert own accounts" ON accounts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own accounts" ON accounts;
CREATE POLICY "Users can update own accounts" ON accounts
  FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own accounts" ON accounts;
CREATE POLICY "Users can delete own accounts" ON accounts
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- TRANSACTIONS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- RECURRING TRANSACTIONS
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own recurring transactions" ON recurring_transactions;
CREATE POLICY "Users can view own recurring transactions" ON recurring_transactions
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own recurring transactions" ON recurring_transactions;
CREATE POLICY "Users can insert own recurring transactions" ON recurring_transactions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own recurring transactions" ON recurring_transactions;
CREATE POLICY "Users can update own recurring transactions" ON recurring_transactions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own recurring transactions" ON recurring_transactions;
CREATE POLICY "Users can delete own recurring transactions" ON recurring_transactions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- ============================================
-- 🔐 AUTH TRIGGER E VALIDAÇÕES
-- ============================================

-- Trigger: Criar User após Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Validação: Transações recorrentes não podem ser parceladas
CREATE OR REPLACE FUNCTION validate_transaction_installments()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_recurring = true AND NEW.total_installments > 1 THEN
    RAISE EXCEPTION 'Transações recorrentes não podem ser parceladas. Total de parcelas deve ser 1.';
  END IF;
  
  IF NEW.total_installments < 1 OR NEW.total_installments > 12 THEN
    RAISE EXCEPTION 'Total de parcelas deve estar entre 1 e 12.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_transaction_before_insert ON transactions;
CREATE TRIGGER validate_transaction_before_insert
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_installments();

-- Validação: Campos condicionais de Account
CREATE OR REPLACE FUNCTION validate_account_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'CREDIT_CARD' THEN
    IF NEW.credit_limit IS NULL OR NEW.credit_limit <= 0 THEN
      RAISE EXCEPTION 'Cartão de crédito deve ter limite válido maior que zero.';
    END IF;
    
    IF NEW.due_day IS NULL OR NEW.due_day < 1 OR NEW.due_day > 31 THEN
      RAISE EXCEPTION 'Cartão de crédito deve ter dia de vencimento válido (1-31).';
    END IF;
    
    IF NEW.closing_day IS NULL OR NEW.closing_day < 1 OR NEW.closing_day > 31 THEN
      RAISE EXCEPTION 'Cartão de crédito deve ter dia de fechamento válido (1-31).';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_account_before_insert ON accounts;
CREATE TRIGGER validate_account_before_insert
  BEFORE INSERT OR UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION validate_account_fields();

-- ============================================
-- 📦 STORAGE BUCKETS E POLICIES
-- ============================================

-- Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'account-logos',
  'account-logos',
  true,
  2097152, -- 2MB
  ARRAY['image/png', 'image/svg+xml', 'image/jpeg']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- Storage Policies - Avatares
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Storage Policies - Account Logos
DROP POLICY IF EXISTS "Users can upload account logos" ON storage.objects;
CREATE POLICY "Users can upload account logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'account-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update account logos" ON storage.objects;
CREATE POLICY "Users can update account logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'account-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete account logos" ON storage.objects;
CREATE POLICY "Users can delete account logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'account-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Public account logo access" ON storage.objects;
CREATE POLICY "Public account logo access"
ON storage.objects FOR SELECT
USING (bucket_id = 'account-logos');

-- Storage Policies - Documents (Privado)
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- 🔧 FUNÇÕES AUXILIARES E CÁLCULOS
-- ============================================

-- Calcular Saldo Total
CREATE OR REPLACE FUNCTION calculate_total_balance(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_total_balance NUMERIC := 0;
  v_accounts_balance NUMERIC := 0;
  v_credit_cards_bill NUMERIC := 0;
BEGIN
  SELECT COALESCE(SUM(balance), 0)
  INTO v_accounts_balance
  FROM accounts
  WHERE user_id = p_user_id
    AND type IN ('CHECKING', 'SAVINGS')
    AND is_active = true;
  
  SELECT COALESCE(SUM(current_bill), 0)
  INTO v_credit_cards_bill
  FROM accounts
  WHERE user_id = p_user_id
    AND type = 'CREDIT_CARD'
    AND is_active = true;
  
  v_total_balance := v_accounts_balance - v_credit_cards_bill;
  
  RETURN v_total_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Resumo do Período
CREATE OR REPLACE FUNCTION calculate_period_summary(
  p_user_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  total_income NUMERIC,
  total_expenses NUMERIC,
  net_amount NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) as total_expenses,
    COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END), 0) as net_amount
  FROM transactions
  WHERE user_id = p_user_id
    AND date BETWEEN p_start_date AND p_end_date
    AND status = 'COMPLETED';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gastos por Categoria
CREATE OR REPLACE FUNCTION get_expenses_by_category(
  p_user_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  category_id UUID,
  category_name TEXT,
  total_amount NUMERIC,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id as category_id,
    c.name as category_name,
    COALESCE(SUM(t.amount), 0) as total_amount,
    COUNT(t.id) as transaction_count
  FROM categories c
  LEFT JOIN transactions t ON t.category_id = c.id
    AND t.user_id = p_user_id
    AND t.type = 'EXPENSE'
    AND t.status = 'COMPLETED'
    AND (p_start_date IS NULL OR t.date >= p_start_date)
    AND (p_end_date IS NULL OR t.date <= p_end_date)
  WHERE c.user_id = p_user_id
    AND c.type = 'EXPENSE'
    AND c.is_active = true
  GROUP BY c.id, c.name
  HAVING COUNT(t.id) > 0
  ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Taxa de Poupança
CREATE OR REPLACE FUNCTION calculate_savings_rate(
  p_user_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS NUMERIC AS $$
DECLARE
  v_income NUMERIC;
  v_expenses NUMERIC;
  v_rate NUMERIC;
BEGIN
  SELECT
    COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)
  INTO v_income, v_expenses
  FROM transactions
  WHERE user_id = p_user_id
    AND date BETWEEN p_start_date AND p_end_date
    AND status = 'COMPLETED';
  
  IF v_income = 0 THEN
    RETURN 0;
  END IF;
  
  v_rate := ((v_income - v_expenses) / v_income) * 100;
  RETURN v_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ✅ COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ============================================

COMMENT ON TABLE users IS 'Contas autenticadas do sistema. Um usuário pode ter múltiplos family_members.';
COMMENT ON TABLE family_members IS 'Pessoas da família associadas a um usuário. Pode ser pai, mãe, filhos, etc.';
COMMENT ON TABLE categories IS 'Categorias de transações (receitas ou despesas) personalizadas por usuário.';
COMMENT ON TABLE accounts IS 'Contas bancárias e cartões de crédito unificados. Campos variam conforme o tipo.';
COMMENT ON TABLE transactions IS 'Transações financeiras com suporte a parcelamento e recorrência.';
COMMENT ON TABLE recurring_transactions IS 'Templates de transações recorrentes que geram transactions automaticamente.';

-- ============================================
-- ✅ FIM DA MIGRAÇÃO
-- ============================================
-- Se você vê esta mensagem, tudo foi executado com sucesso! 🎉
-- Verifique as tabelas no "Table Editor" do Supabase
-- ============================================