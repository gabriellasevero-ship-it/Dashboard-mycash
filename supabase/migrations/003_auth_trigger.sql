-- ============================================
-- 🔐 MIGRATION 003: Auth Trigger e Funções
-- ============================================
-- Cria trigger automático para criar registro em users após signup
-- Funções auxiliares de validação

-- ============================================
-- 🔄 TRIGGER: Criar User após Signup
-- ============================================

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
  );
  RETURN NEW;
END;
$$;

-- Trigger que executa após inserção em auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ✅ FUNÇÕES DE VALIDAÇÃO
-- ============================================

-- Valida que transações recorrentes não sejam parceladas
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

CREATE TRIGGER validate_transaction_before_insert
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_installments();

-- Valida campos condicionais de Account baseado no tipo
CREATE OR REPLACE FUNCTION validate_account_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Para cartão de crédito
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
  
  -- Para conta corrente/poupança, balance pode ser negativo (cheque especial)
  -- Não há validação específica necessária
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_account_before_insert
  BEFORE INSERT OR UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION validate_account_fields();
