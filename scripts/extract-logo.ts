/**
 * Script para extrair logo do Figma
 * 
 * Uso:
 *   npx tsx scripts/extract-logo.ts
 */

import { exportFigmaImage, FIGMA_NODES } from '../src/utils/figmaAPI.js'
import { mkdir } from 'fs/promises'
import { join } from 'path'
import https from 'https'
import { createWriteStream, unlink } from 'fs'

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

async function extractLogo() {
  console.log('🎨 Extraindo logo do Figma...\n')

  try {
    // Criar diretório public se não existir
    const publicDir = join(process.cwd(), 'public')
    await mkdir(publicDir, { recursive: true })

    // Exportar logo como SVG
    console.log('📥 Exportando logo do Figma...')
    const logoUrl = await exportFigmaImage(FIGMA_NODES.LOGO, 'svg', 1)
    console.log(`✅ URL do logo obtida: ${logoUrl}`)

    // Download do arquivo
    const logoPath = join(publicDir, 'logo-mycash.svg')
    console.log('💾 Baixando logo...')
    await downloadFile(logoUrl, logoPath)
    console.log(`✅ Logo salvo em: ${logoPath}\n`)

    console.log('✨ Logo extraído com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao extrair logo:', error)
    process.exit(1)
  }
}

extractLogo()
