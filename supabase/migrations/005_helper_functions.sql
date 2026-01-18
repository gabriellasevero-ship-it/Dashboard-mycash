-- ============================================
-- 🔧 MIGRATION 005: Funções Auxiliares e Cálculos
-- ============================================
-- Funções para cálculos financeiros e utilitários

-- ============================================
-- 💰 CALCULAR SALDO TOTAL
-- ============================================

CREATE OR REPLACE FUNCTION calculate_total_balance(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_total_balance NUMERIC := 0;
  v_accounts_balance NUMERIC := 0;
  v_credit_cards_bill NUMERIC := 0;
BEGIN
  -- Soma saldos de contas (CHECKING e SAVINGS)
  SELECT COALESCE(SUM(balance), 0)
  INTO v_accounts_balance
  FROM accounts
  WHERE user_id = p_user_id
    AND type IN ('CHECKING', 'SAVINGS')
    AND is_active = true;
  
  -- Soma faturas de cartões de crédito
  SELECT COALESCE(SUM(current_bill), 0)
  INTO v_credit_cards_bill
  FROM accounts
  WHERE user_id = p_user_id
    AND type = 'CREDIT_CARD'
    AND is_active = true;
  
  -- Saldo total = contas - faturas de cartões
  v_total_balance := v_accounts_balance - v_credit_cards_bill;
  
  RETURN v_total_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 📊 RESUMO DO PERÍODO
-- ============================================

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

-- ============================================
-- 📈 GASTOS POR CATEGORIA
-- ============================================

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

-- ============================================
-- 🎯 TAXA DE POUPANÇA
-- ============================================

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
