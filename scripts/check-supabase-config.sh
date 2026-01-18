#!/bin/bash

# Script para verificar configuração do Supabase

echo "🔍 Verificando configuração do Supabase..."
echo ""

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
  echo "❌ Arquivo .env.local não encontrado!"
  echo "   Execute: ./scripts/setup-supabase.sh"
  exit 1
fi

# Verificar variáveis
source .env.local 2>/dev/null

if [ -z "$VITE_SUPABASE_URL" ]; then
  echo "❌ VITE_SUPABASE_URL não configurado no .env.local"
  exit 1
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "❌ VITE_SUPABASE_ANON_KEY não configurado no .env.local"
  exit 1
fi

echo "✅ Arquivo .env.local encontrado"
echo "✅ VITE_SUPABASE_URL: ${VITE_SUPABASE_URL:0:30}..."
echo "✅ VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY:0:20}..."
echo ""
echo "💡 Para testar a conexão, inicie o servidor: npm run dev"
