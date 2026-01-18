/**
 * Script para extrair dados do Sidebar aberto do Figma
 * Node: 42-3097
 */

import { getFigmaNode, exportFigmaImage, extractDesignTokens } from '../src/utils/figmaAPI.js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import https from 'https'
import { createWriteStream, unlink } from 'fs'

const SIDEBAR_OPEN_NODE_ID = '42-3097'

async function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(filepath)
    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      unlink(filepath, () => {})
      reject(err)
    })
  })
}

async function extractSidebarOpen() {
  console.log('🎨 Extraindo dados do Sidebar aberto do Figma...\n')
  console.log(`Node ID: ${SIDEBAR_OPEN_NODE_ID}\n`)

  try {
    // 1. Obter dados do node
    console.log('📥 Obtendo dados do node...')
    const nodeData = await getFigmaNode(SIDEBAR_OPEN_NODE_ID)
    console.log('✅ Dados do node obtidos\n')

    // 2. Extrair tokens
    console.log('📊 Extraindo tokens de design...')
    const tokens = await extractDesignTokens(SIDEBAR_OPEN_NODE_ID)
    
    // Salvar tokens
    const tokensPath = join(process.cwd(), 'figma-sidebar-open-tokens.json')
    await writeFile(tokensPath, JSON.stringify(tokens, null, 2), 'utf-8')
    console.log(`✅ Tokens salvos em: ${tokensPath}\n`)

    // 3. Procurar logo no node
    console.log('🔍 Procurando logo no node...')
    
    // Função recursiva para encontrar logo
    function findLogo(node: any): any {
      if (!node || typeof node !== 'object') return null
      
      // Procurar por nodes que possam ser o logo
      if (node.name && (
        node.name.toLowerCase().includes('logo') ||
        node.name.toLowerCase().includes('mycash') ||
        node.name.toLowerCase().includes('brand')
      )) {
        return node
      }
      
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          const found = findLogo(child)
          if (found) return found
        }
      }
      
      return null
    }

    const logoNode = findLogo(nodeData.document)
    
    if (logoNode) {
      console.log(`✅ Logo encontrado: ${logoNode.name} (ID: ${logoNode.id})\n`)
      
      // Extrair logo
      console.log('📥 Exportando logo...')
      const logoUrl = await exportFigmaImage(logoNode.id.replace(':', '-'), 'svg', 1)
      console.log(`✅ URL do logo obtida: ${logoUrl}`)

      // Download do logo
      const publicDir = join(process.cwd(), 'public')
      await mkdir(publicDir, { recursive: true })
      const logoPath = join(publicDir, 'logo-mycash.svg')
      console.log('💾 Baixando logo...')
      await downloadFile(logoUrl, logoPath)
      console.log(`✅ Logo salvo em: ${logoPath}\n`)
    } else {
      console.log('⚠️ Logo não encontrado no node. Tentando exportar o node completo...\n')
      
      // Tentar exportar o node completo como imagem
      const logoUrl = await exportFigmaImage(SIDEBAR_OPEN_NODE_ID, 'svg', 1)
      console.log(`✅ URL obtida: ${logoUrl}`)
    }

    // 4. Mostrar resumo
    console.log('📊 Resumo dos tokens extraídos:')
    console.log(`  - Cores: ${Object.keys(tokens.colors).length} encontradas`)
    console.log(`  - Espaçamentos: ${Object.keys(tokens.spacing).length} encontrados`)
    console.log(`  - Tipografia: ${Object.keys(tokens.typography.fontSizes).length} tamanhos de fonte`)
    console.log(`  - Radius: ${Object.keys(tokens.radius).length} encontrados\n`)
    
    // Mostrar cores importantes
    console.log('🎨 Cores importantes encontradas:')
    Object.entries(tokens.colors).forEach(([name, color]) => {
      if (name.toLowerCase().includes('logo') || 
          name.toLowerCase().includes('brand') ||
          name.toLowerCase().includes('primary') ||
          name.toLowerCase().includes('btn')) {
        console.log(`  - ${name}: ${color}`)
      }
    })
    console.log('')

    console.log('✨ Extração concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao extrair dados:', error)
    process.exit(1)
  }
}

extractSidebarOpen()
