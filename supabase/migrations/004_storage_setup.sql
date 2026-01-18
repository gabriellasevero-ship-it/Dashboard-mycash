-- ============================================
-- 📦 MIGRATION 004: Storage Buckets e Policies
-- ============================================
-- Cria buckets de storage e políticas de acesso

-- ============================================
-- 📁 BUCKETS
-- ============================================

-- Avatares (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Logos de contas/cartões (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'account-logos',
  'account-logos',
  true,
  2097152, -- 2MB
  ARRAY['image/png', 'image/svg+xml', 'image/jpeg']
) ON CONFLICT (id) DO NOTHING;

-- Documentos (privado - opcional para futuro)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 🔒 STORAGE POLICIES - AVATARS
-- ============================================

-- Upload: usuário pode fazer upload do próprio avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Atualizar: usuário pode atualizar próprio avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Deletar: usuário pode deletar próprio avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Leitura pública de avatares (para exibição)
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- ============================================
-- 🔒 STORAGE POLICIES - ACCOUNT LOGOS
-- ============================================

-- Upload: usuário pode fazer upload de logos
CREATE POLICY "Users can upload account logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'account-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Atualizar: usuário pode atualizar logos
CREATE POLICY "Users can update account logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'account-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Deletar: usuário pode deletar logos
CREATE POLICY "Users can delete account logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'account-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Leitura pública de logos
CREATE POLICY "Public account logo access"
ON storage.objects FOR SELECT
USING (bucket_id = 'account-logos');

-- ============================================
-- 🔒 STORAGE POLICIES - DOCUMENTS (Privado)
-- ============================================

-- Upload: apenas usuário autenticado
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Leitura: apenas dono do arquivo
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Atualizar: apenas dono
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Deletar: apenas dono
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
