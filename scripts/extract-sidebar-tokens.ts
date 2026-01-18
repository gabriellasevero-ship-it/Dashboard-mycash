/**
 * Script para extrair tokens de design da Sidebar do Figma
 * 
 * Uso:
 *   npx tsx scripts/extract-sidebar-tokens.ts
 */

import { extractDesignTokens, FIGMA_NODES } from '../src/utils/figmaAPI.js'
import { writeFile } from 'fs/promises'
import { join } from 'path'

async function extractTokens() {
  console.log('🎨 Extraindo tokens de design da Sidebar do Figma...\n')

  try {
    // Extrair tokens da Sidebar
    console.log('📥 Extraindo tokens do node Sidebar...')
    const tokens = await extractDesignTokens(FIGMA_NODES.SIDEBAR)
    
    // Criar arquivo JSON com os tokens extraídos
    const outputPath = join(process.cwd(), 'figma-sidebar-tokens.json')
    await writeFile(outputPath, JSON.stringify(tokens, null, 2), 'utf-8')
    
    console.log(`✅ Tokens extraídos e salvos em: ${outputPath}\n`)
    console.log('📊 Resumo dos tokens extraídos:')
    console.log(`  - Cores: ${Object.keys(tokens.colors).length} encontradas`)
    console.log(`  - Espaçamentos: ${Object.keys(tokens.spacing).length} encontrados`)
    console.log(`  - Tipografia: ${Object.keys(tokens.typography.fontSizes).length} tamanhos de fonte`)
    console.log(`  - Radius: ${Object.keys(tokens.radius).length} encontrados\n`)
    
    console.log('✨ Tokens extraídos com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao extrair tokens:', error)
    process.exit(1)
  }
}

extractTokens()
