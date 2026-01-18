/**
 * Script para extrair assets do Figma via MCP
 * 
 * Uso:
 *   npx tsx scripts/extract-figma-assets.ts
 * 
 * Requer servidor MCP do Figma configurado
 */

import { exportFigmaAsset, FIGMA_NODES } from '../src/utils/figmaMCP'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

async function extractAssets() {
  console.log('🎨 Extraindo assets do Figma...\n')

  try {
    // Criar diretório public se não existir
    const publicDir = join(process.cwd(), 'public')
    await mkdir(publicDir, { recursive: true })

    // Extrair logo
    console.log('📥 Extraindo logo...')
    const logoPath = await exportFigmaAsset(
      FIGMA_NODES.LOGO,
      'svg',
      'public/logo-mycash.svg'
    )
    console.log(`✅ Logo extraído: ${logoPath}\n`)

    console.log('✨ Todos os assets foram extraídos com sucesso!')
  } catch (error) {
    if (error instanceof Error && error.message.includes('MCP não está configurado')) {
      console.error('❌ Erro: Figma MCP não está configurado.')
      console.error('📖 Consulte FIGMA-MCP-SETUP.md para instruções de configuração.')
    } else {
      console.error('❌ Erro ao extrair assets:', error)
    }
    process.exit(1)
  }
}

extractAssets()
