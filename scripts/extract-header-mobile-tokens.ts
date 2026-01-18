/**
 * Script para extrair tokens do Header Mobile do Figma
 * Node: 42-3096 (página principal da dashboard)
 * Vamos buscar o header mobile dentro deste node
 */

import { getFigmaNode } from '../src/utils/figmaAPI.js'

const DASHBOARD_NODE_ID = '42-3096'

async function extractHeaderMobileTokens() {
  console.log('🎨 Extraindo tokens do Header Mobile do Figma...\n')
  console.log(`Node ID: ${DASHBOARD_NODE_ID}\n`)

  try {
    // 1. Obter dados do node da dashboard
    console.log('📥 Obtendo dados do node da dashboard...')
    const nodeData = await getFigmaNode(DASHBOARD_NODE_ID)
    console.log('✅ Dados do node obtidos\n')

    // 2. Procurar o header mobile no node
    const document = nodeData.document
    
    // Salvar o JSON completo para análise
    const fs = await import('fs/promises')
    await fs.writeFile(
      'figma-header-mobile-tokens.json',
      JSON.stringify(nodeData, null, 2)
    )
    console.log('💾 JSON completo salvo em: figma-header-mobile-tokens.json\n')

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

    console.log('✨ Análise do Header Mobile concluída!')
    console.log('   Verifique o arquivo figma-header-mobile-tokens.json para detalhes.')
  } catch (error) {
    console.error('❌ Erro ao extrair tokens:', error)
    process.exit(1)
  }
}

extractHeaderMobileTokens()
