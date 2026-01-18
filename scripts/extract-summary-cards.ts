/**
 * Script para extrair valores dos Cards de Resumo do Figma
 * Node: 42-3096 (dashboard principal)
 * Vamos buscar os cards de resumo dentro deste node
 */

import { getFigmaNode } from '../src/utils/figmaAPI.js'
import { writeFile } from 'fs/promises'

const DASHBOARD_NODE_ID = '42-3096'

async function extractSummaryCards() {
  console.log('🎨 Extraindo valores dos Cards de Resumo do Figma...\n')
  console.log(`Node ID: ${DASHBOARD_NODE_ID}\n`)

  try {
    // 1. Obter dados do node da dashboard
    console.log('📥 Obtendo dados do node da dashboard...')
    const nodeData = await getFigmaNode(DASHBOARD_NODE_ID)
    console.log('✅ Dados do node obtidos\n')

    // 2. Salvar o JSON completo para análise
    await writeFile(
      'figma-summary-cards-tokens.json',
      JSON.stringify(nodeData, null, 2)
    )
    console.log('💾 JSON completo salvo em: figma-summary-cards-tokens.json\n')

    const document = nodeData.document
    
    console.log('📊 Estrutura do node:')
    console.log(`  - Nome: ${document.name}`)
    console.log(`  - Tipo: ${document.type}`)
    if (document.children) {
      console.log(`  - Número de children: ${document.children.length}`)
      console.log(`  - Children:`)
      document.children.forEach((child: any, index: number) => {
        console.log(`    ${index + 1}. ${child.name} (${child.type})`)
      })
    }
    console.log('')

    console.log('✨ Análise dos Cards de Resumo concluída!')
    console.log('   Verifique o arquivo figma-summary-cards-tokens.json para detalhes.')
  } catch (error) {
    console.error('❌ Erro ao extrair tokens:', error)
    process.exit(1)
  }
}

extractSummaryCards()
