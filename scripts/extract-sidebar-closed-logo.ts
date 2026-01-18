/**
 * Script para extrair logo do Sidebar fechado do Figma
 * Node: 30-1520
 */

import { getFigmaNode, exportFigmaImage } from '../src/utils/figmaAPI.js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import https from 'https'
import { createWriteStream, unlink } from 'fs'

const SIDEBAR_CLOSED_LOGO_NODE_ID = '30-1520'

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

async function extractClosedLogo() {
  console.log('🎨 Extraindo logo do Sidebar fechado do Figma...\n')
  console.log(`Node ID: ${SIDEBAR_CLOSED_LOGO_NODE_ID}\n`)

  try {
    // 1. Obter dados do node
    console.log('📥 Obtendo dados do node...')
    const nodeData = await getFigmaNode(SIDEBAR_CLOSED_LOGO_NODE_ID)
    console.log('✅ Dados do node obtidos\n')

    // 2. Tentar exportar o node como imagem
    console.log('📥 Exportando logo...')
    const logoUrl = await exportFigmaImage(SIDEBAR_CLOSED_LOGO_NODE_ID, 'svg', 1)
    console.log(`✅ URL do logo obtida: ${logoUrl}`)

    // 3. Download do logo
    const publicDir = join(process.cwd(), 'public')
    await mkdir(publicDir, { recursive: true })
    const logoPath = join(publicDir, 'logo-mycash-collapsed.svg')
    console.log('💾 Baixando logo...')
    await downloadFile(logoUrl, logoPath)
    console.log(`✅ Logo salvo em: ${logoPath}\n`)

    // 4. Mostrar informações do node
    const document = nodeData.document
    console.log(`📊 Informações do logo:`)
    console.log(`  - Nome: ${document.name}`)
    console.log(`  - Tipo: ${document.type}`)
    if (document.absoluteBoundingBox) {
      console.log(`  - Dimensões: ${document.absoluteBoundingBox.width} x ${document.absoluteBoundingBox.height}`)
    }
    console.log('')

    console.log('✨ Logo do sidebar fechado extraído com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao extrair logo:', error)
    process.exit(1)
  }
}

extractClosedLogo()
