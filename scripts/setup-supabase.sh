#!/bin/bash

# Script de configuração do Supabase para mycash+
# Este script ajuda a configurar o projeto Supabase

echo "🚀 Configuração do Supabase para mycash+"
echo "========================================"
echo ""

# Verificar se .env.local existe
if [ -f ".env.local" ]; then
  echo "⚠️  Arquivo .env.local já existe."
  read -p "Deseja sobrescrever? (s/N): " overwrite
  if [ "$overwrite" != "s" ] && [ "$overwrite" != "S" ]; then
    echo "❌ Cancelado. Mantendo .env.local existente."
    exit 0
  fi
fi

echo "📋 Para obter as credenciais do Supabase:"
echo "1. Acesse: https://app.supabase.com"
echo "2. Crie um novo projeto (se ainda não tiver)"
echo "3. Vá em Settings > API"
echo "4. Copie:"
echo "   - Project URL"
echo "   - anon public key"
echo ""

read -p "Project URL (ex: https://xxxxx.supabase.co): " SUPABASE_URL
read -p "Anon Key (chave longa): " SUPABASE_KEY

# Criar .env.local
cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_KEY}

# Figma API (se ainda estiver usando)
VITE_FIGMA_TOKEN=
EOF

echo ""
echo "✅ Arquivo .env.local criado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Execute as migrations SQL no Supabase Dashboard:"
echo "   - SQL Editor > New Query"
echo "   - Execute cada arquivo em supabase/migrations/ na ordem (001, 002, 003, 004, 005)"
echo ""
echo "2. Reinicie o servidor de desenvolvimento:"
echo "   npm run dev"
echo ""
echo "3. Teste a conexão fazendo login/signup no sistema"
echo ""
